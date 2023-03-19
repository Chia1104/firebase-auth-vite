<script setup>
import { computed, ref } from 'vue'
// import { useStore } from 'vuex';
// import Button from 'primevue/button';
import Image from 'primevue/image';
import Dialog from 'primevue/dialog';
import { db, storage } from "../../firebase/config" 
import { ref as storageRef, getDownloadURL } from "firebase/storage";
// console.debug("Image")

let props = defineProps({
  raceId: String,
  imagePath: String,
})
let imagePath=props.imagePath
console.log(props)

const visible = ref(false);
let thumbUrl=ref("")
let photoUrl=ref("")
getUrl(imagePath,true)

// let PhotoUrl=computed(()=>getUrl(false))
// let raceDoc=doc(db, "races", props.raceId); //

function getUrl(filePath,thumb=true){
  filePath=props.imagePath.replace('.png',".jpg")
  console.log("getUrl",thumb)
  if (thumb) 
    filePath = `thumbs/${props.raceId}/${filePath}`
  else
    filePath = `processed/${props.raceId}/${filePath}`
  let r=storageRef(storage,filePath)
  console.debug("ImageCard",filePath,r)
  getDownloadURL(r)
  .then((url)=>{
    console.log(filePath,url)
    if (thumb) // no braces
      thumbUrl.value=url
    else
      photoUrl.value=url
    })
  .catch((e)=>{console.error(`error in getDownloadURL`,e)})
}
</script>
    
<template>
  <div class="p-image">
    
      <Image v-tooltip="'Click to see high resolution image'" v-bind:src="thumbUrl" v-bind:aria-label="imagePath" /> 

      <Button label="Show" icon="pi pi-external-link" @click="visible = true;getUrl(imagePath,false)" />

      <Dialog v-model:visible="visible" maximizable modal header="Header" :style1="{ width: '50vw' }">
       <Image v-tooltip="'Click to download'" :src="photoUrl" v-bind:aria-label="photoUrl" /> 
      </Dialog>       

  </div>
</template>

<style scoped>

</style>
