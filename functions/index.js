/** 
 * Structure 
 * 1 includes
 * 2 configation
 * 3 HTTP triggers: image generator
 * 4 Firestore triggered
 * 5. Storage triggered: Scan images
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

// Vision API
const vision = require('@google-cloud/vision');

/* ~~~~~~~~~~~~ 2. config ~~~~~~~~~~~~~ */
// options for triggers
const defaultFor= (OPTION,default_)=>{
  let cfg 
  try {
    if (process.env[OPTION]) 
      cfg= JSON.parse(process.env[OPTION]) 
    else
      cfg= default_
  } catch (e) {debug(e)}
  // console.debug(">>>",OPTION,process.env[OPTION],cfg)
  return cfg
}


const RUNTIME_OPTION = defaultFor("RUNTIME_OPTION",{
                          ScanImages: {
                            vision: true ,
                            disabled : false
                          }
                        })

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

const RESIZE_OPTION = defaultFor("RESIZE_OPTION", {
                  width: 3072,
                  height: 3072,
                  fit: sharp.fit.inside,
                  position: sharp.strategy.entropy
                })
const THUMBSIZE_OPTION = defaultFor("THUMBSIZE_OPTION",{
                  width: 400,
                  height: 300,
                  fit: sharp.fit.inside,
                  position: sharp.strategy.entropy
                })
const JPG_OPTIONS = defaultFor("JPG_OPTIONS",{quality: 60, progressive: true})
const THUMB_JPG_OPTIONS = defaultFor("JPG_OPTIONS",{quality: 30, progressive: true})
            
const NOTIMING_WAYPOINTS = defaultFor("NOTIMING_WAYPOINTS", ['VENUE','venue','general'])
const META_KEYS=['ImageHeight','ImageWidth','ExifVersion', 'DateCreated', 'WhiteBalance', 'FocalLength', 'DigitalCreationTime', 
              'DateTimeOriginal', 'OffsetTimeOriginal', 'CreateDate', 'SubSecTimeOriginal', 'ModifyDate', 
              'ApproximateFocusDistance', 'OriginalDocumentID', 'format', "ShutterSpeedValue",
              'Artist', 'ExposureCompensation', "ImageUniqueID", 'Lens', "FocalLengthIn35mmFormat",
              'Make',"Model", 'ExposureTime', 'LensModel', 'PreservedFileName', 'Flash', 'ISO',"latitude","longitude"]    

const DEBUG_MODE = defaultFor("DEBUG_MODE",2)

const debug = DEBUG_MODE>2 ? functions.logger.debug : ()=>{}
const log= DEBUG_MODE>1 ? functions.logger.log: ()=>{}
const error=  functions.logger.error

// Since this code will be running in the Cloud Functions environment
// we call initialize Firestore without any arguments because it
// detects authentication from the environment.
let cfg ;
if(admin.apps.length==0) {
  admin.initializeApp();
  admin.firestore().settings({ ignoreUndefinedProperties: true });
  admin.firestore().doc('app/config').onSnapshot(snap=>cfg=snap.data())
}

// functions.storage.bucket('run-pix.appspot.com')
let watermarks={}; //key="raceId" : watermark sharp image

let race_cfg={};
const getRaceCfg= (race) =>  { 
  if (!race_cfg[race])
    return admin.firestore().doc(`races/${race}`)
        .onSnapshot(snap=>{race_cfg[race]=snap.data();
          return race_cfg[race] 
        })
  return race_cfg[race]
}


/* ~~~~~~~~~~~~ 3. HTTPS functions  ~~~~~~~~~~~~~ */
 
 const express = require('express');
 const exphbs = require('express-handlebars');
// const { assert } = require('chai');
 const app = express();
