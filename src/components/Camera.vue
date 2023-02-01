<script >
import { ref, onMounted } from 'vue'
import Button from 'primevue/button';
// example from 

let cam =  {
  // The width and height of the captured photo. We will set the
  // width to the value defined here, but the height will be
  // calculated based on the aspect ratio of the input stream.
  width : 640, // We will scale the photo width to this
  height : 0, // This will be computed based on the input stream

  // |streaming| indicates whether or not we're currently streaming
  // video from the camera. Obviously, we start at false.

  streaming : false,

  // The various HTML elements we need to configure or control. These
  // will be set by the startup() function.

  video : null,
  canvas : null,
  photo : null,
  startbutton : null,
}
let showViewLiveResultButton= function() {
    console.debug('showViewLiveResultButton')
    if (window.self !== window.top) {
      // Ensure that if our document is in a frame, we get the user
      // to first open it in its own tab or window. Otherwise, it
      // won't be able to request permission for camera access.
      document.querySelector(".contentarea").remove();
      const button = document.createElement("button");
      button.textContent = "View live result of the example code above";
      document.body.append(button);
      button.addEventListener("click", () => window.open(location.href));
      return true;
    }
    return false;
  }

function startup() {
    console.debug('startup')
    if (showViewLiveResultButton()) {
      return;
    }
    cam.video = document.getElementById("video");
    cam.canvas = document.getElementById("canvas");
    cam.photo = document.getElementById("photo");
    cam.startbutton = document.getElementById("startbutton");

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then((stream) => {
        cam.video.srcObject = cam.stream;
        cam.video.play();
      })
      .catch((err) => {
        console.error(`An error occurred: ${err}`);
      });

    video.addEventListener(
      "canplay",
      (ev) => {
        if (!cam.streaming) {
          cam.height = cam.video.videoHeight / (cam.video.videoWidth / cam.width);

          // Firefox currently has a bug where the height can't be read from
          // the video, so we will make assumptions if this happens.

          if (isNaN(height)) {
            cam.height = cam.width / (4 / 3);
          }

          cam.video.setAttribute("width", cam.width);
          cam.video.setAttribute("height", cam.height);
          cam.canvas.setAttribute("width", cam.width);
          cam.canvas.setAttribute("height", cam.height);
          cam.streaming = true;
        }
      },
      false
    );

    startbutton.addEventListener(
      "click",
      (ev) => {
        takepicture();
        ev.preventDefault();
      },
      false
    );

    clearphoto();
  }

  // Fill the photo with an indication that none has been
  // captured.

let  clearphoto=function() {
    console.log('clearphoto')
    const context = canvas.getContext("2d");
    context.fillStyle = "#AAA";
    context.fillRect(0, 0, cam.canvas.width, cam.canvas.height);

    const data = cam.canvas.toDataURL("image/png");
    cam.photo.setAttribute("src", data);
  }

  // Capture a photo by fetching the current contents of the video
  // and drawing it into a canvas, then converting that to a PNG
  // format data URL. By drawing it on an offscreen canvas and then
  // drawing that to the screen, we can change its size and/or apply
  // other changes before drawing it.

let  takepicture=function() {
    console.log('takepicture')
    const context = canvas.getContext("2d");
    if (cam.width && cam.height) {
      cam.canvas.width = cam.width;
      cam.canvas.height = cam.height;
      context.drawImage(cam.video, 0, 0, cam.width, cam.height);

      const data = cam.canvas.toDataURL("image/png");
      cam.photo.setAttribute("src", data);
      console.log("Picture take ...increase counter")
    } else {
      clearphoto();
    }
  }

  // Set up our event listener to run the startup process
  // once loading is complete.
//   window.addEventListener("load", startup, false)

function click(){
    takepicture()
}

export default {
    components:{Button},

    setup(){
      onMounted(() => {
        console.log('onMounted')
        startup()
      })
      console.log('setup')
      return {click, startup,cam}
  }
}
</script>

<template>
    <div class="contentarea">
    <p>
        TODO:  Upload
    </p>
    <div class="camera">
        <video id="video">Video stream not available.</video>
        <button id="startbutton">Take photo</button>
    </div>
    <canvas id="canvas"> </canvas>
    <div class="output">
        <img id="photo" alt="The screen capture will appear in this box." />
    </div>
    <p>
        Visit our article
        <a
        href="https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Taking_still_photos">
        Taking still photos with WebRTC</a
        >
        to learn more about the technologies used here.
    </p>
    <Button @click="startup">Start</Button>
    <Button name="click" @click="click">Click</Button>
    </div>

</template>

<style scoped>
#video {
  border: 1px solid black;
  box-shadow: 2px 2px 3px black;
  width: 320px;
  height: 240px;
}

#photo {
  border: 1px solid black;
  box-shadow: 2px 2px 3px black;
  width: 320px;
  height: 240px;
}

#canvas {
  display: none;
}

.camera {
  width: 340px;
  display: inline-block;
}

.output {
  width: 340px;
  display: inline-block;
  vertical-align: top;
}

#startbutton {
  display: block;
  position: relative;
  margin-left: auto;
  margin-right: auto;
  bottom: 32px;
  background-color: rgba(0, 150, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.7);
  box-shadow: 0px 0px 1px 2px rgba(0, 0, 0, 0.2);
  font-size: 14px;
  font-family: "Lucida Grande", "Arial", sans-serif;
  color: rgba(255, 255, 255, 1);
}

.contentarea {
  font-size: 16px;
  font-family: "Lucida Grande", "Arial", sans-serif;
  width: 760px;
}

</style>