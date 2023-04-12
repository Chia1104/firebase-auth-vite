<script setup>
import { computed, defineProps, ref } from 'vue'
import { useStore } from 'vuex';
import { useToast } from "primevue/usetoast";
import Paginator from 'primevue/paginator';

import { db, storage } from "../../firebase/config" 
import { ref as dbRef, getDownloadURL } from "firebase/storage";
import { collection,query,doc, onSnapshot, getDocs } from "firebase/firestore";
import Image from "primevue/image";

let props = defineProps({
  raceId: String,
  bibRegex: String,
  waypoint: String,
})
console.log(props.bibRegex)

const store = useStore()

const first = ref(0);
const rows = ref(20);

let images=ref([])
let raceDoc=doc(db, "races", props.raceId); //

const q = query(collection(raceDoc, "images"));
const unsubscribe = onSnapshot(q, (querySnapshot) => {
  const _images = [];
  querySnapshot.forEach((doc) => {
      let data = doc.data()
      getUrl(images.value.length, data.imagePath)
      _images.push(filterBibNos(data));
  });
  images.value = _images
});

/**
 * Filter bib numbers
 */
function filterBibNos(d) {
    let re=RegExp(props.bibRegex ? `^${props.bibRegex}$` : '^\\d{3,5}$')
    d.textAnnotations=d.textAnnotations.filter(
          t=>t.description.search(re)!=-1)
    return d;
}

function getUrl(i,filePath,thumb=true,retry=true){
  let baseFile=filePath.split('/').pop().replace('.png',".jpg")
  let folder = (thumb) ?'thumbs': 'processed'
  
  let r=dbRef(storage,`${folder}/${props.raceId}/${baseFile}`)
  // debugger;
  getDownloadURL(r)
  .then((url)=>{
    // console.log(i,filePath,images.value[i])
    images.value[i].url=url
    })
  .catch((error)=>{
        // A full list of error codes is available at
    // https://firebase.google.com/docs/storage/web/handle-errors
    // https://storage.googleapis.com/run-pix.appspot.com/uploads/mychoice23mar/2022-01-13T12%3A23%3A36.476Z%5Estart%5Eavinashmane%40gmail.com%5E9955-3Certificate.png             
    images.value[i].url=`https://storage.googleapis.com/run-pix.appspot.com/${filePath}`
    switch (error.code) {
      case 'storage/object-not-found':
        // File doesn't exist
        break;
      case 'storage/unauthorized':
        // User doesn't have permission to access the object
        break;
      case 'storage/canceled':
        // User canceled the upload
        break;
      // ...
      case 'storage/unknown':
        // Unknown error occurred, inspect the server response
        break;
      default:
        console.warn(`error in getDownloadURL`,error)
    }
  })
}

let range=(i,j,max)=> ([...Array(j).keys()]
                  .map(x=>x+i )
                  .filter(x=>x<=max)
                  )


function getURI(i){
  let img=images.value[i].imagePath
  let url =`/e/${props.raceId}/i?img=`+encodeURIComponent(img)
  console.log(url)
  return url
}
</script>
    
<template>
    <Paginator v-model:first="first" v-model:rows="rows" :totalRecords="images.length" template="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
      currentPageReportTemplate="{first}-{last} of {totalRecords}" />
    <div class="flex flex-wrap bg-gray-200 justify-evenly">      
      <div v-for="i in range(first,rows,images.length)" :key="i" class="thumb">
        <a v-if="images[i]" :href="getURI(i)">
          <Image v-if="images[i].imagePath"  :src="'https://storage.googleapis.com/run-pix.appspot.com/thumbs/'+raceId+'/'+images[i].imagePath.replace('.png','.jpg')"/>>
          <!-- <ImageReviewCard  v-bind:raceId="raceId" v-bind:imagePath="images[i].imagePath"/> -->
          <small v-for="t of images[i].textAnnotations">{{t.description}} /</small>
        </a>
      </div>
    </div>

    <Button @click="">⭕</Button>
</template>

<style scoped>
.thumb >>> img {
  max-width: 10em;
  background-color: blue;
}
</style>
