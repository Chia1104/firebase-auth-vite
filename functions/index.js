/** 
 * Structure 
 * 1 includes
 * 2 configation
 * 3 HTTP triggers: image generator
 * 4 Storage triggered: Scan images
 * 
*/
'use strict';
/* ~~~~~~~~~~~~ 1. includes ~~~~~~~~~~~~~ */
const sharp = require('sharp')
// Firebase setup
const functions = require('firebase-functions');
const admin = require('firebase-admin');
// const { encode } = require('pluscodes')
// Node.js core modules
// const ExifReader = require('exif-reader');
const exifr = require('exifr');
// const fs = require('fs');
// const mkdirp = require('mkdirp') //fs.promises.mkdir;
// const {  promisify} = require('util');
// const exec = promisify(require('child_process').exec);
const path = require('path');
const os = require('os');
// Vision API
const vision = require('@google-cloud/vision');

/* ~~~~~~~~~~~~ 2. config ~~~~~~~~~~~~~ */
const TEST_MODE=false
const testData = 'test/annotations_data.json';
  // Where we'll config
const UPLOADS_FOLDER = 'uploads';
const PROCESSED_FOLDER = 'processed';
// File extension for the created JPEG files.
const THUMBNAILS_FOLDER = 'thumbs';
const NOTFOUND = 'notfound'

const GS_URL_PREFIX="https://storage.googleapis.com/run-pix.appspot.com/"
const JPEG_EXTENSION = '.jpg';
const WATERMARK_PATH = (x) =>  `ref/watermark/${x}.png`
const bibRegex = /^[A-Z]{0,1}[0-9]{3,5}$/;

const RESIZE_OPTION = process.env.RESIZE_OPTION ? 
                JSON.parse(process.env.RESIZE_OPTION) : 
                {
                  width: 3072,
                  height: 3072,
                  fit: sharp.fit.inside,
                  position: sharp.strategy.entropy
                }
const THUMBSIZE_OPTION = process.env.THUMBSIZE_OPTION ? 
                JSON.parse(process.env.THUMBSIZE_OPTION) : 
                {
                  width: 400,
                  height: 300,
                  fit: sharp.fit.inside,
                  position: sharp.strategy.entropy
                }
const JPG_OPTIONS = process.env.JPG_OPTIONS ? JSON.parse(process.env.JPG_OPTIONS) :
            {quality: 85, progressive: true}
const THUMB_JPG_OPTIONS = process.env.JPG_OPTIONS ? JSON.parse(process.env.JPG_OPTIONS) :
            {quality: 50}
const NOTIMING_WAYPOINTS = process.env.NOTIMING_WAYPOINTS ?
            JSON.parse(process.env.NOTIMING_WAYPOINTS) : ['venue','general']
    


const debug = process.env.DEBUG_MODE ? functions.logger.debug : ()=>{}
const log=functions.logger.log
const error=functions.logger.error

admin.initializeApp();

// Since this code will be running in the Cloud Functions environment
// we call initialize Firestore without any arguments because it
// detects authentication from the environment.
const firestore = admin.firestore();
firestore.settings({ ignoreUndefinedProperties: true })

let watermarks={}; //key="raceId" : watermark sharp image


/* ~~~~~~~~~~~~ 3. HTTPS functions  ~~~~~~~~~~~~~ */
 
 const express = require('express');
 const exphbs = require('express-handlebars');
 const app = express();
//  const firebaseUser = require('./firebaseUser');
 
 app.engine('handlebars', exphbs.engine({defaultLayout: 'main'}));
 app.set('view engine', 'handlebars');
 //  app.use(firebaseUser.validateFirebaseIdToken);

 /**
 * Get dynamic page showing the image
 * Need page url, photo url, thumb url, link event/bib search,
 */ 
  app.get('/image/:imagePath', (req, res) => {
    // @ts-ignore
    //test link http://localhost:5000/image/d2VydW4yMDIzLzUwMzEvMjAyMy0wMy0xM1QxNjozODowMy41Njg5NzN+Z2VuZXJhbH52YWliaGF2flNfRzAzMDAzLmpwZw==
    let p = mapParams(req.params)
    return renderImage(res, req, p, );
    
   });
   
 
 app.get('/image/:raceId/:bibNo/:imagePath', (req, res) => {
  // @ts-ignore
  //test link http://localhost:5000/image/werun2023/5031/2023-03-13T16:38:03.568973~general~vaibhav~S_G03003.jpg
  let p = mapParams(req.params)
  return renderImage(res, req, p, );
  
 });
 
 app.get('*', function(req, res){
  res.send(`Error finding the resource for the URL ${req.url}
  <br/>
  Data: ${JSON.stringify(req.params)}` , 404);
});