//  const firebaseUser = require('./firebaseUser');
 
 app.engine('handlebars', exphbs.engine({defaultLayout: 'main'}));
 app.set('view engine', 'handlebars');
 //  app.use(firebaseUser.validateFirebaseIdToken);

 /**
 * Get dynamic page showing the image
 * Need page url, photo url, thumb url, link event/bib search,
 */ 
  app.get('/image/:imagePath',async (req, res) =>  {
    // @ts-ignore
    //test link http://localhost:5000/image/d2VydW4yMDIzLzUwMzEvMjAyMy0wMy0xM1QxNjozODowMy41Njg5NzN+Z2VuZXJhbH52YWliaGF2flNfRzAzMDAzLmpwZw==
    let p = await mapParams(req.params);
    
    return renderImage(res, req, p, );
    
   });
   
 
  app.get('/image/:raceId/:bibNo/:imagePath', async (req, res) => {
    // @ts-ignore
    //test link http://localhost:5000/image/werun2023/5031/2023-03-13T16:38:03.568973~general~vaibhav~S_G03003.jpg
    
    let p = await mapParams(req.params)

    return renderImage(res, req, p, );
    
 });
 
 app.get('*', function(req, res){
  res.send(`Error finding the resource for the URL ${req.url}
  <br/>
  Data: ${JSON.stringify(req.params)}` , 404);
});

function renderImage(res, req, p, ) {
  // preview URL same is image URL
  if (p.imageUrl) p.previewUrl= p.imageUrl

  return res.render('image', p)//{
  //   imageUrl: p.imageUrl,
  //   previewUrl: p.imageUrl,
  //   bibNo: p.bibNo,
  //   raceId: p.raceId,
  //   pageUrl: p.pageUrl,
  //   raceOrg: p.raceOrg
  //   params: JSON.stringify(req.params),
  // });
}

/**
 * Map parameters and also read race from firebase
 * @param {*} params 
 * @returns 
 */
async function mapParams(params){
  // log(params)
  let p={raceId:null,bibNo:null,imagePath:null};//raceId,bibNo,imagePath;
  if (!params.raceId) {
    let buff = new Buffer.from(params.imagePath, 'base64');
    [p.raceId,p.bibNo,p.imagePath] = buff.toString('ascii').split('/');

  } else {
    p.raceId= params.raceId
    p.bibNo=params.bibNo
    p.imagePath=params.imagePath
  }
  
  // let race =  await firebaseGet(`races/${p.raceId}`);
  let race =  getRaceCfg(p.raceId);
  p.Name = race.Name
  p.Location = race.Location
  p.raceDate = (race.Date && race.Date.length>10) ? race.Date.substring(0,10) : race.Date
  p.linkOrg = race.linkOrg
  p.raceOrg = race.raceOrg
  p.timeImage = new Date(p.imagePath.split("~")[0])
  // sample image "https://storage.googleapis.com/run-pix.appspot.com/processed/werun2023/2023-03-13T16:38:03.568973~general~vaibhav~S_G03003.jpg"
  p.imageUrl = `${GS_URL_PREFIX}processed/${p.raceId}/${p.imagePath.replace(/\.jpg|\.png/,JPEG_EXTENSION)}` ;
  //  log('Signed-in user:', user);
  p.pageUrl = `https://run-pix.web.app/p/${p.raceId}/${p.bibNo}`
  return p
}
 // This HTTPS endpoint can  be made accessed by `Authorization` HTTP header
 // with value `Bearer <Firebase ID Token>`.  Not used
exports.api = functions.https.onRequest(app);
/* ~~~~~~~~~~~~ 4. Firestore functions  ~~~~~~~~~~~~~ */

// Listen for changes in all documents in the 'users' collection and all subcollections
exports.imageUpdate = functions.firestore
    .document('races/{raceId}/images/{imagePath}')
    .onUpdate((change, context) => {
      /**
       * check the type of update (delete/update/create)
       * if old.status='active' new.status="inactive":
       *    delete all reading entries
       *    delete thumb/and processed images
       * if old.status='active' new.status="updBib":
       *    update new readings with bib for each texts
       *    reprocess bib
       *    status=active
       * if old.status='active' new.status="updOrientation:90":
       *    turn the thumb & processed
       */
       if (RUNTIME_OPTION.imageUpdate && RUNTIME_OPTION.imageUpdate.disabled) {
          log(`Function is disabled due to RUNTIME_OPTION.imageUpdate.disabled=${RUNTIME_OPTION.imageUpdate.disabled}`);
          return null;
        }
      // If we set `/users/marie/incoming_messages/134` to {body: "Hello"} then
      // context.params.userId == "marie";
      // context.params.messageCollectionId == "incoming_messages";
      // context.params.messageId == "134";
      // ... and ...
      // change.after.data() == {body: "Hello"}
      debug(context.params)
      // console.debug(change)
      return {change,context}
    });


/* ~~~~~~~~~~~~ 5. Storage functions  ~~~~~~~~~~~~~ */

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

