<template>
  <div id="container">
    CAMERA
    <InputSwitch v-model="camera.perm" @click="toggleVideo()" aria-labelledby="single" />
    <!-- <ToggleButton v-model="camera.perm" @click="toggleVideo()" onLabel="Camera ON" offLabel="Camera OFF" aria-labelledby="single" /> -->

    <!-- <span>getUserMedia ⇒ canvas</span> -->
    <!-- permission {{camera.permission}} -->
    <div v-if="camera.perm">

      <video playsinline autoplay>
        <p>
          Your browser doesn't support HTML video.
        </p>
      </video>
      <Button @click="capture">Take snapshot</Button>
      <canvas></canvas>
      <!-- <p>Draw a frame from the video onto the canvas element using the <code>drawImage()</code> method.</p>
      <a href="//webrtc.github.io/samples/" title="WebRTC samples homepage">
              WebRTC samples</a>
        <p>The variables <code>canvas</code>, <code>video</code> and <code>stream</code> are in global scope, so you can
            inspect them from the console.</p> -->

      <!-- <a href="https://github.com/webrtc/samples/tree/gh-pages/src/content/getusermedia/canvas"
        title="View source for this page on GitHub" id="viewSource">View source on GitHub</a> -->
    </div>

  </div>
</template>

<script setup>
  import {
    onMounted,
    reactive
  } from 'vue'
  // import ToggleButton from 'primevue/togglebutton';
  // import SelectButton from 'primevue/selectbutton';
  import Button from 'primevue/button';
  import InputSwitch from 'primevue/inputswitch';
  import {
    getDateTime
  } from "../helpers"
  import {
    db,
    storage
  } from "../../firebase/config"
  import {
    ref,
    uploadBytes,
    uploadString
  } from "firebase/storage";
  import {
    useStore
  } from "vuex";
  const store = useStore()
  const props = defineProps({
    raceId: String,
    waypoint: String,
  })
  const UPLOADS_FOLDER = 'uploads';

  
  const userData = store.state.auth.userDetails.userData

  /**
   * navigator.mediaDevices.getSupportedConstraints()  
   */

  // Put variables in global scope to make them available to the browser console.
  let video = null;
  let canvas = null;

  onMounted(() => startup())

  let camera = reactive({
    perm: false,
    permission: 'N'
  })


  function startup() {

    if (camera.perm==false) return;

    video = document.querySelector('video');
    canvas = window.canvas = document.querySelector('canvas');
    canvas.width = 480;
    canvas.height = 360;

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(handleSuccess)
      .catch(handleError);


    getQuery()
  }

  function getQuery() {
    // try {
    //   navigator.permissions.query({ name: "camera" }).then(res => {
    //       if(res.state == "granted"){ // has permission
    //           camera.permission='Y'}
    //   });
    // } catch(TypeError) {
    //   camera.permission='X'
    // }

  }

  function toggleVideo(e) {
    camera.perm = !camera.perm;
    if (camera.perm){
      setTimeout(startup,500);
    }else
      video.pause();
    console.log(camera.perm, e)
  }

  function playPauseMedia() {
    if (media.paused) {
      video.setAttribute('data-icon', 'u');
      media.play();
    } else {
      video.setAttribute('data-icon', 'P');
      media.pause();
    }
  }


  let capture = function () {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);

    // 'file' comes from the Blob or File API
    let timestamp = new Date().toISOString()
    let email = userData.email || "userData.email"
    let uploadPath = `${UPLOADS_FOLDER}/${props.raceId}/${timestamp}~${props.waypoint}~${email.replace("@","$")}~capture.png`

    let uploadRef = ref(storage, uploadPath);
    // Create file metadata including the content type
    /** @type {any} */
    const metadata = {
      contentType: 'image/png',
    };


    canvas.toBlob(blob => {
      console.log(`Uploading ${uploadPath}`, blob);
      uploadBytes(uploadRef, blob).then((snapshot) => {
        console.log('Uploaded a blob or file!', snapshot);
      }).catch(e => {
        console.error("Error uploading " + JSON.stringify(e))
      });
    })

  };

  const constraints = {
    audio: false,
    video: {
      facingMode: "environment"
    }
  };

  const userAgent = navigator.userAgent;
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