function renderImage(res, req, p, ) {
  return res.render('image', {
    imageUrl: p.imageUrl,
    previewUrl: p.imageUrl,
    bibNo: p.bibNo,
    raceId: p.raceId,
    pageUrl: p.pageUrl,
    params: JSON.stringify(req.params),
  });
}

// import { Buffer } from 'buffer';
function mapParams(params){
  // log(params)
  let raceId,bibNo,imagePath;
  if (!params.raceId) {
    let buff = new Buffer.from(params.imagePath, 'base64');
    [raceId,bibNo,imagePath] = buff.toString('ascii').split('/');

  } else {
    raceId= params.raceId
    bibNo=params.bibNo
    imagePath=params.imagePath
  }
  // sample image "https://storage.googleapis.com/run-pix.appspot.com/processed/werun2023/2023-03-13T16:38:03.568973~general~vaibhav~S_G03003.jpg"
  const imageUrl = imagePath.endsWith(JPEG_EXTENSION) ? 
                    `${GS_URL_PREFIX}processed/${raceId}/${imagePath}` :
                    `${GS_URL_PREFIX}processed/${raceId}/${imagePath}${JPEG_EXTENSION}` ;
  //  log('Signed-in user:', user);
  const url = `https://run-pix.web.app/p/${raceId}/${bibNo}`
  return {imageUrl:imageUrl,
          bibNo:bibNo,
          raceId: raceId,
          pageUrl:url}
}
 // This HTTPS endpoint can  be made accessed by `Authorization` HTTP header
 // with value `Bearer <Firebase ID Token>`.  Not used
 exports.api = functions.https.onRequest(app);

/* ~~~~~~~~~~~~ 4. Storage functions  ~~~~~~~~~~~~~ */


/**
 * When an image is uploaded a) check texts Cloud Vision, JPG conv and update in firestores
 * input   {bucket:'',name:'uploads/event/personId/image'}
 * a) Process photos
 * - prefixed folder
 * - read EXIF
 * - JPG conversion (low)
 * - update in firestore
 *    - all text annotations --- 
 *      - image...textJSON
 * 
 * B)  upload reading
 *    - bib matching annotations
 *    - update readings
 * 
 * '{"bucket":"run-pix.appspot.com","name":"uploads/werun2023/2023-03-13T19:25:41.041091~general~vaibhav~_L3A3047.jpg","contentType":"image/jpeg"}'
 * "{\"bucket\":\"run-pix.appspot.com\",\"name\":\"uploads/werun2023/2023-03-13T19:25:41.041091~general~vaibhav~_L3A3047.jpg\",\"contentType\":\"image/jpeg\"}"
 */

