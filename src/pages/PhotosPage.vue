
<template >
  <div class="container mx-auto ">
    <h1 @dblclick="klick()">Photos</h1>
    <Dropdown v-model="raceId" :options="races" optionLabel="Name" optionValue="id"
                      placeholder="Select a race" class="md:w-14rem w-full" />   
    <div class="card flex justify-content-center w-full">
      <AutoComplete v-model="bibSelection" showClear  :suggestions="items" @complete="searchBib" 
        :dropdown-click="searchBib" class="w-full" />
        <!-- <AutoComplete v-model="selectedItem" :suggestions="filteredItems" @complete="searchItems" :virtualScrollerOptions="{ itemSize: 38 }" optionLabel="label" dropdown /> -->
      <Button name="searchImages" @click="searchImages">Search</Button>
    </div>                     
    <div class="w-full text-center justify-center flex-col">
      <!-- <Button name="Check" @click="klick">Create</Button> -->
    </div>
    <div class="">

      <h2 v-if="bibSelection && raceId">{{images.length}} photos found for bib {{bibSelection}} {{bibData.Name}}</h2>
    </div>
    <!-- <div v-for="img in images">
      <ImageCard :raceId="raceId" :imagePath="img.imagePath"/>
    </div> -->
    <div class="card md:flex md:justify-content-center">
        <Galleria :value="images" :responsiveOptions="responsiveOptions" :numVisible="5" containerStyle="max-width: 640px">
            <template #item="slotProps">
                <img :src="slotProps.item.itemImageSrc" :alt="slotProps.item.alt" style="width: 100%" />
            </template>
            <template #thumbnail="slotProps">
                <img :src="slotProps.item.thumbnailImageSrc" :alt="slotProps.item.alt" />
            </template>
        </Galleria>
    </div>
  </div>
  <!-- {{raceId}} -->
</template>

<script setup>
import { useStore } from 'vuex';
// import ImageCard from "../components/ImageCard.vue";
import Dropdown from 'primevue/dropdown';
import AutoComplete from 'primevue/autocomplete';
import Galleria from 'primevue/galleria';
import { useRoute } from 'vue-router';
import { computed, ref } from 'vue';
import { ref as storageRef, getDownloadURL } from "firebase/storage";
import { collection, getDocs,doc,  query, where, limit, onSnapshot } from "firebase/firestore"; //ref as dbRef,

import { db, storage } from "../../firebase/config" 
const store = useStore()
store.dispatch('getRacesAction')

const route = useRoute();  


const races =  computed(() => 
    store.state.datastore.races.filter(r=>
        (r.photoStatus ))); //&& r.photoStatus.indexOf("available")
  
let raceId = ref("")
if(route.params.raceId){
  console.log(route.params.raceId)
  raceId.value=route.params.raceId
}
const bibSelection = ref("");
if (route.params.bib)
  bibSelection.value=route.params.bib

let filteredBibObjects=ref([])
let bibData = computed(()=>{
  let filt=filteredBibObjects.value.filter(x=>x.Bib==bibSelection.value)
  return filt.length? filt[0] : []})

const items = ref([]);
const images = ref([])




// const getFirstPart = function(bibstr) { return "x"+bibstr.split(/\t\ /)[0]}

// const q = query(collection(raceImagesCol, ));
const searchBib = async (event) => {
  // exit if raceId is not selected
  if (!raceId.value) return;
  var raceBibsCol=collection(db, "races", raceId.value, "bibs" ); 

  let n=10,
    _items = [];
  let querySnapshot = await getDocs(
        query(raceBibsCol,
        where('Bib',">=",event.query),
        where('Bib',"<=",event.query+'\uf8ff'),
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
      // data.Name
      ].join(' ')) ;
  }else{  
    items.value=[event.query.split(" ")[0]]
  }
}

const searchImages = async () => {
  let bibNo=bibSelection.value.split(" ")[0],
    _items = [];
  var raceImagesCol=collection(db, "races", raceId.value, "images" ); //  
  
  let querySnapshot = await getDocs(
        query(raceImagesCol,
          where('texts',"array-contains",bibNo),
        ));
  // debugger;
  // console.debug(querySnapshot.docs)
  for (let i=0;i<querySnapshot.docs.length;i++) {
    let data = querySnapshot.docs[i].data()
    // console.log(`>>`,data)
    let urls=await updateUrls(i,data.imagePath)
    data.thumbnailImageSrc= urls.thumbs
    data.itemImageSrc     = urls.processed
    _items.push(data);
  };  

  // debugger
  images.value=_items ;
  // console.log(`${bibNo}  ${images.value.length}`)
  return _items
}
  
async function updateUrls( i, inFilePath){
  let infilePath=inFilePath.replace('.png',".jpg")
  let urls={}
  
  for (let prefix of ['thumbs','processed'] ){
    let filePath = `${prefix}/${raceId.value}/${infilePath}`

    let r=storageRef(storage,filePath)  
    // console.debug("PhotosPage",filePath,r)
    
    await getDownloadURL(r)
      .then((url)=>{
        urls[prefix]=url;
        // if (prefix=='thumbs') // no braces
        //   images[i].value.thumbnailImageSrc=url;
        // else
        //   images[i].value.itemImageSrc =url;
      })
      .catch((e)=>{
        console.error(`error in getDownloadURL ${filePath}`,e)
      })
  } 
  // debugger
  return urls 
}

let klick=() => { 
  debugger;
}

// const images = ref();
const responsiveOptions = ref([
    {
        breakpoint: '991px',
        numVisible: 4
    },
    {
        breakpoint: '767px',
        numVisible: 3
    },
    {
        breakpoint: '575px',
        numVisible: 1
    }
]);
</script>
