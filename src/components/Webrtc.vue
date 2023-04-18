<template>
<!-- {{bibs}} -->
  <div id="container w-3/4">
    <b>CAMERA : {{waypoint}}</b>  <small v-if="['VENUE'].includes(waypoint)"> Not valid for timing</small>
    <div v-if="bib" id="lookupoverlay" 
    class="absolute background-0 text-xl text-left text-light">
      <ul >
        <li v-for="b in bibs" class="shadow text-ref-600/70 p-1">
          {{b.Bib}} {{b.Name}}
        </li>
      </ul>
    </div>
    <!-- <div id="logoverlay" class="absolute bottom-0 left-[50%] text-xl">
      overlay
    </div> -->
    <div v-if="camera.perm">
      <video playsinline autoplay v-if="camera.perm">
        <p>
          Your browser doesn't support HTML video.
        </p>
      </video>
    </div>
    <form>  
      <div class="flex flex-column gap-2 p-float-label">
          <!-- <label for="bib">Bib</label> -->
          <InputText id="bib" v-model="bib" placeholder="Enter a single bib number" 
            aria-describedby="bib-help" class="w-1/3"/>
          <Button v-for="d in race.Distances" @click="recordBib(d)">{{d}}</Button>
      </div>
        <!-- <SelectButton :options="race.Distances" :model="distance"></SelectButton> -->
    </form>



    <div>
      <div v-if="camera.perm">
        <Button @click="capture()">Snapshot</Button>
        <div class="label" @click="klick">Zoom:</div>
        <input name="zoom" type="range" disabled>
      </div>
      <span>Cam
        <InputSwitch v-model="camera.perm" label="Camera" @click="toggleVideo()" 
                  @dblclick="klick" aria-labelledby="single" />
      </span>
    </div>
    <canvas></canvas>
    <div>
    </div>
    <!-- <ToggleButton v-model="camera.perm" @click="toggleVideo()" 
              onLabel="Turn off Camera" offLabel="Turn on Camera"
              onIcon="pi pi-check" offIcon="pi pi-camera"
                @dblclick="klick" aria-labelledby="single" /> -->
  </div>
  <!-- <button @click="klick">x</button> -->

</template>

<script setup>
  import {onMounted, computed,   reactive, ref  } from 'vue'
  import {getAllDocs} from '../api'
