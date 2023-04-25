<template>
  <div>
    Start:  {{startTime.toLocaleString()}} - 
    <!-- <InputMask v-model="startTime" 
      dateTimeFormat="YYYY-MM-DD HH:mm:SS" placeholder="YYYY-MM-DD HH:MM:SS" mask="9999-99-99 99:99:99"/> -->
      <!-- {{formatDate(startTime)}} -->
  </div> 
  <div id="selections" class="flex align-items-center">
    <!-- <label for="showAll" class="ml-2">All:</label> -->
    <Dropdown :options=showAllOptions v-model="showAll" inputId="showAll" value="showAll" />
    <Dropdown :options=waypoints v-model="selWpt"/>
    <Dropdown :options=bibsOptions v-model="bibsVal"/>
    <Dropdown :options=sortOptions v-model="sortVal"/>
  </div>
  <InputText v-model="bibSearch"/>
  <Paginator v-model:first="first" v-model:rows="rows" :totalRecords="entries.length" template="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
    currentPageReportTemplate="{first}-{last} of {totalRecords}" />
  <table class="w-full">
    <tr>
      <th v-for="h in ['TS','Time','Bib','WP','U','%']">{{h}}</th>
    </tr>
    <tr v-for="i in range(first,rows)">
      <template v-if="entries[i]">
        <td>
          {{i+1}}
          <i @click="toggleDialog(i)" class="pi pi-pencil" :class="entries[i].status"/>
        </td>
        <td>
          {{formatDate(entries[i].timestamp)}}
          <i>{{period(entries[i].timestamp)}}</i> 
        </td>
        <td><b :class="{'line-through text-blue-500' : entries[i].status!='valid'}">{{entries[i].bib}}</b> 
        <small>{{abbr(entries[i].name,14)}}</small>
        <!-- <b>{{entries[i].score}}</b> -->
        </td>
        <td>
        {{entries[i].waypoint}}
        <u>{{abbr(entries[i].userId)}}</u>
          </td>
        <td class="image w-20%">
            <Image v-if="entries[i].imagePath" preview :src="GS_PREFIX+entries[i].imagePath.replace('processed','thumbs')"/>
            <span v-else>{{entries[i].type}}</span>

            <div class="flex ">
            </div>
        </td>
      </template>
    </tr>
    
  </table>
    
  <Dialog v-model:visible="visible" modal header="Please review carefully" >

    <div >
      <div v-if="entries[entryToEdit].imagePath">
        <Image :src="GS_PREFIX+entries[entryToEdit].imagePath"/>
      </div>
      <tr v-if="race">
        <td>{{race.status}}</td>
        <td>{{race.timestamp ? `${new Date(race.timestamp.start).toLocaleTimeString()} "${race.timestamp.start}"`  : ''}}</td>
      </tr>
      <tr v-for="(v,k) in {userId:'User',
                           id:'Id',
                           score:'Score'}" @dblclick="klick">
        <td>{{v}}</td>
        <td>{{entries[entryToEdit][k]}}</td>
      </tr>
      <tr v-for="(v,k) in {bib:'Bib',
                           status:'Status [valid or invalid]',
                           waypoint:'Waypoint',
                           type:'Type'}">
        <td>{{v}}</td>
        <td><InputText stype="k=='timestamp'?'datetime-local':'text'" v-model="entries[entryToEdit][k]"/></td>
      </tr>
      <tr>
        <td>Timestamp</td><td><InputText nontype="datetime-local" v-model="entries[entryToEdit].timestamp"/>
              {{formatDate(entries[entryToEdit].timestamp)}}</td>
      </tr>
      <!-- {{period(entries[entryToEdit].timestamp))}} -->
    </div>
    
    <template #footer>
        <Button v-if="entries[entryToEdit].status=='valid'" label="Invalidate" 
          @click="setStatus(entries[entryToEdit].id,'invalid')" text />    
        <Button v-else label="Validate" 
          @click="setStatus(entries[entryToEdit].id,'valid')" text />    
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
const race = props.race;
const GS_PREFIX='https://storage.googleapis.com/run-pix.appspot.com/'
const NOMATCH='N/A'
const store = useStore()
const races = store.state.datastore.races;
// const raceStart = new Date(props.race.timestamp.start)

