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
  bibNo: String,
})
let imagePath=props.imagePath
const visible = ref(false);
const getPublicUrl = (folder,raceId,file) => `https://storage.googleapis.com/run-pix.appspot.com/${folder}/${raceId}/${file.replace(/.png/i,'.jpg')}`
const shareableUrl = computed(() => `https://run-pix.web.app/image/${btoa([props.raceId,props.bibNo,imagePath].join('/'))}`)
// console.warn(btoa([props.raceId,props.bibNo,imagePath].join('/')))
// console.warn(shareableUrl.value)

let thumbUrl=ref(getPublicUrl('thumbs',props.raceId,imagePath))
let photoUrl=ref(getPublicUrl('processed',props.raceId,imagePath))
function copyUrl(url) {
  url = url || shareableUrl.value
  navigator.clipboard.writeText(url)
  alert(`URL copied to clipboard ${url}`)
}
</script>
    
<template >
    
      <Image v-tooltip="'Click to see high resolution image'" 
        class="p-image thumb flex-auto m-2 "
        v-bind:src="thumbUrl" v-bind:aria-label="imagePath" 
        @click="visible = true"/> 

      <!-- <Button label="Show" icon="pi pi-external-link" @click="visible = true;getUrl(imagePath,false)" /> -->

      <Dialog v-model:visible="visible" maximizable modal v-bind:header="raceId" :style1="{ width: '50vw' }">
        <Image v-tooltip="'Click to download'" :src="photoUrl" v-bind:aria-label="photoUrl" /> 
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
        </div>
      </Dialog>       

</template>

<style scoped>
.thumb {
  max-width: 19vh;
}
</style>
