<template>

  <div class="container mx-auto">
    <div class="w-full text-center justify-center flex-col">
      <Card>
        <template #header >
          <div class="w-full">
            <img class="mx-auto max-h-80 shadow-lg"
                :src="getPublicUrl('processed',raceObj?.id,raceObj?.coverPage)"/>  
          </div>
        </template>
        <template #title >
          <h1>{{raceObj?.Name}}</h1>
        </template>
        <template #subtitle></template>
        <template #content>
          <table id="raceinfo" class="table-auto text-left w-full  ">
            <tr >
              <td>  Date:                 </td>
              <td> {{raceObj?.Date}}        </td>
            </tr>
            <tr>
              <td >Location  </td>
              <td> {{raceObj?.Location}}  </td>
            </tr>

            <tr>
              <td>Race Organizer </td>
              <td>{{raceObj?.raceOrg}} 
                <a v-if="raceObj?.linkOrg" :href="raceObj?.linkOrg" class="text-blue-600 visited:text-purple-600 hover:decoration-wavy">
                  {{raceObj?.linkOrg}}</a>
              </td>
            </tr>

            <tr  v-for="(lbl,fld) in links" >
            <!-- {{ lnk }} -->
              <td > {{ lbl }} 
                <span v-if="fld=='linkPhotos' && raceObj?.[fld] ">
                  <Tag v-if="raceObj?.photoStatus?.includes('avail')" value="Available"/>
                  <Tag v-else value="Unavailable"/>
                </span>
              </td>
              <td>
                <a :href="raceObj?.[fld]" class="text-blue-600 visited:text-purple-600 hover:decoration-wavy">
                    {{raceObj?.[fld]}} </a> 
              </td>
            </tr> 

          </table>
        </template>

        <template #footer>
          <Button name="races" label="Races" raised icon="pi pi-chevron-left" 
              @click="router.push('/e')"></Button>

          <a :href = "raceObj?.linkPhotos">
                <Button v-if="raceObj?.linkPhotos" name="photos" label="Photos" raised icon="pi pi-images" class="" >
                </Button> 
          </a>
          
          <SplitButton v-if="checkAccessEventRole(raceObj?.id)" :label="raceObj?.id"  
               :model="menuItems" raised/>
          <!-- @click="router.back()"-->
        </template>
                  
      </Card>
    </div>
  </div>
</template>

<script setup>

import { useStore } from 'vuex';
import { useRouter, useLink, useRoute } from 'vue-router'
import { computed, ref, reactive } from 'vue';
import Card from 'primevue/card';
import SplitButton from 'primevue/splitbutton';
// import SelectButton from 'primevue/selectbutton';
import { config } from '../config';
import Tag from 'primevue/tag'
import RaceAdmin from "./RaceAdmin.vue";
import { getPublicUrl,  getUser, checkAccessEventRole} from "../api" 
import _ from "lodash"

let props = defineProps ({
  option: String
})

const bibRegexDefault = /^\d{3,5}$/;
const links=ref(_.pickBy(config.raceInfoPanelLabels,(v,k)=>_.startsWith(k,'link')))
const route = useRoute();  
const router = useRouter()
const store = useStore()
const raceId = route.params.raceId

store.dispatch('getRacesAction')
let waypoint=ref(store.state.datastore.race.waypoint)  //ref("venue")

const raceObj= computed(()=>{
  try{
    return store.state.datastore.racesObj[raceId]
  } catch (e) { 
    return {name:'-',Waypoints:['VENUE']} //, error: e 
  }
});

const menuItems = [
    { label: 'Photos search', 
      icon: 'pi pi-images', 
      to: `/p` 
    },
    {
      label: 'Edit Race',
      icon: 'pi pi-pencil',
      command: () => { router.push(`/e/${raceObj.value?.id}/edit`)    ; }
    },
    { label: 'Start List', icon: 'pi pi-clock', 
      command: () => { router.push(`/e/${raceObj.value?.id}/bibs`)    ; }
    },
    { label: 'Provisional Timing', icon: 'pi pi-clock', 
      command: () => { router.push(`/e/${raceObj.value?.id}/log`)    ; }
    },
    { label: 'Upload Images', icon: 'pi pi-bolt', 
      command: () => { router.push(`/e/${raceObj.value?.id}/images`)    ; } 
    },
    {
      label: 'Organizer Website',
      icon: 'pi pi-external-link',
      command: () => {
          window.location.href = raceObj.value.linkOrg;
      }
    },
];

let raceStatus=ref("")
let raceStatusOptions=['Started','Stopped']
const options = ref(['Record','Start List','Provisional','Final Results',
            ]); //'Info',,'Images'
const option = ref(props.option ?? 'Info');


console.log({"race":raceObj, raceId:raceId, props:props,user:getUser()})

// let js=(x)=>JSON.parse(JSON.stringify(x))

let klick=() => { 
  debugger;
}

var jsonify=function(o){
    var seen=[];
    var jso=JSON.stringify(o, function(k,v){
        if (typeof v =='object') {
            if ( !seen.indexOf(v) ) { return '__cycle__'; }
            seen.push(v);
        } return v;
    });
    return jso;
};

let timer =ref({
  timerId:null,
  milliseconds:1000,
  now:'',
  time:'',
  duration:''
})
function startTimer() {
        // console.debug(this)
        timer.value.timerId = setInterval(getTime, timer.value.milliseconds); //setting the loop with time interval
}

</script>

<style scoped>

div.p-selectbutton ::v-deep(div) {
  padding: 2px;
}

table#raceinfo ::v-deep(td) {
  padding-top: .5em;
  border-top: thin lightgrey;
}

btn {
  @apply bg-blue-500 hover:bg-blue-400
}
</style>