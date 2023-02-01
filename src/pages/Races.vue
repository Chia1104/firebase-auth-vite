<script setup>
import { useStore } from 'vuex';
import TestComponent from "../components/TestComponent.vue";
import Button from 'primevue/button';
// import { collection, getFirestore , getDocs  } from "firebase/firestore"; 
import { computed } from 'vue';

const store = useStore()
const races = computed(() => store.state.datastore.races)

store.dispatch('getRacesAction')

import { db } from '../../firebase/config';
let fsdb={races:[]}

// let getRaces=(data)=> { 
//   const racesRef = collection(db, "races");
//   getDocs(racesRef).then(docSnap=> {
//     // console.log('getRaces()',docSnap)
//     data= docSnap.docs.map(x=>{
//       let o=x.data();
//       o['id']=x.id;
//       return o})
//     console.debug('getRaces()',data)
//   }).catch((error) => {
//       // doc.data() will be undefined in this case
//     console.debug("No such document!",error);
//   }) 
// }
let js=(x)=>JSON.parse(JSON.stringify(x))

let klick=() => { 
  store.dispatch('getRacesAction')  
  console.log(js(store.state.datastore))
  debugger;
}

// const races=getRaces(fsdb)
// debugger;
// console.log(fsdb)

function NOP() {}
// then in the optimised code
NOP(fsdb);
</script>

<template>
  <div class="container mx-auto">
    <div class="w-full text-center justify-center flex-col">
      <div>
        <h1>Races</h1>
        This is a list of races.
        <th v-for="(value, key) in races[0]">
          {{key}}
        </th>

        <tr v-for="r in races" 
            :key='r.id'>
          <td v-for="(value, key) in r">
            {{ value }}
          </td>
          <button class="px-4 py-1 text-sm bg-gray p-2 rounded"
      @click="$router.push(`race/${r.id}`)">Go</button>
        </tr>

        <Button name="create" @click="klick">Create</Button>
        <!-- <HelloWorld/> -->
      </div>
      <TestComponent msg="Hello Vue and Vite"/>
    </div>
  </div>
</template>