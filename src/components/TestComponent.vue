<script setup>
import { defineProps, onMounted, reactive, ref } from 'vue'
import Dropdown from 'primevue/dropdown';
import { useStore } from 'vuex';

defineProps({
  msg: String
})

const store = useStore()
const countExample = store.state.countExample

const increment = () => {
  store.dispatch('incrementAction')
};


// This code is adapted from
// https://rawgit.com/Miguelao/demos/master/mediarecorder.html

'use strict';

/* globals MediaRecorder */

let mediaRecorder;
let recordedBlobs;
let button=reactive({"record":{"text":'Start Recording'},
                     "play":{},
                     "download":{},
                     "mimeType":{"disabled":true}
                    })

const recordButtonListener= () => {

  if (button.record.text === 'Start Recording') {
    startRecording();
    button.record.text = 'Stop Recording';
  } else {
    stopRecording();
    button.record.text = 'Start Recording';
    button.play.disabled = false;
    button.download.disabled = false;
    button.mimeType.disabled=false
  }
};

const playButtonListener= () => {
  const _mimeType = mimeType.value.split(';', 1)[0];
  const superBuffer = new Blob(recordedBlobs, {type: _mimeType});
  recordedVideo.src = null;
  recordedVideo.srcObject = null;
  recordedVideo.src = window.URL.createObjectURL(superBuffer);
  recordedVideo.controls = true;
  recordedVideo.play();
};

const downloadButtonListener=  () => {
  const blob = new Blob(recordedBlobs, {type: 'video/webm'});
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = 'test.webm';
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 100);
};

function handleDataAvailable(event) {
  console.log('handleDataAvailable', event);
  if (event.data && event.data.size > 0) {
    recordedBlobs.push(event.data);
  }
}

function getSupportedMimeTypes() {
  const possibleTypes = [
    'video/webm;codecs=av1,opus',
    'video/webm;codecs=vp9,opus',
    'video/webm;codecs=vp8,opus',
    'video/webm;codecs=h264,opus',
  // "video/webm;codecs=daala",
  // "video/mpeg",
    'video/mp4;codecs=h264,aac',
  ];
  return possibleTypes.filter(mimeType => {
    return MediaRecorder.isTypeSupported(mimeType);
  });
}

function startRecording() {
  recordedBlobs = [];
  const _mimeType = mimeType.value;
  const options = {_mimeType};

  try {
    // debugger;
    mediaRecorder = new MediaRecorder(window.stream, options);
  } catch (e) {
    console.error('Exception while creating MediaRecorder:', e);
    errorMsgElement.innerHTML = `Exception while creating MediaRecorder: ${JSON.stringify(e)}`;
    return;
  }

  console.log('Created MediaRecorder', mediaRecorder, 'with options', options);
  button.record.text = 'Stop Recording';
  button.play.disabled = true;
  button.download.disabled = true;
  // codecPreferences.disabled = true;
  button.mimeType.disable=true
  mediaRecorder.onstop = (event) => {
    console.log('Recorder stopped: ', event);
    console.log('Recorded Blobs: ', recordedBlobs);
  };
  mediaRecorder.ondataavailable = handleDataAvailable;
  mediaRecorder.start();
  console.log('MediaRecorder started', mediaRecorder);
}

function stopRecording() {
  mediaRecorder.stop();
}

function handleSuccess(stream) {
  button.record.disabled = false;
  console.log('getUserMedia() got stream:', stream);
  window.stream = stream;

  const gumVideo = document.querySelector('video#gum');
  gumVideo.srcObject = stream;

  mimeOptions.value=getSupportedMimeTypes()
  if (mimeOptions.value.length) 
    mimeType.value=mimeOptions.value[0]

  button.mimeType.disable=false
}

async function init(constraints) {
  try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    handleSuccess(stream);
  } catch (e) {
    console.error('navigator.getUserMedia error:', e);
    debugger
    errorMsgElement.innerHTML = `navigator.getUserMedia error:${e.toString()}`;
  }
}

