
<template >
  <div class="container mx-auto ">
    <h1 @dblclick="klick()">Photos</h1>
    <form @submit="searchImages" class="gap-2">
      <Dropdown v-model="raceId" :options="races" optionLabel="Name" optionValue="id"
                        placeholder="Select a race" class="md:w-14rem w-full" />   
      <div class="card flex justify-content-center w-full">
        <Button @click="bibSelection='';images=[];"><i class="pi pi-times"></i></Button>
        <AutoComplete id="searchBib" v-model="bibSelection" showClear  :suggestions="items" @complete="searchBib" 
          :dropdown-click="searchBib" class="w-full" />
          <!-- <AutoComplete v-model="selectedItem" :suggestions="filteredItems" @complete="searchItems" :virtualScrollerOptions="{ itemSize: 38 }" optionLabel="label" dropdown /> -->
        <Button name="searchImages" @click="searchImages">Search Photos</Button>
      </div>                     
    </form>
    <div v-if="bibSelection && raceId" class="w-full text-lg ">
      BIB: {{bibSelection}} {{bibData.Name}}
      <small class="text-right">{{message}}</small>
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
    <div class="w-full text-center justify-center flex-col"
    v-if="images.length && bibNo && raceId" >
      {{images.length}} images found.  NOTE: You can search for 3 digit part of the bib number too.
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
// import Galleria from 'primevue/galleria';
import { useRoute } from 'vue-router';
import { computed, ref } from 'vue';
import { ref as storageRef, getDownloadURL } from "firebase/storage";
import { collection, getDocs,doc, query, where, limit, onSnapshot } from "firebase/firestore"; //ref as dbRef,

import { db, storage } from "../../firebase/config" 
const store = useStore()
store.dispatch('getRacesAction')

const LIMIT_PICS=50
const route = useRoute();  


const races =  computed(() => 
    store.state.datastore.races.filter(r=>
        (r.photoStatus && (r.photoStatus.indexOf("available")>=0) )));
  
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

const items = ref([]);
const images = ref([])
let bibNo=computed(()=>bibSelection.value.split(" ")[0])
// const getFirstPart = function(bibstr) { return "x"+bibstr.split(/\t\ /)[0]}

// const q = query(collection(raceImagesCol, ));
const searchBib = async (event) => {
  // exit if raceId is not selected
  if (!raceId.value) return;
  var raceBibsCol=collection(db, "races", raceId.value, "bibs" ); 
  images.value=[]
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

const searchImages = async () => {
  let bibNo=bibSelection.value.split(" ")[0],
      containsOperator="array-contains",
    _items = [];
  if (!raceId.value){
    message.value=`Select race `
    return []
  } else if (bibNo.toUpperCase()=='MISSING'){
    bibNo=[]
    containsOperator='=='
  }
  message.value=`Searching photos for ${bibSelection.value} `
  console.log(bibSelection.value)
  
  var raceImagesCol=collection(db, "races", raceId.value, "images" ); //  
  let querySnapshot = await getDocs(
        query(raceImagesCol,
          where('texts',containsOperator,bibNo),
          limit(LIMIT_PICS)
        ));
  if(querySnapshot.docs.length){
    for (let i=0;i<querySnapshot.docs.length;i++) {
      let data = querySnapshot.docs[i].data()

      if (!(data.status && data.status=="hidden"))
        _items.push(data);
    };  

    images.value=_items ;
  }
  message.value=`Found ${images.value.length} photos for ${bibNo} `
  return _items
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
    diaTexts.value=(images.value[i] && images.value[i].texts) ? images.value[i].texts.join(',') : ''
  } else{
    entryToEdit.value=false
    visible.value=false
  }
}


const getPublicUrl = (folder,raceId,file) => `https://storage.googleapis.com/run-pix.appspot.com/${folder}/${raceId}/${file.replace(/.png/i,'.jpg')}`
const shareableUrl = computed(() => `https://run-pix.web.app/image/${btoa([raceId,bibNo,images.value[entryToEdit.value].imagePath].join('/'))}`)

// let thumbUrl=ref(getPublicUrl('thumbs',raceId.value,images.value[entryToEdit.value].imagePath))
// let photoUrl=ref(getPublicUrl('processed',raceId.value,images.value[entryToEdit.value].imagePath))
function copyUrl(url) {
  url = url || shareableUrl.value
  navigator.clipboard.writeText(url)
  alert(`URL copied to clipboard ${url}`)
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