let entries=computed(()=> {
  let ret=JSON.parse(JSON.stringify(allEntries.value))
  const bibRegExp = race.bibPattern ? RegExp(race.bibPattern) : false

  if (selWpt.value && (selWpt.value!='All') ){
     ret = ret.filter(x=>x.waypoint==selWpt.value)
  } else{
    ret = ret
  }
  // show All or only valid
  if (showAll.value=='Valid'){  
    ret=ret.filter(x=>x.status=='valid')
  } if (showAll.value=='Invalid'){  
    ret=ret.filter(x=>x.status!='valid')
  }
  console.log(ret.length)
  // name or pattern matched
  const matchBib=(x)=> {const patMatch= (x.bib.match(bibRegExp))
                      // console.warn(`${x.bib}:${patMatch?1:0}||${x.name}>>${patMatch || (x.name!=NOMATCH)}`)
                      return patMatch || (x.name!=NOMATCH)} 

  if (bibsVal.value=='Matched'){
     ret = ret.filter(matchBib)
  } else if (bibsVal.value=='N/A'){
    ret = ret.filter(x=>!matchBib(x) )
  }
  // sort  
  if (sortVal.value=="Asc"){
    ret = ret.sort((a,b)=>a.timestamp>b.timestamp)
  } else {
    ret = ret.sort((a,b)=>a.timestamp<b.timestamp)
  }
  // search text debugger
  if (bibSearch.value) ret = ret.filter(x=>x.bib.includes(bibSearch.value))

  return ret
 })

let allEntries=ref([])
const bibsOptions = ['Matched','All',NOMATCH] //matched
const bibsVal = ref('All') //matched
const showAll=ref('Valid')
const showAllOptions=['All','Valid','Invalid']
const sortOptions = ['Desc','Asc']
const sortVal = ref('Desc')
const bibSearch = ref('')
const waypoints=ref(['All']) // availably waypoints
const selWpt=ref('All') // selected waypoints (for display)
let bibs=[]
let raceDoc=doc(db, "races", props.raceId); //

const startTime=computed(()=>{
  try{return new Date(props.race.timestamp.start)}
  catch(e) {return ''}
  })

const unsubscribe_bibs = onSnapshot(query(
                            collection(raceDoc, "bibs"),), 
                            (querySnapshot) => {
  bibs=[]
  querySnapshot.forEach(x=>bibs.push(x.data()));

});



const unsubscribe = onSnapshot(query(collection(raceDoc, "readings"),
                orderBy('timestamp','desc')), // query 
                (querySnapshot) => {
  allEntries.value=[]
  querySnapshot.forEach(mapReading);
  // console.log("Array", entries.value);
});


function mapReading(doc){
  let re=RegExp(props.bibRegex ? `^${props.bibRegex}$` : '^\\d{3,5}$')
  let data = doc.data()
  data.id=doc.id 
  data.name=NOMATCH

  
  if (!data.hasOwnProperty('bib') || doc.id.includes("START")){
    // console.log('nonBib/START',data)
  }else if (data.bib.search(re)!=-1) { // matching bib pattern
    data.status= data.status || 'valid'
    if(data.hasOwnProperty('timestamp')){
      // console.warn(data.timestamp)
      data.timestamp=getDateZ(data.timestamp)
    }
    data.userId= data.userId || 'Unknown'
    for (let bib_found of bibs.filter(x=>x.Bib==data.bib)){
      data.name = bib_found.Name//.Bib
      // debugger
    }    
  } else {
    data.status= 'incorrect bib'
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

const setStatus=(id,val) =>{
  const e = allEntries.value.filter(x=>x.id==id)
  try{
    e[0].status=val
  } catch (e) {console.error(e)}
}
// function setStatus(x,i){
//   console.debug(x,entries.value[i].id)
//   return updateDoc(
//       doc(db,`races/${props.raceId}/readings/${entries.value[i].id}`),
//       {status:x}
//       )  
// }


function submitChange(){
  let re=RegExp(props.bibRegex ? `^${props.bibRegex}$` : '^\\d{3,5}$')
  
  if(entries.value[entryToEdit.value].bib.search(re)>=0){
    let payload=JSON.parse(JSON.stringify(entries.value[entryToEdit.value]))
    let path=`races/${props.raceId}/readings/${payload.id}`
    delete payload.id
    // debugger
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
.valid {
  color: green;
}
div#selections ::v-deep(span) {
  padding: 1px;
  color: blue;
}
.p-paginator {
  padding: 0px;
}
</style>
