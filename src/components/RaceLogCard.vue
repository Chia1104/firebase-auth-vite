    
<template>
  <div>
    Start:  {{startTime}} - 
    <!-- <InputMask v-model="startTime" 
      dateTimeFormat="YYYY-MM-DD HH:mm:SS" placeholder="YYYY-MM-DD HH:MM:SS" mask="9999-99-99 99:99:99"/> -->
      <!-- {{formatDate(startTime)}} -->
  </div> 
  <Dropdown :options=waypoints v-model="selWpt"/>
  <Dropdown :options=bibsOptions v-model="bibsVal"/>
  <Dropdown :options=sortOptions v-model="sortVal"/>
  <InputText v-model="bibSearch"/>
  <Paginator v-model:first="first" v-model:rows="rows" :totalRecords="entries.length" template="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
    currentPageReportTemplate="{first}-{last} of {totalRecords}" />
  <table class="w-full">
    <tr>
      <th v-for="h in ['TS','Time','Bib','WP','U','%']">{{h}}</th>
    </tr>
    <tr v-for="i in range(first,rows)">
    <template v-if="entries[i]">
      <td>{{i}}</td>
      <td>
        {{formatDate(entries[i].timestamp)}}
        <i>{{period(entries[i].timestamp)}}</i> 
      </td>
      <td><b>{{entries[i].bib}}</b> 
      <small>{{abbr(entries[i].name,14)}}</small>
      <!-- <b>{{entries[i].score}}</b> -->
      </td>
      <td>
      {{entries[i].waypoint}}
      <u>{{abbr(entries[i].userId)}}</u>
        </td>
      <td class="image w-20%">
          <Image v-if="entries[i].imagePath" preview :src="GS_PREFIX+entries[i].imagePath.replace('processed','thumbs')"/>
          <span v-else>TEXT</span>
          <div class="flex ">
            <i @click="toggleDialog(i)" class="pi pi-pencil"/>
          </div>
      </td>
    </template>
    </tr>
    
  </table>
    
  <Dialog v-model:visible="visible" modal header="Header" >

    <div >
      <tr v-for="(v,k) in {bib:'Bib',status:'Status [valid or invalid]',waypoint:'Waypoint',
                           timestamp:'Timestamp'}">
        <td>{{v}}</td>
        <td><InputText stype="k=='timestamp'?'datetime-local':'text'" v-model="entries[entryToEdit][k]"/></td>
      </tr>
      {{entries[entryToEdit].userId}}
      {{entries[entryToEdit].id}}
      <div v-if="entries[entryToEdit].imagePath"><Image :src="GS_PREFIX+entries[entryToEdit].imagePath"/></div>
    
        <!-- <Image v-tooltip="'Click to see high resolution image'" 
          class="p-image thumb flex-auto m-2 "
          v-bind:src="getPublicUrl('processed',raceId,images[entryToEdit].imagePath)" v-bind:aria-label="images[entryToEdit].imagePath"/>
        <i class="pi pi-trash"/>
        <small v-for="t of images[entryToEdit].textAnnotations">{{t.description}} /</small> -->

    </div>

    <template #footer>
        <Button label="No" icon="pi pi-times" @click="visible = false" text />
        <Button label="Save" @click="submitChange();visible = false" icon="pi pi-check" autofocus />
    </template>
  </Dialog>

  <Button @click="klick">popup</Button>
</template>

<script setup>
import { computed, defineProps, ref } from 'vue'
import { useStore } from 'vuex';

import Paginator from 'primevue/paginator';
import Image from 'primevue/image';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Checkbox from 'primevue/checkbox';
import Dropdown from 'primevue/dropdown';   // optional
// import Row from 'primevue/row';                   // optional
import { db, storage } from "../../firebase/config" //storage
import { collection,query,doc,limit, orderBy ,onSnapshot,getDocs, updateDoc } from "firebase/firestore";

let props = defineProps({
  race: Object,
  raceId: String,
  bibRegex: String,
  waypoint: String,
})
const GS_PREFIX='https://storage.googleapis.com/run-pix.appspot.com/'
const NOMATCH='N/A'
const store = useStore()
const races = store.state.datastore.races;
// const raceStart = new Date(props.race.timestamp.start)

let entries=computed(()=> {
  let ret
  if (selWpt.value){
     ret = allEntries.value.filter(x=>x.waypoint==selWpt.value)
  } else{
    ret = allEntries.value
  }  
  // debugger
  if (bibsVal.value=='Matched'){
     ret = ret.filter(x=>x.name!=NOMATCH)
  } else if (bibsVal.value=='N/A'){
    ret = ret.filter(x=>x.name==NOMATCH)
  }  
  console.log(sortVal.value)
  if (sortVal.value){
    ret = ret.sort((a,b)=>a.timestamp>b.timestamp)
  } else{
    ret = ret.sort((a,b)=>a.timestamp<b.timestamp)
  }
  if (bibSearch.value) ret = ret.filter(x=>x.bib.includes(bibSearch.value))
  return ret
 })