exports.ScanImages = functions.runWith({
    memory: "1GB", // Ensure the function has enough memory and time
  }).storage.object().onFinalize(async (object) => {

  if (RUNTIME_OPTION.ScanImages && RUNTIME_OPTION.ScanImages.disabled) {
        log(`Function is disabled due to RUNTIME_OPTION.ScanImages.disabled=${RUNTIME_OPTION.ScanImages.disabled}`);
        return null;
  // Ignore images not in uploads
  } else if (! object.name.startsWith(`${UPLOADS_FOLDER}/`) && 
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
    debug(object,folder, raceId, waypoint, userId, date, gps,"file", fileName)

  const detections = await getAIdetections(object);

  // PART II   save images/ref data
  try {

    /** get metadata from the filename race_wpt_user_timestamp */
    var {attrs,imagePath} = await compressImage(raceId,object.name, object.bucket, {});

    attrs=META_KEYS.reduce((a,x)=>{if(x in attrs)
                                      a[x]=attrs[x];
                                  return a},{})

    // log("open waypointation codes")
    // var pluscode=encode({  latitude: attrs.latitude,longitude: attrs.longitude})
    log(`AI results on image "${object.name}"`, detections.length);
    let texts=[];    
    // get ISO Date for correct part TODO
    let readingDate = getIsoDate(attrs,date)

    for (let i = 0; i < detections.length; i++) {
      let d=detections[i]
      // only if it looks like a bib
      if (d.description && d.description.match(bibRegex)) {
        try{

          let score = processBounding(d.boundingPoly, getImageHeight(attrs))

          // if its not a  non-timing waypoint record timing
          if (NOTIMING_WAYPOINTS.contains(waypoint)==false){ 
            await updFSReadings(raceId, userId, d.description, 
                      readingDate, score, 
                      waypoint, attrs, imagePath )
          }
          // add only new texts in all cases
          if(texts.indexOf(d.description)==-1)
            texts.push(d.description);
        } 
        catch (e) {
          error('error updFSReadings',e)
        }
      }
    }

    // trim attributions TODO
    // Saving Image data in firestore.. referred image should be jpg
    log(`updating firestore on image data`)
    await updFSImageData(raceId,fileName, detections, texts, attrs)

  } catch (e) {
    error(`Error in image processing "${object.name}"`, e);
  }

  // log('all done')
  return null;

});

async function getAIdetections(object) {
  let data;
  // Check the image content using the Cloud Vision API.
  try {
    if (RUNTIME_OPTION.ScanImages && !RUNTIME_OPTION.ScanImages.vision) {
      log('Skipping vision text detection');
      data = [{ "textAnnotations": [] }]; 
    } else {
      const visionClient = new vision.ImageAnnotatorClient();
      data = await visionClient.textDetection(
        `gs://${object.bucket}/${object.name}`
      );

    }
  } catch (e) {
    log(`error running computer vision ${testData} ${JSON.stringify(e)}`);
  }

  const detections = data[0].textAnnotations;
  return detections;
}

async function compressImage(raceId,filePath, bucketName, metadata) {

  const fileName = filePath.split('/').pop();
  const newFileName = fileName.replace(/\.png$/, ".jpg")
  const newFilePath = `${PROCESSED_FOLDER}/${raceId}/${newFileName}`
  const thumbsPath = `${THUMBNAILS_FOLDER}/${raceId}/${newFileName}`
  let image;

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
    log(`reading watermark for ${raceId} at ${WATERMARK_PATH(raceId)}`)
    // return as a array
    let retval = await getImageMetadata(bucket,WATERMARK_PATH(raceId),false)
                    .catch((e)=>{
                      functions.logger.warn(`Watermark not found ${WATERMARK_PATH(raceId)} ${JSON.stringify(e)}`)
                      watermarks[raceId]=NOTFOUND
                      return [NOTFOUND]
                    });

    watermarks[raceId] =retval[0]
    
  }

  log(`Saving JPG ${newFilePath}`)
  await saveJPG(bucket, newFilePath, image, metadata, watermarks[raceId]);
  // log(">>>>",JSON.stringify(await image.metadata()).substring(0,200))

  log(`Saving thumb ${thumbsPath}`)
  saveThumb(bucket, thumbsPath, image, metadata);

  let attrs=metadata;//Object.assign(metadata, {imagePath: newFilePath, })
  // debug(metadata)

  return {attrs:attrs,imagePath: newFilePath}
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

  // assert(image instanceof sharp)
  // Create Sharp pipeline for resizing the image and use pipe to read from bucket read stream
  const transformer = sharp(); 
  transformer.rotate()
             .withMetadata()
             .resize(  RESIZE_OPTION )
             .jpeg(    JPG_OPTIONS)

  // log(await watermarkImg.metadata())
    
  if (watermarkImg && (watermarkImg!=NOTFOUND)){
    // let _width = Object.keys(metadata).filter(x=>x.includes('idth')).map(x=>metadata[x])[0]
    let _width = Math.max.apply(Math,Object.keys(metadata).filter(x=>x.includes('idth')).map(x=>metadata[x]))
    // let metadata_jpg=await image.metadata()
    log(">>>4", RESIZE_OPTION.width,_width,metadata)
    
    let adjWm=await watermarkImg.resize({ width: RESIZE_OPTION.width})
                                .toBuffer()
      
    transformer
      .composite([{ input: adjWm, gravity: 'south',
    }])
    // log('watermark done')
  } 
  // else {error('watermarkImg',watermarkImg && (watermarkImg!=NOTFOUND))}

  let options = {resumable:false,public:true,metadata:metadata}
  const remoteWriteStream = bucket.file(filePath).createWriteStream(options);
  await (image.rotate()
      .pipe(transformer)
      // .jpeg(JPG_OPTIONS)
      .pipe(remoteWriteStream))
      .on('error', function(err) {error(`Error saving JPG ${JSON.stringify(err)}`)})
      .on('finish', function() {
        // The file upload is complete.
        log(`Saved JPG ${filePath}`)
      });
    // .then(()=>log(`Writing watermarked image: ${newFilePath}`))
    // .catch((e)=>{error(`error in saveJPG() ${JSON.stringify(e)}`)})
  
  return image
}