// import ToggleButton from 'primevue/togglebutton';
  import InputText from 'primevue/inputtext';
  import SelectButton from 'primevue/selectbutton';
  import InputSwitch from 'primevue/inputswitch';
  import { getDateTime  } from "../helpers"
  import {db,  storage  } from "../../firebase/config"
  import { doc, getDoc ,updateDoc, setDoc } from 'firebase/firestore'
  import { ref as stoRef,  uploadBytes,  uploadString   } from "firebase/storage";
  import {    useStore  } from "vuex";
  const store = useStore()

  const props = defineProps({
    raceId: String,
    waypoint: String,
    race: Object,
    // bibs: Object,
  })
  const UPLOADS_FOLDER = 'uploads';

  
  const userData = store.state.auth.userDetails.userData

  /**
   * navigator.mediaDevices.getSupportedConstraints()  
   */
  const bib = ref("")
  const distance=ref(null)
  // Put variables in global scope to make them available to the browser console.
  let video = null;
  let canvas = null;

  const constraints = {
    audio: false,
    video: {
      facingMode: "environment"
    }
  };
  const shadowOptions={
      shadowOffsetX : 2,
      shadowOffsetY : 2,
      shadowBlur : 1,
      shadowColor : "#FFF4",
      fillStyle : "Black",
      font : "20px serif",
  }
  const userAgent = navigator.userAgent;
  // /Android|iPhone|iPad/i.test(navigator.userAgent)

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
      .then(handleMediaSuccess)
      .catch(handleError);


    getQuery()
  }

  function handleMediaSuccess(stream) {
    window.stream = stream; // make stream available to browser console
    video.srcObject = stream;

    // make track variable available to browser console.
    const videoTracks = stream.getVideoTracks();
    console.log('Got stream with constraints:', constraints);
    console.log(`Using video device: ${videoTracks[0].label}`);
    const [track] = [window.track] = stream.getVideoTracks();
    const capabilities = track.getCapabilities();
    const settings = track.getSettings();

    for (const ptz of ['zoom']) { //'pan', 'tilt', 
      // Check whether camera supports pan/tilt/zoom.
      if (!(ptz in settings)) {
        errorMsg(`Camera does not support ${ptz}.`);
        continue;
      }

      // Map it to a slider element.
      const input = document.querySelector(`input[name=${ptz}]`);
      input.min = capabilities[ptz].min;
      input.max = capabilities[ptz].max;
      input.step = capabilities[ptz].step;
      input.value = settings[ptz];
      input.disabled = false;
      input.oninput = async event => {
        try {
          const constraints = {advanced: [{[ptz]: input.value}]};
          await track.applyConstraints(constraints);
        } catch (err) {
          console.error('applyConstraints() failed: ', err);
        }
      };
    }
  }

  function handleError(error) {
    console.log('navigator.MediaDevices.getUserMedia error: ', error.message, error.name);
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
      setTimeout(startup,100);
    }else{
      video.pause();
      // video.src=null;
      for (const track of video.srcObject.getTracks()) {
        track.stop();
      }
      video.srcObject = null;
    }
    // console.log(camera.perm, e)
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


  let capture = function (ts,wpt) {
    wpt = wpt || props.waypoint
    let timestamp = ts || new Date().toISOString()
    // debugger
    let email = userData.email || "userData.email"

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    let ctx=canvas.getContext('2d')
    // ctx.scale(4,4);
    ctx.drawImage(video, 0, 0, );//canvas.width, canvas.height
    // 'file' comes from the Blob or File API
    let uploadPath = `${UPLOADS_FOLDER}/${props.raceId}/${timestamp}~${wpt}~${email.replace("@","$")}~capture.png`

    let uploadRef = stoRef(storage, uploadPath);
    // Create file metadata including the content type
    /** @type {any} */
    const metadata = {
      contentType: 'image/png',
    };


    canvas.toBlob(blob => {
      console.log(`Uploading ${blob.size}b to ${uploadPath}`, blob);

      uploadBytes(uploadRef, blob).then((snapshot) => {
        console.log(`Uploaded a blob or file! ${snapshot.ref.fullPath}`,snapshot);
        Object.assign(ctx,shadowOptions)
        ctx.fillText(uploadPath, 10, 30);
      }).catch(e => {
        console.error("Error uploading " + JSON.stringify(e))
      });
      
    })

  };

  onMounted(() => {
    startup();
    getAllDocs(`races/${props.raceId}/bibs`).then(x=>allBibs=x)
    })

  let klick=()=>{debugger};

  function recordBib(d){
    // console.log(bib.value,d)
    let bibNo=bib.value.trim()
    let ts=new Date().toISOString()
    let email = userData.email || "userData.email"    
    let payload = {bib: bibNo,
      timestamp :ts,
      userId: email.replace("@","$"),
      waypoint: d || props.waypoint 
    }
    setDoc(doc(db,`races/${props.raceId}/readings/${ts}_${bibNo}`),payload).then(x=>{
      console.log(`${bibNo} ${ts} saved for ${d}`,camera.perm)
      bib.value=''
    }).catch(console.error)
    // if camera is on send image too
    // debugger;
    if (camera.perm) {
      capture(ts,d)
    }
  }

let allBibs=[]
const bibs = computed((n=10)=> allBibs.filter(x=>
          x.Bib.includes(bib.value)).slice(0,n))//

</script>

<style scoped>
canvas {
  width: 70vw;
}

li.shadow {
  color: yellow;
  opacity: .5;
  text-shadow: black .3em;
}
</style>