let allEntries=ref([])
const bibsOptions = ['Matched','All',NOMATCH] //matched
const bibsVal = ref('All') //matchedB
const sortOptions = ['Desc','Asc']
const sortVal = ref('Asc')
const bibSearch = ref('')
const waypoints=ref([]) // availably waypoints
const selWpt=ref(null) // selected waypoints (for display)
let bibs=[]
let raceDoc=doc(db, "races", props.raceId); //

const startTime=computed(()=>{
  try{return new Date(props.race.timestamp.start)}
  catch(e) {return ''}
  })



const unsubscribe_bibs = onSnapshot(query(
        collection(raceDoc, "bibs"),), (querySnapshot) => {
  bibs=[]
  querySnapshot.forEach(x=>bibs.push(x.data()));
  // debugger
  // console.log("Array", entries.value);
});


const q = query(collection(raceDoc, "readings"),
                orderBy('timestamp','desc')
                );

const unsubscribe = onSnapshot(q, (querySnapshot) => {
  allEntries.value=[]
  querySnapshot.forEach(mapReading);
  // console.log("Array", entries.value);
});


function mapReading(doc){
  let re=RegExp(props.bibRegex ? `^${props.bibRegex}$` : '^\\d{3,5}$')
  let data = doc.data()
  data.id=doc.id 
  data.name=NOMATCH
  data.status= 'invalid'

  // console.log(re,data,data.bib.search(re))
  if (!data.hasOwnProperty('bib') || doc.id.includes("START")){
    // console.log('nonBib/START',data)
  }else if (data.bib.search(re)!=-1) { // matching bib pattern
    if(data.hasOwnProperty('timestamp')){
      // console.warn(data.timestamp)
      data.timestamp=getDateZ(data.timestamp)
    }
    data.userId= data.userId || 'Unknown'
    for (let bib_found of bibs.filter(x=>x.Bib==data.bib)){
      data.name = bib_found.Name//.Bib
      data.status= data.status || 'valid'
      // debugger
    }    
  } else {
    data.status= data.status || 'incorrect bib'
  }

  allEntries.value.push(data);

  if (!waypoints.value.includes(data.waypoint))
    waypoints.value.push(data.waypoint)

}

/**
 * Convert to date adjusting for timezone
 */
function getDateZ(d){
  if (d[d.length-6]) // e.g. +05:30
    return new Date(d)
  else if (d[d.length-1]=='Z')
    return new Date(d)
  else 
    return new Date(d+'Z')
}


function klick(){
  debugger
}

// Paginator
const first = ref(0);
const rows = ref(10);

const tsOptions = {
  // year: "numeric",
  // month: "numeric",
  // day: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
  hour12: false, };
  
const formatDate = (value) => {
  if (!value) return '--:--:--'
  try {
    // console.debug(value)
    value=new Date(JSON.parse(JSON.stringify(value)))//-new Date(props.race.timestamp.start)
    return value.toLocaleString('en-US',tsOptions)
  }
  catch (e)
  {
    console.error(`error ${value}`)
  }
};

function period(ts){
  ts = typeof ts=='string'? new Date(ts) : ts
  try {
    let start = new Date(props.race.timestamp.start)
    var diffTime= ts.valueOf()-start.valueOf()
  } catch {
    return '00:00:00'
  }
  try {
    // console.debug(diffTime)
    // let diffTime = Math.abs(new Date().valueOf() - new Date('2021-11-22T18:30:00').valueOf());
    let days_float = diffTime / (24*60*60*1000);
    let days = days_float<0 ? Math.floor(days_float) : Math.floor(days_float)
    let hours = ((days_float-days*(24*60*60*1000) )  % 1) * 24;
    let minutes = (hours % 1) * 60;
    let secs = (minutes % 1) * 60;
    [days, hours, minutes, secs] = [Math.floor(days), Math.floor(hours), Math.floor(minutes), Math.floor(secs)]
    //${days} 
    return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`
  } catch (e) {
    console.warn( `error ${ts} ${JSON.stringify(e)}`)
  }
}


let range=(i,j)=> ([...Array(j).keys()]
                  .map(x=>x+i )
                  .filter(x=>x<=entries.value.length)
                  )
let abbr=(x,len=6)=>String(x).substring(0,len)
let pad= (x,n=2) => ('00'+x).slice(-n)

// dialog
const visible = ref(false)
const entryToEdit = ref(null)
function toggleDialog  (i){
  console.debug(`toggleDialog: ${i}`)
  if (entryToEdit) {
    entryToEdit.value=i
    visible.value=true
  } else{
    entryToEdit.value=false
    visible.value=false
  }
}

function submitChange(){
  let re=RegExp(props.bibRegex ? `^${props.bibRegex}$` : '^\\d{3,5}$')
  
  if(entries.value[entryToEdit.value].bib.search(re)>=0){
    let payload=JSON.parse(JSON.stringify(entries.value[entryToEdit.value]))
    let path=`races/${props.raceId}/readings/${payload.id}`
    delete payload.id
    // console.debug(typeof payload.timestamp, payload.timestamp)
    payload.timestamp=new Date(payload.timestamp).toISOString()
    console.debug(`Saving ${JSON.stringify(payload)}`)
    
    updateDoc(doc(db,path),payload)

  } else {
    console.warn(`Non bib found `)
  }

}

</script>
<style scoped>
td.image {
  max-width: 2em;
}

i {
  color: blue;
}
</style>