exports.ScanImages = functions.storage.object().onFinalize(async (object) => {

  // Ignore images not in uploads
  if (! object.name.startsWith(`${UPLOADS_FOLDER}/`) && 
      ! object.name.startsWith(`test/`)) {  
    // Exit if this is triggered on a file that is not an image.
    if (!object.contentType.startsWith('image/')) {
      log(`Ignoring upload "${object.name}"  is not an image.`);
      return null;
    }
    log(`Ignoring upload "${object.name}" because not in ${UPLOADS_FOLDER}/.`);
    return null;
  }

  var [folder, raceId, waypoint, userId, date, gps, fileName] = parseObjName(object.name)
  if (raceId=='default')
    log(object,folder, raceId, waypoint, userId, date, gps, fileName)


  let data;
  // Check the image content using the Cloud Vision API.
  try {
    if (TEST_MODE) { //TEST mode?  if you can read from firestore
      data = [{"textAnnotations":[]}]//JSON.parse(fs.readFileSync(testData, 'utf8')) ;
    } else {
      const visionClient = new vision.ImageAnnotatorClient();
      data = await visionClient.textDetection(
        `gs://${object.bucket}/${object.name}`
      );
      if (false)
      fs.writeFile(testData, JSON.stringify(data), 'utf8', (err) => {
        if (err) throw err;
        log(`The file size ${testData.length} has been saved!`);
      });
    }
  } catch (e) {
    log(`error running computer vision ${testData} ${JSON.stringify(e)}`)
  }
  
  const detections = data[0].textAnnotations;
  
  // save images/ref data
  try {
    // log(`getting EXIF/JPG conversion "${object.name}"`);
    /** get metadata from the filename race_wpt_user_timestamp */
    
    var attrs = await compressImage(raceId,object.name, object.bucket, {});
    
    // log("open waypointation codes")
    // var pluscode=encode({  latitude: attrs.latitude,longitude: attrs.longitude})
    log(`Readings results on image "${object.name}"`, detections.length);
    let texts=[];    
    for (let i = 0; i < detections.length; i++) {
      let d=detections[i]
      // only if it looks like a bib
      if (d.description.match(bibRegex)) {
        try{

          let score = processBounding(d.boundingPoly, getImageHeight(attrs))

          // log(i,raceId, userId, d.description, isoDate, score, attrs.imagePath)
          if (NOTIMING_WAYPOINTS.indexOf(waypoint)>=0){
            await updFSReadings(raceId, userId, d.description, getIsoDate(date), score, 
                  waypoint, attrs )
          }
          // add only new texts in all cases
          if(texts.indexOf(d.description)==-1)
            texts.push(d.description);
        } 
        catch (e) {
          error('error updFSReadings',e)
        }
      }
    };

    // Saving Image data in firestore.. referred image should be jpg
    log(`updating firestore on image data`)
    await updFSImageData(raceId,fileName, detections, texts, attrs)

  } catch (e) {
    error(`Error in image processing "${object.name}"`, e);
  }

  // log('all done')
  return null;

});

async function compressImage(raceId,filePath, bucketName, metadata) {

  const fileName = filePath.split('/').pop();
  const newFileName = fileName.replace(/\.png$/, ".jpg")
  const newFilePath = `${PROCESSED_FOLDER}/${raceId}/${newFileName}`
  const thumbsPath = `${THUMBNAILS_FOLDER}/${raceId}/${newFileName}`
  let image, watermark;

  // log(">>>",raceId, fileName)

  const bucket = admin.storage().bucket(bucketName);
  

  try{
    let imgMetadata;
    [image, imgMetadata] = await getImageMetadata(bucket,filePath).catch(error);  
    metadata = Object.assign( metadata, imgMetadata)
    
  } catch (e) {
    error("getImageMetadata",e)
  }

  // check if watermark exists for the race
  if (!watermarks[raceId]) {
    // return as a array
    [watermarks[raceId]] = await getImageMetadata(bucket,WATERMARK_PATH(raceId),false)
                    .catch((e)=>{
                      functions.logger.warn(`Watermark not found ${WATERMARK_PATH(raceId)}`)
                      watermarks[raceId]=NOTFOUND
                      return [NOTFOUND]
                    });  
    // log('reading watermark')
    
  }

  log(`Saving JPG ${newFilePath}`)
  await saveJPG(bucket, newFilePath, image, metadata, watermarks[raceId]);
  // log(">>>>",JSON.stringify(await image.metadata()).substring(0,200))

  log(`Saving thumb ${thumbsPath}`)
  saveThumb(bucket, thumbsPath, image, metadata);

  let attrs=Object.assign(metadata, {
    imagePath: newFilePath,
  })
  // log("metadata",metadata)
  return attrs
}

async function getImageMetadata(bucket,filePath,metadataReqd=true) {
  // Downloads the file into a buffer in memory.
  const contents =   await bucket.file(filePath).download();
  let img
  try{
      img = sharp(contents[0])// contents
  } catch {
    error(`can't make sharp object for ${filePath}`)
  }
  if (metadataReqd){
    var imgMetadata =  await exifr.parse(contents[0],true)
  }
  return [img, imgMetadata]
}

/**
 * Saves image in storage after a) resize b) watermark
 * @param {*} bucket 
 * @param {*} filePath 
 * @param {*} image 
 * @param {*} metadata 
 * @param {*} watermarkImg 
 * @returns 
 */
