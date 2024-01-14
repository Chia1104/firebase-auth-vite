
<template >
  
  <div class="container mx-auto gap-3">
    <h1 @dblclick="klick()">Photos</h1>
    
    <form @submit="searchImages" class="gap-2 mx-2">
      <Dropdown v-model="raceId" :options="races" optionLabel="Name" optionValue="id"
                        placeholder="Select a race" class="md:w-14rem w-full" />   
      <div class="card flex justify-content-center w-full gap-2 py-1" v-if="!races.find(x=>x.id==raceId)?.photoStatus.includes('faceonly')">
        <Button @click="bibSelection='';allImages=[];uploadedImage=''" class="text-white" raised >
          <i class="pi pi-times"></i>
        </Button>
        <AutoComplete id="searchBib" v-model="bibSelection" showClear  :suggestions="items" @complete="searchBib"  placeholder="Enter your BIB number"
          :dropdown-click="searchBib" class="w-full" inputClass="px-2"/>
          <!-- <AutoComplete v-model="selectedItem" :suggestions="filteredItems" @complete="searchItems" :virtualScrollerOptions="{ itemSize: 38 }" optionLabel="label" dropdown /> -->
        <Button name="searchImages" @click="searchImages"  class="text-white" raised>
          <i class="pi pi-search"></i>
        </Button>
      </div>                     
    </form>
    
    <div v-if="bibSelection && raceId" class="w-full text-lg ">
      BIB: {{bibSelection}} {{bibData.Name}}
      <small class="text-right">{{message}}</small>
    </div>
    <div v-if="!bibSelection && raceId && races.find(x=>x.id==raceId)?.photoStatus.includes('face')" > 
      <hr/>
      <FileUpload mode="basic" name="demo[]"  accept="image/*" customUpload @uploader="faceUploader" 
      class="w-full "
        :maxFileSize="10000000" :auto="true" chooseLabel="Upload cropped face image 👤" />
    </div>

  
    <div class="flex flex-wrap bg-gray-200 w-full justify-evenly">
      <!-- <ImageCard v-for="img in images" v-bind:raceId="raceId" v-bind:bibNo="bibNo" v-bind:imagePath="img.imagePath"/> -->
      <!-- <div class="flex-auto bg-teal-400 p-4 m-2">1</div>   -->
      <div v-for="(img,i) in images">
        <Image v-tooltip="'Click to see high resolution image'" 
          class="p-image thumb flex-auto m-2 " v-bind:aria-label="images[i].imagePath"
          v-bind:src="getPublicUrl('thumbs',raceId,images[i].imagePath)"  
          @click="toggleDialog(i)"/> 
      </div>
      <!-- v-bind:imagePath="img.imagePath" -->
    </div>

    <div class="container py-10 px-10 mx-0 min-w-full flex flex-col items-center" v-if="raceId" >

      <ProgressSpinner v-if="searchInProgress"/> 
      <!-- uploadedImage && !allImages.length -->

      <Button rounded class="p-button-rounded p-button-raised" v-if=" uploadedImage && (allImages.length>images.length)" 
        @click="getMorePhotos()">
        <i class="pi pi-search-plus" ></i></Button>
      <div class="w-full text-center justify-center flex-col"
        v-if="images.length && (bibNo || uploadedImage)" >
        {{images.length}} images found.  <span style="font-size:.3em;">{{ minDist }}</span><br/>
        <small>NOTE: You can search for 3 digit part of the bib number too.</small>
      </div>  
    </div>  

  </div>

  <Dialog v-model:visible="visible" maximizable modal 
    v-bind:header="dialogHeader" >

    <Image v-tooltip="'Click to download'" 
    :src="getPublicUrl('processed',raceId,images[entryToEdit].imagePath)" v-bind:aria-label="images[entryToEdit].imagePath" /> 

    <div style="font-size: 1rem">
      <ShareNetwork
        network="facebook"
        :url="shareableUrl"
        title="Celebrating fitness"
        description="I’d like to share just one of many pictures . Take a moment search pics for your family and friends, to appreciate their fitness commitment."
        quote="Never give up!"
        hashtags="#pcmcrunners"
      >
        <Button><i class="pi pi-share-alt" /> &nbsp;<i class="pi pi-facebook" ></i></Button>
      </ShareNetwork>
      
      <ShareNetwork
        network="WhatsApp"
        :url="shareableUrl"
        title="Celebrating fitness"
        description="I’d like to share a picture. Please take a moment search pics for your family and friends.  #NeverGiveUp #RunPiX"
      >
        <Button><i class="pi pi-share-alt" /> &nbsp;<i class="pi pi-whatsapp" /></Button>
      </ShareNetwork>
      
      <Button @click="copyUrl(shareableUrl);"><i class="pi pi-link" /></Button>
      
      <a :href="getPublicUrl('processed',raceId,images[entryToEdit].imagePath)" :download="`RUNPIX_{raceId}_{entryToEdit.vale}`">
        <Button><i class="pi pi-download"></i></Button>
      </a>
    </div>
  </Dialog>       


