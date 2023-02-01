<template>
<div id="container">

    <h1><a href="//webrtc.github.io/samples/" title="WebRTC samples homepage">WebRTC samples</a> <span>getUserMedia ⇒ canvas</span>
    </h1>

    <video playsinline autoplay></video>
    <Button @click="capture">Take snapshot</Button>
    <canvas></canvas>
    {{userAgent}}
    <p>Draw a frame from the video onto the canvas element using the <code>drawImage()</code> method.</p>

    <p>The variables <code>canvas</code>, <code>video</code> and <code>stream</code> are in global scope, so you can
        inspect them from the console.</p>

    <a href="https://github.com/webrtc/samples/tree/gh-pages/src/content/getusermedia/canvas"
       title="View source for this page on GitHub" id="viewSource">View source on GitHub</a>

</div>
</template>

<script setup>

import {onMounted} from 'vue'
import Button from 'primevue/button';
import {db, storage} from "../../firebase/config"
import {ref, uploadBytes, uploadString } from "firebase/storage";
import {useStore} from "vuex";


const store = useStore()
const uid = store.state.auth.userDetails.userData.uid


// Put variables in global scope to make them available to the browser console.
let video = null;
let canvas = null;

onMounted(() => startup())

function startup(){

video = document.querySelector('video');
canvas = window.canvas = document.querySelector('canvas');
canvas.width = 480;
canvas.height = 360;

navigator.mediaDevices
        .getUserMedia(constraints)
        .then(handleSuccess)
        .catch(handleError);

}
// const button = document.querySelector('button');
let capture = function() {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
  
  // 'file' comes from the Blob or File API
  let imgName=`test/${uid}/${new Date().toISOString()}.png`
  let uploadRef=ref(storage, imgName);
  // Create file metadata including the content type
  /** @type {any} */
  const metadata = {
    contentType: 'image/png',
  };

  // let img=canvas.toDataURL('image/jpg');
  // debugger;

  canvas.toBlob(blob=>{
    console.log(`Uploading ${imgName}`,blob);
    uploadBytes(uploadRef, blob).then((snapshot) => {
      console.log('Uploaded a blob or file!',snapshot);
    }).catch(e=>{
      console.error("Error uploading "+JSON.stringify(e))
    });
  })

};

const constraints = {
  audio: false,
  video: {facingMode:  "environment" }
};

const userAgent=  navigator.userAgent ;
    // /Android|iPhone|iPad/i.test(navigator.userAgent)


function handleSuccess(stream) {
  window.stream = stream; // make stream available to browser console
  video.srcObject = stream;
}

function handleError(error) {
  console.log('navigator.MediaDevices.getUserMedia error: ', error.message, error.name);
}
</script>

<style scoped>
</style>

<!--
getUserMedia({
  audio: true,
  video: {
    width: { ideal: 1280 },
    height: { ideal: 720 }
  }
})
  video: { facingMode: "user" }
  video: {facingMode: { exact: "environment" }}
-->