async function saveJPG(bucket, filePath, image, metadata, watermarkImg) {

  // Create Sharp pipeline for resizing the image and use pipe to read from bucket read stream
  const transformer = sharp(); 
  transformer.resize(  RESIZE_OPTION )
              .jpeg(JPG_OPTIONS)

  // log(">>>3",JSON.stringify(await image.metadata()).substring(0,200))  
  // log(await watermarkImg.metadata())
    
  if (watermarkImg && (watermarkImg!=NOTFOUND)){
    let _width = Object.keys(metadata).filter(x=>x.includes('idth')).map(x=>metadata[x])[0]
    // let metadata_jpg=await image.metadata()
    // log(">>>4", RESIZE_OPTION.width,_width)
    
    let adjWm=await watermarkImg.resize({ width: RESIZE_OPTION.width})
                                .toBuffer()
    console.log(await exifr.parse(adjWm))
      
    transformer
      .composite([{ input: adjWm, gravity: 'south',
    }])
    // log('watermark done')
  } 
  // else {error('watermarkImg',watermarkImg && (watermarkImg!=NOTFOUND))}

  const remoteWriteStream = bucket.file(filePath).createWriteStream(metadata);
  await image
      .pipe(transformer)
      // .jpeg(JPG_OPTIONS)
      .pipe(remoteWriteStream)
    // .then(()=>log(`Writing watermarked image: ${newFilePath}`))
    // .catch((e)=>{error(`error in saveJPG() ${JSON.stringify(e)}`)});
  return image
}

function saveThumb(bucket, filePath, image,metadata) {

  // Create write stream for uploading thumbnail
  // const thumbnailUploadStream = bucket.file(thumbFilePath).createWriteStream({metadata});
  const remoteWriteStream = bucket.file(filePath).createWriteStream({metadata});

  // Create Sharp pipeline for resizing the image and use pipe to read from bucket read stream
  const transformer = sharp();
  
  transformer.resize(  THUMBSIZE_OPTION)
             .jpeg(THUMB_JPG_OPTIONS)

  image
    .pipe(transformer)
    .toFormat('jpg')
    .pipe(remoteWriteStream);

  
}

// Based on EXIF rotation metadata, get the right-side-up width and height:
function getNormalSize({
  width,
  height,
  orientation
}) {
  return (orientation || 0) >= 5 ? {
    width: height,
    height: width
  } : {
    width,
    height
  };
}


/** return bounding box 
 */
 function processBounding(boundingPoly, height) {
  const start = 1, //2nd point  top right
    end = 2; //3rd point    bottom right
  let heightPixels;
  if (boundingPoly.vertices.length == 4) {
    // log(JSON.stringify(boundingPoly.vertices,2))
    heightPixels = Math.sqrt(Math.abs((boundingPoly.vertices[start].x - boundingPoly.vertices[end].x) ** 2 -
      (boundingPoly.vertices[start].y - boundingPoly.vertices[end].y) ** 2)).toFixed(2)
      // return boundingPoly.vertices.map(pt => `${pt.x},${pt.y}`).join("/") + ` score ${heightPixels*100/height}`
    // log(heightPixels,typeof(heightPixels),height,typeof(height))
    return parseInt(heightPixels*100/height)
  }
  error('number of corner for bounding ploy is not 4...not supposed to happen')

}


async function updFSImageData(raceId, imagePath, detections, texts,exifdata) {
  let timestamp = new Date().toISOString()
  debug(`writing to firestore ${imagePath}`)
  return await admin.firestore()
                .collection('races').doc(raceId)
                .collection('images').doc(imagePath)
                .set({
    imagePath: imagePath,
    texts: texts,
    timestamp: timestamp,
    textAnnotations: detections,
    metadata: exifdata
  });
}

async function updFSReadings(raceId, userId, bibStr, timestamp, score, 
                             waypoint, attrs ) {
  
  let x= await admin.firestore()
    .collection('races').doc(cleanForFS(raceId))
    .collection("readings").doc(cleanForFS([timestamp,bibStr].join("_")))
    .set({
      bib: bibStr,
      userId: userId,
      imagePath: attrs.imagePath,
      waypoint: waypoint,
      // latlng: new admin.firestore.GeoPoint(parseFloat(latitude), parseFloat(longitude)),
      timestamp: timestamp,
      score: score
    })
  .then((x) => {
      return x
  })
  .catch((error) => {
      error("Error writing document: ", error);
      return error
  });
  // log(x)
}

function getIsoDate(date){
  try{
    var isoDate = date.replace(/\.[^/.]+$/, "")
  } catch (e) {
    isoDate = '2000-01-01T10:00:00.000Z' // default date
  }
  return isoDate

}