function saveThumb(bucket, filePath, image,metadata) {

  // Create write stream for uploading thumbnail
  // const thumbnailUploadStream = bucket.file(thumbFilePath).createWriteStream({metadata});
  let options = {resumable:false,public:true,metadata:metadata}
  const remoteWriteStream = bucket.file(filePath).createWriteStream(options);

  // Create Sharp pipeline for resizing the image and use pipe to read from bucket read stream
  const transformer = sharp();
  
  transformer.resize(  THUMBSIZE_OPTION)
             .jpeg(THUMB_JPG_OPTIONS)

  image.rotate()
    .pipe(transformer)
    .toFormat('jpg')
    .pipe(remoteWriteStream)
    // .catch((e)=>{error(`error in saveThumb() ${JSON.stringify(e)}`)});

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
                             waypoint, attrs, fileName ) {
                    
  let x= await admin.firestore()
    .collection('races').doc(cleanForFS(raceId))
    .collection("readings").doc(cleanForFS([timestamp,bibStr].join("_")))
    .set({
      bib: bibStr,
      userId: userId,
      imagePath: fileName,
      waypoint: waypoint,
      // latlng: new admin.firestore.GeoPoint(parseFloat(latitude), parseFloat(longitude)),
      timestamp: timestamp,
      score: score
    })
  .then((x) => {
      log({
        bib: bibStr,
        userId: userId,
        imagePath: fileName,
        waypoint: waypoint,
        // latlng: new admin.firestore.GeoPoint(parseFloat(latitude), parseFloat(longitude)),
        timestamp: timestamp,
        score: score
      })
      return x
  })
  .catch((error) => {
      error("Error writing document: ", error);
      return error
  });
  // log(x)
}

async function firebaseGet(path) {
  var docRef = admin.firestore().doc(path);
  return docRef.get().then((doc) => {
    if (doc.exists) {
        return doc.data();
    } else {
        // doc.data() will be undefined in this case
        error(`No document at ${path}`);
    }
  }).catch((error) => {
      error("Error getting document:", error);
  });
}
function getIsoDate(metadata,date){
  let isoDate;
  try{
    for (let x of ['DateTimeOriginal','DateCreated','CreatedDate']){
      isoDate=metadata[x].toISOString()//.replace("Z",metadata.OffsetTimeOriginal)
      debug(x,metadata[x], typeof metadata[x], isoDate,)
        return isoDate
    }
    isoDate = date //.replace(/\.[^/.]+$/, "")
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
