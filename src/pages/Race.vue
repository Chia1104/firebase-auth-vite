<script setup>
import { useStore } from 'vuex';
// import Camera from "../components/Camera.vue";
import Camera from "../components/Webrtc.vue";
import GeoLoc from "../components/GeoLoc.vue";
import Button from 'primevue/button';
// import { collection, getFirestore , getDocs  } from "firebase/firestore"; 
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();  
const params = route.params;

const store = useStore()

store.dispatch('getRacesAction')
const races = computed(() => store.state.datastore.races)
const race = computed(() => {
  for (let r of store.state.datastore.races) 
    if(r.id==route.params.raceId)
      return r
  })

let js=(x)=>JSON.parse(JSON.stringify(x))

let klick=() => { 

  console.log((races))
  debugger;
}

</script>

<template>
  <div class="container mx-auto">
    <div class="w-full text-center justify-center flex-col">
        <div>
        <h1>Races</h1>
        This is a race id {{params.raceId}}
        <tr v-for="(value, key) in race">
          <td>
              {{key}}
          </td>
          <td>
            {{ value }}
          </td>
        </tr>

        </div>

        <camera />
        <geo-loc/>
        <Button name="create" @click="klick">Create</Button>
        <!-- <HelloWorld/> -->
    </div>
  </div>
</template>