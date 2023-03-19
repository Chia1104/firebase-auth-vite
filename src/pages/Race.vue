<template>
  <div class="container mx-auto">
    <div class="w-full text-center justify-center flex-col">
        <div>
          <Card>
            <template #title > 
              Race id {{raceId}}             
            </template>
            <template #content>
              <template v-for="(value, key) in race" >
                <tr class="p-inputgroup w-full" v-if="!'Waypoints id'.includes(key)">
                  <td class="p-inputgroup-addon ">
                      {{key}}
                  </td>
                  <td class="p-inputgroup-addon ">
                    {{ value }}
                  </td>
                </tr>
              </template>
              <tr>
                <td class="p-inputgroup-addon w-sm" @click="klick">
                    Waypoint
                </td>
                <td>
                  <Dropdown v-model="waypoint" :options="race.Waypoints" editable 
                      placeholder="Select a Waypoint" class="md:w-14rem" />   
                  <!-- {{ Waypoints }} -->
                  </td>
              </tr>
            </template>
          </Card>
        </div>

        <hr/>
        <Card>
          <!-- <template #title>
            Record
          </template> -->
          <template #content>
            <TabView>
              <TabPanel header="Log">
                <RaceLog :waypoint="waypoint" :raceId="raceId"/>
              </TabPanel>

              <TabPanel header="Images">
                <RaceImages :waypoint="waypoint" 
                            :bibRegex="race.bibPattern" :raceId="raceId"/>
              </TabPanel>

              <TabPanel header="Record">
                <camera :waypoint="waypoint" :raceId="raceId"/>
                <geo-loc/>
              </TabPanel>

              <TabPanel header="Upload">
                <Upload :waypoint="waypoint" :raceId="raceId"/>
              </TabPanel>
            </TabView>
          </template>

          <template #footer>
            <router-link to="/races">
              <Button name="races" >Races</Button>
            </router-link>
            <Button name="create" @click="klick">Check</Button>
          </template>
                    
        </Card>       
      
    </div>
  </div>
</template>

<script setup>
import { useStore } from 'vuex';
// import Camera from "../components/Camera.vue";
import Camera from "../components/Webrtc.vue";
import GeoLoc from "../components/GeoLoc.vue";
import Upload from "../components/Upload.vue";
import RaceLog from "../components/RaceLogCard.vue";
import RaceImages from "../components/RaceImagesCard.vue";
import Card from 'primevue/card';

import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import { computed, ref, reactive } from 'vue';
import { useRoute } from 'vue-router';

const bibRegexDefault = /^\d{3,5}$/;

const route = useRoute();  
const raceId = route.params.raceId

const store = useStore()
store.dispatch('getRacesAction')

let race=computed(()=>{
  let racefilt=store.state.datastore.races.filter(r=>r.id==raceId);
  if(racefilt.length) return racefilt[0]
  else return {name:'-',Waypoints:['venue']}
  });


let bibRegex=computed(()=>{
  console.warn(race.bibPattern)
  if (race.bibPattern){ 
    let bibPattern=race.bibRegex  ;
    if (bibPattern.slice(-1)!='$') bibPattern=bibRegex+'$';
    if (bibPattern.substring(0,1)!='^') bibPattern='^'+bibRegex;
    return RegExp(bibPattern) 
  } else  
    return  bibRegexDefault; 
  } );


let waypoint=ref("venue")
console.log({"bibRegex":bibRegex,"race":race,raceId:raceId})

let js=(x)=>JSON.parse(JSON.stringify(x))

let klick=() => { 
  debugger;
}

import { useToast } from "primevue/usetoast";
const toast = useToast();

toast.add({ severity: "info", summary: "Success", detail: "File Uploaded", life: 3000 });

</script>

