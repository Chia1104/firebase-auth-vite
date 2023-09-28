<script setup>
import { useStore } from 'vuex';
import { useRouter, useLink } from 'vue-router'
import Card from 'primevue/card' ;
import { computed,ref } from 'vue';
import {getDateTime} from '../helpers';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputSwitch from 'primevue/inputswitch';
import {db} from '../../firebase/config'
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import InputText from 'primevue/inputtext';
import { doc, getDoc ,updateDoc, setDoc } from 'firebase/firestore'

const store = useStore()
const router = useRouter()

const newRaceId=ref('newrace23month')
const races = computed(() => {let arr = store.state.datastore.races
                              if (arr instanceof Object) 
                                arr=arr.sort((a,b)=>a.Date<b.Date)
                                if (nolist.value ){
                                  return arr
                                } else {
                                  return arr.filter(x=>!(x.status && x.status.includes('nolist')))
                                }
                              })

store.dispatch('getRacesAction')

function createNewRace(){
  // debugger;
  if(newRaceId.value){
    let newRace=newRaceId.value.trim()
    getDoc(doc(db,'races/mychoice23sep'))
      .then(snap=>{
        let data=snap.data();
        data.id = newRace;
        data.photoStatus="available"
        data.status=[]
        setDoc(doc(db,`races/${newRace}`),data)
          .then(x=>
            console.log(`Created race ${newRace}`)
          )
      }) 
  }
}

let fsdb={races:[]}

let nolist=ref(false)

let js=(x)=>JSON.parse(JSON.stringify(x))

let klick=() => { 
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
      <div id="header flex">
        <h1 @dblclick="klick" class="text-xl text-center">Races</h1> 
      </div>

      <Card v-for="r in races" style="border: 1em" class="mx-auto">
        <template #header>
            <!-- <img alt="" src="/images/usercard.png" /> -->
            {{ r.id }}
        </template>
        <template #title> {{r.Name}} </template>
        <template #subtitle> {{r.Date}} </template>
        <template #content>
            <ul>
                <li>Location: {{ r.Location }}</li>
            </ul>
        </template>
        <template #footer>
          <div class="w-full flex gap-3 mx-auto">
            <Button type="button" label="Edit" icon="pi pi-pencil" raised
              @click="router.push(`/e/${r.id}`)" ></Button>
            <Button type="button" @click="router.push(`/e/${r.id}`)" icon="pi pi-times"
              label="Record"></Button>
            <Button type="button" @click="router.push(`/e/${r.id}/i`)" icon="pi pi-check" 
              label="Images"></Button>

          </div>
        </template>
    </Card>
  </div>

    <TabView>
      <TabPanel header="Process">
          <InputSwitch v-model="nolist"/> 
          <p>
            Mark old races as "nolist"
          </p>
      </TabPanel>
      <TabPanel header="Create">
          <p>
            <div class="flex flex-column gap-2">
                <label for="newRaceId">Race Id</label>
                <InputText id="newRaceId" v-model="newRaceId" aria-describedby="raceId-help" />
                <Button type="button" @click="createNewRace"
                  label="Create"></Button>
            </div>
            <small id="username-help">Enter your id for the Race.  Only a-z0-9. All lowercase. No space </small>
                
          </p>
      </TabPanel>
      <TabPanel header="Record">
          <p>
            <ol>
              <li>Edit the information of the race</li>
              <li>Start the race</li>
              <li>Record the timing</li>
              <li>Close the races</li>
              <li>Finalize the results</li>
              <li>Upload Photos</li>
              <li>Publish the Photos link</li>
            </ol>   
            
          </p>
      </TabPanel>
  </TabView>


  </div>
</template>