</template>

<script setup>
import { useStore } from 'vuex';
import ImageCard from "../components/ImageCard.vue";
import Dropdown from 'primevue/dropdown';
import Image from 'primevue/image';
import Dialog from 'primevue/dialog';
import AutoComplete from 'primevue/autocomplete';
import ProgressSpinner from 'primevue/progressspinner';
import FileUpload from 'primevue/fileupload'
import Button from 'primevue/button';
import { useRoute } from 'vue-router';
import { computed, ref } from 'vue';
import { ref as storageRef, getDownloadURL } from "firebase/storage";
import {config} from "../config"
import { collection, getDocs,doc, query, where, limit, onSnapshot } from "firebase/firestore"; //ref as dbRef,
import { uploadFiletoGCS } from "../helpers/file-uploader"
import axios from 'axios';
import Compressor from 'compressorjs';
import { db, storage } from "../../firebase/config" 
import _ from "lodash"
// wakesup the backend
fetch(config.api.faceMatchUpload+'/api/faceapi',{headers: {mode: "cors", "Referer": "https://runpix.web.app" }}) //call the fetch function passing the url of the API as a parameter
.then(function(x) {console.log(`/api/faceapi: Status: ${x.status}`)})
.catch(function(e) {console.error(e) });

const store = useStore()
store.dispatch('getRacesAction')

const route = useRoute();  

const races =  computed(() => 
                _.orderBy(store.state.datastore.races
                  .filter(r=>(r.photoStatus && (r.photoStatus.indexOf("available")>=0) )),
                  "Date","desc")
                );
  
let raceId = ref("")
if(route.params.raceId){
  console.log(route.params.raceId)
  raceId.value=route.params.raceId
}
const bibSelection = ref("");
if (route.params.bib)
  bibSelection.value=route.params.bib
const message = ref("")
let filteredBibObjects=ref([])

let bibData = computed(()=>{
  let filt=filteredBibObjects.value.filter(x=>x.Bib==bibSelection.value)
  return filt.length? filt[0] : []})

const uploadedImage = ref('')
const items = ref([]);
const allImages = ref([])
const images = computed(() => allImages.value.filter((x,i)=> {
    let ret= ((i<3) || (x.dist || 0) <= minDist.value/100);
    return ret})
)// old ref([])
const searchInProgress=ref(false)
const minDist = ref(config.face.minDistx100);
let bibNo=computed(()=>bibSelection.value.split(" ")[0])
// const getFirstPart = function(bibstr) { return "x"+bibstr.split(/\t\ /)[0]}

/**
 * Dropdown for the Bib
 * @param {*} event 
 */
const searchBib = async (event) => {
  // exit if raceId is not selected
  if (!raceId.value) return;
  var raceBibsCol=collection(db, "races", raceId.value, "bibs" ); 
  allImages.value=[]
  let n=10,
  _items = [];
  let searchField=isNaN(event.query) ? 
               'Name' :'Bib' ;
  let qryString = isNaN(event.query) ? 
                event.query.toUpperCase() : event.query;
  let querySnapshot = await getDocs(
        query(raceBibsCol,
        where(searchField,">=",qryString),
        where(searchField,"<=",qryString+'\uf8ff'),
        limit(n)));

  querySnapshot.forEach((doc) => {
            let data = doc.data()
            // console.log(`>>`,data)
            _items.push(data);
  });
  
  // map values to list and database
  if(_items.length)    {
    filteredBibObjects.value=_items;
    items.value=_items.map(data=>[
      data.Bib,
      // data.Race,
      data.Name
      ].join(' - ')) ;
  }else{  
    items.value=[event.query.split(" ")[0]]
  }
  message.value="..."
}

/**
 * search Images
 */
const searchImages = async () => {
  let bibNo=bibSelection.value.split(" ")[0],
        containsOperator="array-contains",
        _items = [];

  if (uploadedImage.value) {
    message.value=`Searching photos for ${uploadedImage.value} `
    
    let raceImagesCol=collection(db, "facesearch", raceId.value, "uploads" , uploadedImage.value ,"matches"); //  
    let querySnapshot = await getDocs(
          query(raceImagesCol,
            //need confidence where('texts',containsOperator,bibNo),
            limit(config.images.limit_pics)
          ));

    if(querySnapshot.docs.length){
      let data = querySnapshot.docs.map(x=>x.data())
      
      allImages.value=_.orderBy(data
                        .map(mapFaceMatchRet),
                        "dist","asc") ;
    }
    message.value=`Found photos for uploaded face`
    return _items

  } else {

    if (!raceId.value){
      message.value=`Select race `
      return []
    } else if (bibNo.toUpperCase()=='MISSING'){
      bibNo=[]
      containsOperator='=='
    }

    message.value=`Searching photos for ${bibSelection.value} `
    console.log(bibSelection.value)
    
    let raceImagesCol=collection(db, "races", raceId.value, "images" ); //  
    let querySnapshot = await getDocs(
          query(raceImagesCol,
            where('texts',containsOperator,bibNo),
            limit(config.images.limit_pics)
          ));
    if(querySnapshot.docs.length){
      for (let i=0;i<querySnapshot.docs.length;i++) {
        let data = querySnapshot.docs[i].data()

        if (!(data.status && data.status=="hidden"))
          _items.push(data);
      };  

      allImages.value=_items ;
    }
    message.value=`Found ${allImages.value.length} photos for ${bibNo} `
    return _items
  }
}