const startButtonListener= async () => {
    document.querySelector('button#start').disabled = true;
    const hasEchoCancellation = document.querySelector('#echoCancellation').checked;
    const constraints = {
      audio: {
        echoCancellation: {exact: hasEchoCancellation}
      },
      video: {
        // width: 1280, height: 720
      }
    };
    console.log('Using media constraints:', constraints);
    await init(constraints);
  };

onMounted(()=>{
  errorMsgElement = document.querySelector('span#errorMsg');
  recordedVideo = document.querySelector('video#recorded');

})
// let codecPreferences ;
let errorMsgElement ;
let recordedVideo ;

const mimeOptions=ref([])
const mimeType=ref('')
// rec button
const isRecording=ref(false)
const clickRecButton=function(){
  isRecording.value=!isRecording.value;
  console.warn(`recording : ${isRecording.value}`)
	if(isRecording.value){

	}
	else{

	}
};	
</script>

<template>

  <!-- <h1 class="test-color">{{ msg }}</h1> -->
  <div id="container">

  <h1><a href="//webrtc.github.io/samples/" title="WebRTC samples homepage">WebRTC samples</a>
      <span @click="debugger;">MediaRecorder</span></h1>

  <p>For more information see the MediaStream Recording API <a
          href="http://w3c.github.io/mediacapture-record/MediaRecorder.html"
          title="W3C MediaStream Recording API Editor's Draft">Editor's&nbsp;Draft</a>.</p>

  <video id="gum" playsinline autoplay muted></video>
  <video id="recorded" playsinline loop></video>
  <div>
      <button id="recButton" @click="clickRecButton" :class="{ Rec: isRecording, notRec: !isRecording }"></button>
      <Button id="start" @click="startButtonListener">Start camera</Button>
      <Button id="record" @click="recordButtonListener" 
        :disabled="button.record.disabled">{{button.record.text}}</Button>
      <Button id="play" @click="playButtonListener" 
        :disabled="button.play.disabled">Play</Button>
      <Button id="download" @click="downloadButtonListener" 
        :disabled="button.download.disabled">Download</Button>
  </div>
  <Dropdown :options="mimeOptions" v-model="mimeType" :disabled="button.mimeType.disable"/>
  
  <!-- <div>
      Recording format: <select id="codecPreferences" disabled></select>
  </div> -->
  <div>
      <h4>Media Stream Constraints options</h4>
      <p>Echo cancellation: <input type="checkbox" id="echoCancellation"></p>
  </div>

  <div>
      <span id="errorMsg"></span>
  </div>

  <a href="https://github.com/webrtc/samples/tree/gh-pages/src/content/getusermedia/record"
      title="View source for this page on GitHub" id="viewSource">View source on GitHub</a>

</div>

<!-- include adapter for srcObject shim -->
<!-- <script src="https://webrtc.github.io/adapter/adapter-latest.js"></script> -->
<!-- <script src="js/main.js" async></script> -->
  <button type="button" @click="increment">count is: <p v-text="countExample.count" /></button>

</template>

<style scoped >
button#recButton {
	width: 35px;
	height: 35px;
	/* font-size: 0;
	background-color: red; */
	border: 0;
	border-radius: 35px;
	margin: 18px;
	outline: none;
}

.notRec{
	background-color: darkred;
}

.Rec{
  background-color: red;
	animation-name: pulse;
	animation-duration: 1.5s;
	animation-iteration-count: infinite;
	animation-timing-function: linear;
}

@keyframes pulse{
	0%{
		box-shadow: 0px 0px 5px 0px rgba(173,0,0,.3);
	}
	65%{
		box-shadow: 0px 0px 5px 13px rgba(173,0,0,.3);
	}
	90%{
		box-shadow: 0px 0px 5px 13px rgba(173,0,0,0);
	}
}
</style>