function parseObjName(name){
  // uploads/race/wpt~time~user~waypoint
  // uploads/mychoice23mar/2022-01-13T12:23:36.476Z~start~avinashmane@gmail.com~9955-3Certificate.png
  var raceId='default', 
      waypoint='general',
      userId='unknown', 
      date='nodate',
      gps='',
      folder,
      fileName;
      
  try {
    name=name.charAt(0)=='/'?name.substring(1):name;

    var names = name.split(/[\/^~]/g)
    if (names.length==7) 
      [folder,raceId, date, waypoint, userId, gps, fileName]=names
    else if (names.length==6) 
      [folder,raceId, date, waypoint, userId, fileName]=names
    else if (names.length==5) 
      [folder,raceId, date,userId, fileName]=names
    else if (names.length==4) 
      [folder,raceId, userId,fileName]=names
    else if (names.length==3) 
      [folder,raceId, fileName]=names
  } catch (e) {
    error('error',e)
  }

  fileName=name.split('/').pop()

  return [folder, raceId,waypoint,  userId, date, gps, fileName]
}

function encodeKey(x){
  return x.replace(/[\\\/]/g,"~")
}
function decodeKey(){
  return x.replace(/[\^]/g,"/")
}


function cleanForFS(s) {
  return s.replace(/[\/]/g,"_")
}


function getImageHeight(meta){
  return meta.Orientation=="Horizontal (normal)"? meta.ImageHeight : meta.ImageWidth
  // return (meta.orientation || 0) >= 5 ? meta.height : meta.width;
}

// async function generateThumbnail (object) {
//   const fileBucket = object.bucket; // The Storage bucket that contains the file.
//   const filePath = object.name; // File path in the bucket.
//   const contentType = object.contentType; // File content type.

//   // Exit if this is triggered on a file that is not an image.
//   if (!contentType.startsWith('image/')) {
//     functions.logger.log('This is not an image.');
//     return null;
//   }

//   // Get the file name.
//   const fileName = path.basename(filePath);
//   // Exit if the image is already a thumbnail.
//   if (fileName.startsWith(THUMBNAILS_FOLDER)) {
//     functions.logger.log('Already a Thumbnail.');
//     return null;
//   }

//   // Download file from bucket.
//   const bucket = admin.storage().bucket(fileBucket);  //gcs.bucket old

//   const metadata = {
//     contentType: contentType,
//   };
//   // We add a 'thumb_' prefix to thumbnails file name. That's where we'll upload the thumbnail.
//   const thumbFileName = `${THUMBNAILS_FOLDER}/${fileName}`;
//   const thumbFilePath = path.join(path.dirname(filePath), thumbFileName);
//   // Create write stream for uploading thumbnail
//   const thumbnailUploadStream = bucket.file(thumbFilePath).createWriteStream({metadata});

//   // Create Sharp pipeline for resizing the image and use pipe to read from bucket read stream
//   const transformer = sharp();
//   // pipeline.resize(THUMB_MAX_WIDTH, THUMB_MAX_HEIGHT).max().pipe(thumbnailUploadStream);
//   transformer.resize(  {
//     width: THUMB_MAX_WIDTH,
//     height: THUMB_MAX_HEIGHT,
//     fit: sharp.fit.inside,
//     position: sharp.strategy.entropy
//   });

//   bucket.file(filePath)
//         .createReadStream()
//         .pipe(transformer)
//         .pipe(thumbnailUploadStream);

//   return new Promise((resolve, reject) =>
//       thumbnailUploadStream.on('finish', resolve).on('error', reject));
// }

// function listTags(tags) {
//   for (const group in tags) {
//     for (const name in tags[group]) {
//       if (group === 'gps') {
//         console.log(`${group}:${name}: ${tags[group][name]}`);
//       } else if ((group === 'Thumbnail') && (name === 'type')) {
//         console.log(`${group}:${name}: ${tags[group][name]}`);
//       } else if ((group === 'Thumbnail') && (name === 'image')) {
//         console.log(`${group}:${name}: <image>`);
//       } else if ((group === 'Thumbnail') && (name === 'base64')) {
//         console.log(`${group}:${name}: <base64 encoded image>`);
//       } else if ((group === 'mpf') && (name === 'Images')) {
//         console.log(`${group}:${name}: ${getMpfImagesDescription(tags[group][name])}`);
//       } else if (Array.isArray(tags[group][name])) {
//         console.log(`${group}:${name}: ${tags[group][name].map((item) => item.description).join(', ')}`);
//       } else {
//         console.log(`${group}:${name}: ${typeof tags[group][name].description === 'string' ? tags[group][name].description.trim() : tags[group][name].description}`);
//       }
//     }
//   }
// }