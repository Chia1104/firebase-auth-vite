/**
 * Online tests
 */

const projectId='run-pix'
const config={
    projectId:`${projectId}`,
    storageBucket: `${projectId}.appspot.com`,
    databaseURL: `https://${projectId}.firebaseio.com`,
  }

const GS_URL_PREFIX='https://storage.googleapis.com/run-pix.appspot.com/'
const {assert} = require('chai')
// const open = require('open')
// import open, {openApp, apps} from 'open';
const { firebaseConfig } = require('firebase-functions');
const functions = require('firebase-functions');
const { storageBucket } = require('firebase-functions/params');
const test = require('firebase-functions-test')(config,
    'c:/i/auth/run-pix-092258e3cb1b.json');
// console.debug(test)
// Mock functions config values
// test.mockConfig(config);//{ stripe: { key: '23wr42ewr34' }}
// const key = functions.config().stripe.key;
  
// process.env.FIREBASE_CONFIG=config.storageBucket
  
// console.log(`key is ${key}`, JSON.stringify(config))


// after firebase-functions-test has been initialized
describe('Storage_tests', function () {
  let myFunctions,
      optionBackup;
  
  this.timeout(10000); // A very long environment setup.
    
  before((done) => {
    //save old settings
    optionBackup = process.env.RUNTIME_OPTION
    // disable image recognition
    process.env.RUNTIME_OPTION=JSON.stringify({
      ScanImages: {
        vision: true ,
        disabled : false
      }
    })
    process.env.DEBUG_MODE=3
    // Require index.js and save the exports inside a namespace called myFunctions.
    // This includes our cloud functions, which can now be accessed at myFunctions.makeUppercase
    // and myFunctions.addMessage
    myFunctions= require('../index.js')
    // catch(e){console.warn(JSON.stringify(e).substring(0,100))}
    // console.log(storageBucket)

    console.debug(`Functions available :>>`,Object.keys(myFunctions))
    done()
  });

  after(() => {
    // Do cleanup tasks.
    console.debug("cleaning up")
    test.cleanup();
    process.env.RUNTIME_OPTION=optionBackup
    // Reset the database.
    // admin.database().ref('messages').remove();
  });

  describe('storage_ScanImages_tests', () => {
    // set the bucket
    it("ScanImages defined?",function (){

      assert.isDefined(myFunctions)
    })

    it('Process the PNG image', async function () {
      this.timeout(20000); // A very long environment setup.
      process.env.RUNTIME_OPTION=JSON.stringify({scanImages:{vision:false}})
      
      // Wrap the makeUppercase function
      // myFunctions.storage.bucket(config.storageBucket);
      const wrapped = test.wrap(myFunctions.ScanImages);
      const data_JPEG = {bucket: config.storageBucket,
                  name: 'uploads/testrun/2023-03-12T02:28:48.000Z~VENUE~avinashmane$gmail.com~20230312_075846.jpg',
                  // name:'uploads/mychoice23mar/2023-03-15T10:32:48.483381~general~bcoconut~DSC_0466.jpg',
                  // name:'uploads/werun2023/2023-03-13T14:28:45.900378~general~vaibhav~S_G01851.jpg', 
                  // name:'uploads/werun2023/2023-03-13T19:25:41.041091~general~vaibhav~_L3A3047.jpg',
                  //  name:'uploads/mychoice23feb/2023-02-12T01:26:04.364Z^venue^avinashmane$gmail.com^20230212_065602.jpg',
                  //  name:'uploads/mychoice23feb/2023-02-12T01:28:29.364Z^venue^avinashmane$gmail.com^20230212_065828.jpg',
                   contentType: 'image/jpeg'};
                  //  https://storage.googleapis.com/run-pix.appspot.com/uploads/mychoice23mar/2022-01-13T12%3A23%3A36.476Z%5Estart%5Eavinashmane%40gmail.com%5E9955-3Certificate.png             
      const data_PNG = {bucket:config.storageBucket,
                      // name:'test/V4AFod9aCoRsEP62GnVm0gPYxXK2/2023-01-27T11:31:41.796Z.png',
                      // name:'uploads/mychoice23mar/2022-01-13T12:23:36.476Z^start^avinashmane$gmail.com^9955-3Certificate.png ',
                      name: 'uploads/mychoice23mar/2023-03-14T13:01:08.206Z^venue^avinashmane$gmail.com^capture.png',
                      contentType: 'image/png'};// PNG captured for the stream
      await wrapped(data_JPEG)
      // .then(x=>{
      //   console.debug(x)
      //   done()}
      //   )
      //   .catch((e)=>done(e))

    })

    it('Process the EXIF rotation image', async function () {
      this.timeout(20000); // A very long environment setup.
    
      const data_JPEG = {bucket: config.storageBucket,
                  name:'uploads/mychoice23apr/2023-04-01T12:21:36.426Z~venue~avinashmane$gmail.com~20230401_175132.jpg',
                   contentType: 'image/jpeg'};
                  //  https://storage.googleapis.com/run-pix.appspot.com/uploads/mychoice23mar/2022-01-13T12%3A23%3A36.476Z%5Estart%5Eavinashmane%40gmail.com%5E9955-3Certificate.png             

      openURI(GS_URL_PREFIX+data_JPEG.name)

      const wrapped = test.wrap(myFunctions.ScanImages);
      await wrapped(data_JPEG)
      openURI(GS_URL_PREFIX+data_JPEG.name.replace("uploads","processed"))
      return 
    })

  });

  describe('firestore_imageUpdate_tests', () => {
    // Test Case: setting messages/11111/original to 'input' should cause 'INPUT' to be written to
    // messages/11111/uppercase
    it('shoud process logical deletion of images', () => {
      // [START assertOnline]
      // Create a DataSnapshot with the value 'input' and the reference path 'messages/11111/original'.
      fsPath='/races/mychoice23apr/images/2022-12-08T07:41:48.652Z~venue~avinashmane$gmail.com~Screenshot 2022-12-08 at 13-11-41 Athlete Heatmaps Strava.png'
      // const snap = test.firestore.makeDocumentSnapshot({disable:new Date().toLocaleString()}, fsPath);
      // Make snapshot for state of database beforehand
      const beforeSnap = test.firestore.makeDocumentSnapshot({foo: 'bar'}, fsPath);
      // Make snapshot for state of database after the change
      const afterSnap = test.firestore.makeDocumentSnapshot({foo: 'faz'}, fsPath);
      const changeReq = test.makeChange(beforeSnap, afterSnap);
      
      // Wrap the makeUppercase function
      const wrapped = test.wrap(myFunctions.imageUpdate);
      // Call the wrapped function with the snapshot you constructed.
      // console.debug(wrapped)
      let {change, context} = wrapped(changeReq)
      if( change.before.exists) 
        console.debug("before",change.before.data())
      if( change.after.exists) 
        console.debug("after",change.after.data())

      console.warn("104>>>>>>",context)
      return 
      // .then((x) => {
      //   console.debug(x)
      //   return admin.firestore().doc(fsPath).get().then((createdSnap) => {
      //     // Assert that the value is the uppercased version of our input.
      //     assert.equal(createdSnap.data(), 'INPUT');
      //   });
      // });
      // [END assertOnline]
    })
  });

//   describe('addMessage', () => {
//     it('should return a 303 redirect', (done) => {
//       // A fake request object, with req.query.text set to 'input'
//       const req = { query: {text: 'input'} };
//       // A fake response object, with a stubbed redirect function which does some assertions
//       const res = {
//         redirect: (code, url) => {
//           // Assert code is 303
//           assert.equal(code, 303);
//           // If the database push is successful, then the URL sent back will have the following format:
//           const expectedRef = new RegExp(projectConfig.databaseURL + '/messages/');
//           assert.isTrue(expectedRef.test(url));
//           done();
//         }
//       };

//       // Invoke addMessage with our fake request and response objects. This will cause the
//       // assertions in the response object to be evaluated.
//       myFunctions.addMessage(req, res);
//     });
//   });
})

function openURI (URI) {
  var start = (process.platform == 'darwin'? 'open': process.platform == 'win32'? 'start': 'xdg-open');
  // require('child_process').exec(start + ' ' + URI);
}                                  
// Invoke the wrapped function without specifying the event context.

// myFunctions.ScanImages({},{params:data_JPEG})
// wrapped(data_PNG);
// after firebase-functions-test has been initialized
describe('general_tests', () => {
  it("timeout",async function () {
    console.debug("started",now())
    await sleep(1500,console.warn,"sleep complete")
    console.debug("ended",now())

  })
})

now=()=>new Date().toISOString()

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
async function sleep(secs,fn, ...args) {
  await timeout(secs);
  return fn(...args);
}