function mapFaceMatchRet(d){
  // need imagePath...could get metadata
  return {
    imagePath:d.file,
    score:d.score,
    dist:d.dist,
  }
}
  
/**
 * 
 * @param {*} x: unused 
 */
///local url was 60d28877-c93f-481b-9c3d-5caddf532ee0"
let faceUploader=async (x)=>{

  searchInProgress.value=true
  message.value=`Searching faces in the uploaded image`
    
  
  let uploadImage=x.files[0]
  let fileId =   [ encodeURIComponent(uploadImage.name.split('/').pop()),uploadImage.lastModified,uploadImage.size].join("~")

  // let uploadPath = `${config.storage.faceUploads}/${raceId.value}/${fileId}`
  // let response = await uploadFiletoGCS(uploadPath, uploadImage);
  allImages.value=[];
  minDist.value=config.face.minDistx100;


  new Compressor(uploadImage, {
    quality: 0.6,
    maxHeight: 2048,
    maxWidth: 2048,
    // The compression process is asynchronous,
    // which means you have to access the `result` in the `success` hook function.
    success(result) {
      const formData = new FormData();

      // The third parameter is required for server
      formData.append('event',raceId.value)
      formData.append('imageFile', fileId)
      formData.append('image', uploadImage, uploadImage.name);

  //     // Send the compressed image file to server with XMLHttpRequest.
      axios.post(config.api.faceMatchUpload+'/api/matchimage', formData)
      .then((ret) => {
        console.log('Upload success',ret);
    
        allImages.value=_.orderBy(ret.data
                                    .map(mapFaceMatchRet),
                                    "dist","asc") ;        
        message.value=`Searching faces in the uploaded image`
        setTimeout(()=>{message.value=''},5000)
      })
      .catch(e=>{
        if (e.response.status==422){
          console.log('No faces found in the uploaded image')
        } else
          console.warn(e)
        uploadedImage.value=null
      });
      searchInProgress.value=false      
    },
    error(err) {
      console.log(err.message);
    },
  });

  uploadedImage.value = fileId
  message.value = `${fileId} Uploaded`
  // searchImages()
  searchInProgress.value=false
  return fileId // this will get updated in firestore
}

let klick=() => { 
  debugger;
}

// dialog
const visible = ref(false)
const entryToEdit = ref(null)
let diaTexts=ref('')
let dialogHeader=computed(()=>
      (races.value.length&&raceId.value)?
          races.value.filter(x=>x.id==raceId.value)[0].Name :
          '')

function toggleDialog  (i){
  console.debug(`toggleDialog: ${i}`)
  if (entryToEdit) {
    entryToEdit.value=i
    visible.value=true
    diaTexts.value=(images?.value[i]?.texts) ? images.value[i].texts.join(',') : ''
  } else{
    entryToEdit.value=false
    visible.value=false
  }
}


const getPublicUrl = (folder,raceId,file) => 
  `https://storage.googleapis.com/run-pix.appspot.com/${folder}/${raceId}/${file.replace(/.png/i,'.jpg')}`
const shareableUrl = computed(() => {
  return `https://run-pix.web.app/image/${btoa([raceId.value,bibNo.value,images.value[entryToEdit.value].imagePath.replace(/.png/i,'.jpg')].join('/'))}`})

// let thumbUrl=ref(getPublicUrl('thumbs',raceId.value,images.value[entryToEdit.value].imagePath))
// let photoUrl=ref(getPublicUrl('processed',raceId.value,images.value[entryToEdit.value].imagePath))
function copyUrl(url) {
  url = url || shareableUrl.value
  navigator.clipboard.writeText(url)
  alert(`URL copied to clipboard\n\n${url}`)
}

function getMorePhotos(){
  // debugger;
  let maxDistAmongDisplayedPics = Math.max(...images.value.map(x=>x.dist))
  minDist.value=parseInt(
      Math.max(minDist.value+2, 
               Math.min(...allImages.value.map(x=>x.dist).filter(x=>x>maxDistAmongDisplayedPics))*100))+1;
  
}
</script>

<style>
#searchBib input.p-autocomplete-input {
  width: 100%;
  text-transform: uppercase;
}
.thumb img{
  max-width: 19vh;
}

</style>