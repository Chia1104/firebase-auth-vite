<script setup>
import { defineProps, ref } from 'vue'
import { useStore } from 'vuex';
import { useToast } from "primevue/usetoast";
// import Button from 'primevue/button';
import { db, storage } from "../../firebase/config" 
import { ref as dbRef, getDownloadURL } from "firebase/storage";


let props = defineProps({
  raceId: String,
  bibRegex: String,
  waypoint: String,
})
console.log(props.bibRegex)

const store = useStore()
const toast = useToast();

const showTemplate = (summary, detail) => {
  toast.add({severity: 'warn', summary: summary, detail: detail, group: 'bc'});
}
const popup = () => {
    debugger;
    toast.add({severity: 'warn', summary: 'summary', detail: 'detail', group: 'bc'});
}

import { collection,query,doc, onSnapshot, getDocs } from "firebase/firestore";

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

function getUrl(i,filePath,thumb=true){
  if (thumb) 
    filePath = `thumbs/${props.raceId}/${filePath.replace("processed","")}`.replace('.png',".jpg")

  let r=dbRef(storage,filePath)
  getDownloadURL(r)
  .then((url)=>{
    // console.log(i,filePath,images.value[i])
    images.value[i].url=url
    })
  .catch((e)=>{console.error(`error in getDownloadURL`,e)})
}
</script>
    
<template>
    <Button @click="popup">popup</Button>
    <div v-for="i in images">
      {{i.imagePath}} : <img v-bind:src="i.url" /> 
      <small v-for="t of i.textAnnotations"><span>{{t.description}}</span>/</small>
    </div>
</template>

<style scoped>

</style>
