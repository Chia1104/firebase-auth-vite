/**
 * Online tests
 */

const projectId='run-pix'
const config={
    projectId:`${projectId}`,
    storageBucket: `${projectId}.appspot.com`,
    databaseURL: `https://${projectId}.firebaseio.com`,
  }


const { firebaseConfig } = require('firebase-functions');
const functions = require('firebase-functions');
const test = require('firebase-functions-test')(config,
    'c:/i/auth/run-pix-092258e3cb1b.json');

// Mock functions config values
test.mockConfig({ stripe: { key: '23wr42ewr34' }});
  
const key = functions.config().stripe.key;
  
console.log(`key is ${key}`, JSON.stringify(config))


// after firebase-functions-test has been initialized
// "Wrap" the makeUpperCase function from index.js
const myFunctions = require('../index.js');

const wrapped = test.wrap(myFunctions.ScanImages);
// const data_JPEG = {bucket:config.storageBucket,
//   name:'test/20230115_090440.jpg',
//   contentType: 'image/jpeg'};
const data_JPEG = {bucket:config.storageBucket,
            //  name:'uploads/mychoice23feb/2023-02-12T01:25:41.084Z^venue^avinashmane$gmail.com^20230212_065538.jpg',
            //  name:'uploads/mychoice23feb/2023-02-12T01:26:04.364Z^venue^avinashmane$gmail.com^20230212_065602.jpg',
             name:'uploads/mychoice23feb/2023-02-12T01:28:29.364Z^venue^avinashmane$gmail.com^20230212_065828.jpg',
             contentType: 'image/jpeg'};
            //  https://storage.googleapis.com/run-pix.appspot.com/uploads/mychoice23mar/2022-01-13T12%3A23%3A36.476Z%5Estart%5Eavinashmane%40gmail.com%5E9955-3Certificate.png             
const data_PNG = {bucket:config.storageBucket,
                // name:'test/V4AFod9aCoRsEP62GnVm0gPYxXK2/2023-01-27T11:31:41.796Z.png',
                // name:'uploads/mychoice23mar/2022-01-13T12:23:36.476Z^start^avinashmane$gmail.com^9955-3Certificate.png ',
                name: 'uploads/mychoice23mar/2023-03-14T13:01:08.206Z^venue^avinashmane$gmail.com^capture.png',
                contentType: 'image/png'};// PNG captured for the stream
                                  
// Invoke the wrapped function without specifying the event context.
wrapped(data_JPEG);
// myFunctions.ScanImages({},{params:data_JPEG})
// wrapped(data_PNG);

// Invoke the function, and specify params

// Invoke the function, and specify auth and auth Type (for real time database functions only)

// Invoke the function, and specify all the fields that can be specified
(
    // wrapped(
  'data', {
  eventId: 'abc',
  timestamp: '2018-03-23T17:27:17.099Z',
  params: {
    pushId: '234234'
  },
  auth: {
    uid: 'jckS2Q0' // only for real time database functions
  },
  authType: 'USER' // only for real time database functions
});


