<template >
  <router-link :to="'/e/'+raceId" class="text-xl">
      <!-- <Button name="races" >Race</Button> -->
      🔙
  </router-link>
  <Button :label="upload?'Image review':'Bulk Upload'"  @click="upload=!upload" />

  <Upload v-if="upload" 
    :raceId="raceId"/>
  <!-- :waypoint="waypoint"  -->
  <div v-else>

    <div class="flex align-items-center">
        <label for="showHidden" class="ml-2">Show All</label>
        <Checkbox v-model="showHidden" inputId="showHidden"  value="showHidden" />
        <label for="numTexts" class="ml-2">Numbers of bibs</label>
      <Dropdown v-model="numTexts" inputId="numTexts"  :options="numTextsOptions" multiple/>
      {{numTexts}}
    </div>
    <Paginator v-model:first="first" v-model:rows="rows" :totalRecords="images.length" template="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
      currentPageReportTemplate="{first}-{last} of {totalRecords}" />
    <div class="flex flex-wrap bg-gray-200 justify-evenly">    

      <div v-for="i in range(first,rows,images.length)" :key="i" class="thumb" >

        <a v-if="images[i] " xhref="getURI(i)" >
          <Image v-if="images[i].imagePath" 
            :src="GS_PREFIX+'thumbs/'+raceId+'/'+images[i].imagePath.replace('.png','.jpg')"/>
          <!-- <i class="pi pi-image"/> -->
          <div class="flex ">
            <div v-if="images[i].status!='hidden'" @click="setStatus('hidden',images[i].imagePath)">⛔</div>
            <div v-else @click="setStatus('active',images[i].imagePath)">✅</div>
            <i @click="toggleDialog(i)" class="pi pi-pencil"/>
            {{images[i].textsLen}}
          </div>
        </a>

      </div>
    </div>
  </div>

  <Dialog id="dialog" v-model:visible="visible" modal header="Header" class="w-full">

    <div>
      <!-- {{entryToEdit}} -->
      {{images[entryToEdit].imagePath}}
        <Image v-tooltip="'Click to see high resolution image'" 
          class="p-image m-2 "
          v-bind:src="getPublicUrl('processed',raceId,images[entryToEdit].imagePath)" v-bind:aria-label="images[entryToEdit].imagePath"/>
        <i class="pi pi-trash"/>
        <small v-for="t of images[entryToEdit].textAnnotations">{{t.description}} /</small>


      <ul v-if="images[entryToEdit].textAnnotations">
        <li v-for="t in images[entryToEdit].textAnnotations">{{t.description}}
      </li>
      </ul>
      {{images[entryToEdit].status}}

      <ul v-if="images[entryToEdit].metadata">
        <li v-for="(v,k) in images[entryToEdit].metadata" >
          {{k}} : <span class="text-ellipsis">{{v}}</span>
        </li>
      </ul>

    </div>

    <template #footer>
        <a label="Prev" icon="pi pi-chevron-left" @click="entryToEdit--" text />
        <a label="Next" icon="pi pi-chevron-right" @click="entryToEdit++" text />
        <InputText v-model="diaTexts" separator=","  />
        <Button label="No" icon="pi pi-times" @click="visible = false" text />
        <Button label="Save" @click="submitChange();visible = false" icon="pi pi-check" autofocus />
    </template>
  </Dialog>
</template>
<script setup>
import { computed, defineProps, ref, onMounted, reactive } from 'vue'
import { useStore } from 'vuex';
import { useRoute } from 'vue-router'
import Paginator from 'primevue/paginator';
import Upload from "../components/Upload_alt.vue";
import Image from 'primevue/image';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import Checkbox from 'primevue/checkbox';
import { getDocData } from "../api" 
import { db, storage } from "../../firebase/config" 
// import { ref as dbRef, getDownloadURL } from "firebase/storage";
import { collection,query,doc, onSnapshot, updateDoc,getDocs } from "firebase/firestore";

const GS_PREFIX='https://storage.googleapis.com/run-pix.appspot.com/'
const store = useStore()
const route = useRoute()


let raceId=route.params.raceId // name of parameter
let imagePath=route.query.img // name of query
const imgNode=(raceId,imagePath)=>`races/${raceId}/images/${imagePath}`

const first = ref(0);
const rows = ref(20);
const upload = ref(false);

let raceDoc=doc(db, "races", raceId); //
let images=computed(()=>((numTexts.value==null)? 
                            allImages.value :
                            allImages.value.filter(x=>x.textsLen==numTexts.value))
                                .filter(x=> (showHidden.value || x.status!="hidden"))
                            )
let allImages=ref([])


const q = query(collection(raceDoc, "images"));
const unsubscribe = onSnapshot(q, (querySnapshot) => {
  const _images = [];
  querySnapshot.forEach((doc) => {
      let data = doc.data()
      _images.push(filterBibNos(data));
  });
  allImages.value = _images
});

/**
 * Filter bib numbers
 */
function filterBibNos(d,bibRegex) {
    let re=RegExp(bibRegex ? `^${bibRegex}$` : '^\\d{3,5}$')
    d.textAnnotations=d.textAnnotations
      .filter(t=>t.description.search(re)!=-1)
    d.textsLen=d.texts ? d.texts.length : 0
    return d;
}

let range=(i,j,max)=> ([...Array(j).keys()]
                  .map(x=>x+i )
                  .filter(x=>x<=max)
                  )
// filters
const showHidden=ref(false)
const numTexts=ref(null)
const numTextsOptions= ['',0,1,2,3,4,5,6,7,8,9,10]
// dialog
const visible = ref(false)
const entryToEdit = ref(null)
let diaTexts=ref('')

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

function submitChange(e){
  if (diaTexts.value){
    let arr=diaTexts.value.split(',')
    let imagePath=images.value[entryToEdit.value].imagePath
    console.debug(entryToEdit,arr)
    return updateDoc(doc(db,imgNode(raceId,imagePath)),{texts:arr}) 
  } else {
    console.debug('diaText entry blank "${diaText.value}"')
  }
  
}

function getPublicUrl (folder,raceId,file) {return `https://storage.googleapis.com/run-pix.appspot.com/${folder}/${raceId}/${file.replace(/.png/i,'.jpg')}`}
const shareableUrl = computed(() => `https://run-pix.web.app/image/${btoa([props.raceId,props.bibNo,imagePath].join('/'))}`)
const imageData = ref({})


function setStatus(x,imgPath){
  // console.debug(x,imgPath)
  return updateDoc(doc(db,imgNode(raceId,imgPath)),{status:x})  
}

</script>
    

<style scoped>
.thumb {
  width: 19vh;
}
.wide {
  background: oldlace;
}
div#dialog {
  width: 80vw;
}
</style>
