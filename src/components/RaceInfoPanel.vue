<template>

  <form>
    <template v-for="(label,key) in labels" >
      <tr class="p-inputgroup w-full" v-if="!'Waypoints id'.includes(key)">
        <td class="p-inputgroup-addon w-[30%]">
            {{(typeof label=="string") ? label : label.label}}
        </td>
        <td class="p-inputgroup-addon ">
          <InputText v-if='typeof label=="string"' :disabled="!editable" 
              v-model="race[key]" autofocus />
          <InputMask v-else :disabled="!editable"  
              v-model="race[key]" v-bind:mask="label.mask" :placeholder="label.placeholder" />
        </td>
      </tr>
    </template>
    <tr>
      <td>
        Distances
      </td>
      <td>
        <InputText :disabled="!editable" separator=","
          v-model="raceArr.Distances" aria-labelledby="multiple" />
      </td>
    </tr>
    <tr>
      <td>
        Waypoints
      </td>
      <td>
        <InputText :disabled="!editable" 
          v-model="raceArr.Waypoints" aria-labelledby="multiple" />
      </td>
    </tr>
    
    <SelectButton :disabled="!editable" class="status-button"
      v-model="race.status"  :options="raceStatusOptions"
      multiple aria-labelledby="multiple" />

    <div v-for="(v,k) in race.timestamp">
      {{k}} : {{v}}
    </div>
    
    <Inplace :disabled="!editable">
        <template #display>
            <span class="pi pi-search" style="vertical-align: middle"></span>
            <span style="margin-left: 0.5rem; vertical-align: middle">View Watermark</span>
        </template>
        <template #content>
            <img class="w-full" alt="Watermark" :src="`https://storage.googleapis.com/run-pix.appspot.com/ref/watermark/${raceId}.png`" />
        </template>
    </Inplace>
    
    <ToggleButton v-model="editable" onLabel="Review" offLabel="Edit"
    onIcon="pi pi-edit" offIcon="pi pi-no" class="w-9rem" />
    <Button :disabled="!editable" @click="saveChanges">Save Changes</Button>
    <Button :disabled="!editable" @click="flagOff">Flag Off</Button>
    
  </form>
  <div>
    TODO:  racelogo, raceorg, racelink:{racelink,raceorg,reg,result,pic}
  </div>
</template>

<script setup>
import InputMask from 'primevue/inputmask';
import SelectButton from 'primevue/selectbutton';
import Inplace from 'primevue/inplace';
import InputText from 'primevue/inputtext';
import Chips from 'primevue/chips'
import ToggleButton from 'primevue/togglebutton';
import Dropdown from 'primevue/dropdown';
import { useStore } from 'vuex';
import { computed, defineProps ,ref, reactive } from 'vue';
import { useRoute } from 'vue-router';
import { doc, getDoc ,updateDoc, setDoc } from 'firebase/firestore'
import {db} from '../../firebase/config'

let js=(x)=>JSON.parse(JSON.stringify(x))
let getArr=(x,sep=',')=> (x && typeof x ==  "string" )? x.split(sep): x 
let joinArr=(x,sep=",")=>{//console.debug(x);
      let ret = (x && x instanceof Array) ? x.filter((v, i, arr) => arr.indexOf(v) === i)
        .map(x=>typeof x ==  "string"?x.toUpperCase():String(x).toUpperCase()).join(sep) : x
      return ret
    }

const props =  defineProps({
  race: Object,
  waypoint: String
})
const route = useRoute();  
const raceId = route.params.raceId

const store = useStore()
store.dispatch('getRacesAction')

let race=computed(()=>{
  let racefilt=store.state.datastore.races.filter(r=>r.id==raceId);
  if(racefilt.length) {
    Object.keys(arrayLabels).forEach((k)=>{if(k in racefilt[0]) raceArr.value[k]=joinArr(racefilt[0][k])})
    return racefilt[0]
  } else return {name:'-',Waypoints:['VENUE']}
  });

const labels={
  id:'Id',
  Name: 'Name',
  Location: 'Location',
  Date : {label:'Date',mask:'9999-99-99',placeholder:'YYYY-MM-DD'},
  linkRace: 'Race link',
  linkReg: 'Registration link',
  raceOrg: 'Event Organizer',
  linkOrg: 'Organizer link',
  linkResults: 'Results link',
  linkPhotos: 'Photos link',
}
const arrayLabels={
  'Waypoints':'Waypoints',
  'Distances':'Distances'
}

const editable=ref(false)
const raceArr=ref({})
const raceStatusOptions = ref([
                 'planned', 'started' ,'stopped' , 
                 'provisional' , 'final' ,'nolist' 
            ]);



let flagOff=(e,a)=>{
  const now=new Date().toISOString()
  
  if (!race.value.timestamp)
    race.value.timestamp={}
  
  race.value.timestamp['start']=now
      
  let ts=JSON.parse(JSON.stringify(race.value.timestamp))
  
  updateDoc(doc(db,`races/${raceId}`),{'timestamp':ts})
  setDoc(doc(db,
    'races',raceId,'readings',`${now}_START_${props.waypoint}`),
    {
      timestamp: now,
      userId: store.state.auth.userDetails.userData.email
    }
  );
  console.debug(ts)
  editable.value=false;
}

let saveChanges=(e)=>{
  const now=new Date().toISOString()
  let UpdValues=JSON.parse(JSON.stringify(race.value))
  
  if (!race.value.timestamp)  UpdValues['timestamp']={'create': now}
  UpdValues['timestamp']['modify']= now
  
  for (let arrayValue of Object.keys(arrayLabels)) {
    UpdValues[arrayValue]=getArr(raceArr.value[arrayValue])
  }
  if(!UpdValues.Waypoints) UpdValues.Waypoints=['VENUE','END']
  if(!UpdValues.Distances) UpdValues.Distances=['5K','10K']

  // console.debug(`races/${raceId}`,JSON.stringify(UpdValues))
  updateDoc(doc(db,`races/${raceId}`),UpdValues)

  editable.value=false;
}

let klick=() => { 
  // console.debug(value.value.map(x=>x.value).join('/'))
  debugger;
}

</script>

<style scoped>

.p-button-label{
  margin: 0;
  color: red;
}
</style>