<script setup>
import { computed, ref } from 'vue'
// import { useStore } from 'vuex';
import Image from 'primevue/image';
import Dialog from 'primevue/dialog';

let props = defineProps({
  raceId: String,
  imagePath: String,
  bibNo: String,
})
let imagePath=props.imagePath
const visible = ref(false);
const getPublicUrl = (folder,raceId,file) => `https://storage.googleapis.com/run-pix.appspot.com/${folder}/${raceId}/${file.replace(/.png/i,'.jpg')}`
const shareableUrl = computed(() => `https://run-pix.web.app/image/${btoa([props.raceId,props.bibNo,imagePath].join('/'))}`)

let thumbUrl=ref(getPublicUrl('thumbs',props.raceId,imagePath))
let photoUrl=ref(getPublicUrl('processed',props.raceId,imagePath))
</script>
    
<template >
    
      <Image v-tooltip="'Click to see high resolution image'" 
        class="p-image thumb flex-auto m-2 "
        v-bind:src="thumbUrl" v-bind:aria-label="imagePath" 
        @click="visible = true"/> 

      <!-- <Button label="Show" icon="pi pi-external-link" @click="visible = true;getUrl(imagePath,false)" /> -->

      <Dialog v-model:visible="visible" maximizable modal v-bind:header="raceId" :style1="{ width: '50vw' }">
        <Image v-tooltip="'Click to download'" :src="photoUrl" v-bind:aria-label="photoUrl" /> 
        <div>
          
            <Button>Edit</Button>    
          
            <Button>Delete</Button>
        </div>
      </Dialog>       

</template>

<style scoped>
.thumb {
  max-width: 19vh;
}
</style>
