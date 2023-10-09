<template>

  <div class="container mx-auto">
    <div class="w-full text-center justify-center flex-col">
      <Card>
        <template #header class="flex w-full">
          <img class="w-full mx-auto object-cover "
                :src="getPublicUrl('processed',raceObj?.id,raceObj?.coverPage)"/>  
                {{ raceObj?.id }}  
        </template>
        <template #title >
          <h1>{{raceObj?.Name}}</h1>
        </template>
        <template #subtitle></template>
        <template #content>
          <table class="table-auto text-left w-full ">
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

            <tr>
              <td>Registration </td>
              <td>
                <a :href="raceObj?.linkReg" class="text-blue-600 visited:text-purple-600 hover:decoration-wavy">
                    {{raceObj?.linkReg}}</a> 
              </td>
            </tr>   

            <tr >
              <td v-if="raceObj?.photoStatus?.includes('avail')">
                  Photos available </td>
              <td v-else>
              Photos unavailable.  Please stay tuned</td>
              <td>
                  <a :href="raceObj?.linkPhotos" class="text-blue-600 visited:text-purple-600 hover:decoration-wavy">
                    {{raceObj?.linkPhotos}}</a> 
              </td>
              
            </tr> 

            <tr v-if="raceObj?.linkResults">
              <td>
                  Results
              </td>
              <td >
                  <a :href="raceObj?.linkResults" class="text-blue-600 visited:text-purple-600 ">
                    {{raceObj?.linkResults}}</a> 
              </td>
              
            </tr> 
            <!-- <li v-for='k,v in {"Registration":"linkReg"}'>
              <span >{{v}} : <a :href="raceObj[k]">{{raceObj[k]}}</a> 
              </span>
            </li> -->
          </table>
        </template>

        <template #footer>
          <Button name="races" label="Races" icon="pi pi-chevron-left" raised
              @click="router.push('/e')"></Button>
          <Button name="edit" label="Edit" raised icon="pi pi-pencil" class="" 
              @click="router.push(`/e/${raceObj.id}/e`)"></Button> 
          <Button name="images" label="Images" raised icon="pi pi-images" class="" 
              @click="router.push(`/e/${raceObj.id}/i`)"></Button> 
        </template>
                  
      </Card>
    </div>
  </div>
</template>

<script setup>

import { useStore } from 'vuex';
import { useRouter, useLink } from 'vue-router'
import { useRoute } from 'vue-router';
import Card from 'primevue/card';
// import SelectButton from 'primevue/selectbutton';
import { computed, ref, reactive } from 'vue';

import RaceAdmin from "./RaceAdmin.vue";
import { getPublicUrl} from "../api" 

let props = defineProps ({
  option: String
})

const bibRegexDefault = /^\d{3,5}$/;

const route = useRoute();  
const router = useRouter()
const store = useStore()
const raceId = route.params.raceId

store.dispatch('getRacesAction')
let waypoint=ref(store.state.datastore.race.waypoint)  //ref("venue")


const raceObj=store.state.datastore.racesObj[raceId]
// computed(()=>{
//   try{
//     return store.state.datastore.racesObj[raceId]
//   } catch (e) { 
//     return {name:'-',Waypoints:['VENUE']} //, error: e 
//   }
// });


let raceStatus=ref("")
let raceStatusOptions=['Started','Stopped']
const options = ref(['Record','Start List','Provisional','Final Results',
                'Upload'                
            ]); //'Info',,'Images'
const option = ref(props.option ?? 'Info');


console.log({"race":raceObj, raceId:raceId, props:props})

let js=(x)=>JSON.parse(JSON.stringify(x))

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
</style>