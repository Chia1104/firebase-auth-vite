/**
 * FaceAPI Demo for NodeJS
 * - Analyzes face descriptors from source (image file or folder containing multiple image files)
 * - Analyzes face descriptor from target
 * - Finds best match
 */

const fs = require('fs');
const path = require('path');
const log = require('@vladmandic/pilogger');
const tf = require('@tensorflow/tfjs-node'); // in nodejs environments tfjs-node is required to be loaded before face-api
const faceapi = require('../dist/face-api.node.js'); // use this when using face-api in dev mode
// const faceapi = require('@vladmandic/face-api'); // use this when face-api is installed as module (majority of use cases)

let optionsSSDMobileNet;
const minConfidence = 0.1;
const distanceThreshold = 0.9;
const modelPath = 'model';
const labeledFaceDescriptors = [];
let dbFile;

async function initFaceAPI() {
    await faceapi.nets.ssdMobilenetv1.loadFromDisk(modelPath);
    await faceapi.nets.faceLandmark68Net.loadFromDisk(modelPath);
    await faceapi.nets.faceExpressionNet.loadFromDisk(modelPath);
    await faceapi.nets.faceRecognitionNet.loadFromDisk(modelPath);
    await faceapi.nets.ageGenderNet.loadFromDisk(modelPath);
    optionsSSDMobileNet = new faceapi.SsdMobilenetv1Options({ minConfidence, maxResults: 100 });
}

async function getDescriptors(imageFile) {
    const buffer = fs.readFileSync(imageFile);
    const tensor = tf.node.decodeImage(buffer, 3);
    const faces = await faceapi.detectAllFaces(tensor, optionsSSDMobileNet)
        .withFaceLandmarks()
        .withFaceExpressions()
        .withAgeAndGender()
        .withFaceDescriptors();
    tf.dispose(tensor);
    //   faces.forEach(f=>{
    //     log.data(`x:${xpct} y:${ypct} ${expr[0]} ${expr[1].toFixed(2)}`,f.gender,f.age.toFixed(0))
    //   })
    return faces.map((f) => {
        let expr = Object.entries(f.expressions).sort(function (a, b) { return b[1] - a[1]; })[0]
        expr[1]=expr[1].toFixed(2)//
        let xpct = Math.round(10 * f.alignedRect.box.left / f.alignedRect.imageWidth) * 10
        let ypct = Math.round(10 * f.alignedRect.box.top / f.alignedRect.imageHeight) * 10

        return {
            "f": path.basename(imageFile),
            "descriptor": f.descriptor,
            "expression": expr,
            "loc": [xpct, ypct],
            "gender": f.gender,
            age: f.age.toFixed(0),
        }
    });
}

async function registerImage(inputFile) {
    if (!inputFile.toLowerCase().endsWith('jpg') && !inputFile.toLowerCase().endsWith('png') && !inputFile.toLowerCase().endsWith('gif')) return;
    log.data('Registered:', inputFile);
    const faces = await getDescriptors(inputFile);
    for (const face of faces) {
        fs.appendFile(dbFile, jsonStr(face)+",", 
                                (err) => { if (err) throw err; })
        labeledFaceDescriptors.push(face);
    }
}

let jsonStr = (obj) => JSON.stringify(obj, function (key, value) {
    // the replacer function is looking for some typed arrays.
    // If found, it replaces it by a trio
    if (value instanceof Int8Array ||
        value instanceof Uint8Array ||
        value instanceof Uint8ClampedArray ||
        value instanceof Int16Array ||
        value instanceof Uint16Array ||
        value instanceof Int32Array ||
        value instanceof Uint32Array ||
        value instanceof Float32Array ||
        value instanceof Float64Array) {
        var replacement = {
            constructor: value.constructor.name,
            data: Array.apply([], value),
            flag: "FLAG_TYPED_ARRAY"
        }
        return replacement;
    }
    return value;
});


async function main() {
    log.header();
    if (process.argv.length !== 4) {
        log.error(process.argv[1], 'Expected <source image or folder> <target database>');
        process.exit(1);
    }
    await initFaceAPI();
    log.info('Input:', process.argv[2]);

    dbFile = path.join(process.argv[2], `${process.argv[3]}`)
    fs.writeFile(dbFile, "[", (err) => { if (err) throw err; })

    if (fs.statSync(process.argv[2]).isFile()) {
        await registerImage(process.argv[2]); // register image
    } else if (fs.statSync(process.argv[2]).isDirectory()) {
        const dir = fs.readdirSync(process.argv[2]);
        for (const f of dir) await registerImage(path.join(process.argv[2], f)); // register all images in a folder
    }

    log.info('Saving:', dbFile, 'Descriptors:', labeledFaceDescriptors.length);
    if (labeledFaceDescriptors.length > 0) {

        // Write data in 'Arg3.json' .
        fs.appendFile(dbFile, "]", (err) => { if (err) throw err; })

    } else {
        log.warn('No registered faces');
    }
}

main();
