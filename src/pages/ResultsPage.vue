<script setup>
import { useStore } from 'vuex';
import Dropdown from 'primevue/dropdown';
import AutoComplete from 'primevue/autocomplete';
import Card from 'primevue/card';
import { collection, getDocs,doc, query, where, limit, onSnapshot } from "firebase/firestore"; //ref as dbRef,
import { db } from "../../firebase/config" 
import { useRoute } from 'vue-router';
import { computed, ref } from 'vue';

const route = useRoute();  
const params = route.params;

const store = useStore()
const races =  computed(() => store.state.datastore.races
              .filter(x=>checkResStatus(x))
            )
let race=computed(()=>
      (races.value.length&&raceId.value)?
          races.value.filter(x=>x.id==raceId.value)[0] :{Name:''})            

const checkResStatus=(race)=>{;
  if (race.status)
    return (race.status.includes('final')||race.status.includes('provisional'))} 

let raceId = ref(params.raceId)
let bib = ref(params.bib)
const bibSelection = ref("");
const items = ref([]);
const entries = ref([])
const message = ref("")
let filteredBibObjects=ref([])
let bibData = computed(()=>{
  let filt=filteredBibObjects.value.filter(x=>x.Bib==bibSelection.value.split(' ')[0])
  return filt.length? filt[0] : {}})


store.dispatch('getRacesAction')


const year=ref(new Date().getUTCFullYear())
let years=Array(year.value - (year.value - 6)).fill('').map((v, idx) => year.value - idx);

/////////////////////////////
const searchBib = async (event) => {
  // exit if raceId is not selected
  if (!raceId.value) return;
  console.log(raceId.value)
  // debugger
  var raceBibsCol=collection(db, "races", raceId.value, "result" ); 
  entries.value=[]
  let n=10,
    _items = [];
  console.warn(event.query)
  let searchField=isNaN(event.query) ? 
               'Name' :'Bib' ;
  let qryString = isNaN(event.query) ? 
                event.query.toUpperCase() : event.query;
  let querySnapshot = await getDocs(
        query(raceBibsCol,
          where(searchField,">=",qryString),
          where(searchField,"<=",qryString+'\uf8ff'),
          limit(n))
        );

  querySnapshot.forEach((doc) => {
            let data = doc.data()
            _items.push(data);
  });

  // map values to list and database
  if(_items.length)    {
    filteredBibObjects.value=_items;
    items.value=_items.map(data=>[
      data.Bib,
      // data.Race,
      data.Name
      ].join(' - ')) ;
  }else{  
    items.value=[event.query.split(" ")[0]]
  }
  message.value="..."
}



const searchResults = async () => {
  let bibNo=bibSelection.value.split(" ")[0],
      containsOperator="array-contains",
    _items = [];
  if (!raceId.value){
    message.value=`Select race `
    return []
  } else if (bibNo.toUpperCase()=='MISSING'){
    bibNo=[]
    containsOperator='=='
  }
  message.value=`Searching results for ${bibSelection.value} `
  console.log(bibSelection.value)
  
  var resultsCol=collection(db, "races", raceId.value, "result" ); //  
  let querySnapshot = await getDocs(
        query(resultsCol,
          where('texts',containsOperator,bibNo),
          // limit(LIMIT_PICS)
        ));
  if(querySnapshot.docs.length){
    for (let i=0;i<querySnapshot.docs.length;i++) {
      let data = querySnapshot.docs[i].data()

      if (!(data.status && data.status=="hidden"))
        _items.push(data);
    };  

    entries.value=_items ;
  }
  message.value=`Found  `
  return _items
}

const getFinishStatus=()=>!isNaN(bibData.value.Rank)?'FINISHER':'FINISH STATUS'

let klick=() => { 
  
  debugger;
}

</script>

<template>
  <div class="container mx-auto">

    <h1 @dblclick="klick()" class="text-lg">Results </h1>
    <div class="p-inputgroup">
      <Dropdown v-model="year" :options="years" class="max-w-fit p-inputgroup-addon" />
      <Dropdown v-model="raceId" :options="races" optionLabel="Name" optionValue="id"
                        placeholder="Select a race" class="w-full" />   
    </div>
    <div class="card flex justify-content-center w-full">
      <Button @click="bibSelection='';entries=[];"><i class="pi pi-times"></i></Button>
              
      <AutoComplete v-model="bibSelection" showClear  :suggestions="items" @complete="searchBib" 
        :dropdown-click="searchBib" class="w-full" />
      <Button name="searchResults" @click="searchResults">Enter</Button>
    </div>
    <div v-if="('Name' in bibData) && raceId" class="text-xl mx-auto mt-30 center">
      <Card>                     
        <!-- <template #header>
            <img alt="user header" src="/images/finisher.png" />
        </template> -->
        <template #title> {{race.Name}} </template>
        <template #subtitle> {{getFinishStatus()}}  </template>
        <template #content>
          <table>
            <tr><td class="w-1/3">Bib</td><td class="w-2/3">{{bibData.Bib}}</td></tr>
            <tr><td>Name</td><td>{{bibData.Name}}</td></tr>
            <tr><td>Gender</td><td>{{bibData['Gender']}}</td></tr>
            <tr><td>Race</td><td>{{bibData.Race}}</td></tr>
            <tr><td>Start</td><td>{{bibData['Start Time']}}</td></tr>
            <tr><td>Finish</td><td>{{bibData['Finish Time']}}</td></tr>
            <tr><td>Net Time</td><td>{{bibData['Race Time']}}</td></tr>
            <tr><td>Category</td><td>{{bibData.Category}}</td></tr>
            <tr><td>Rank</td><td>{{bibData.Rank}}</td></tr>
          </table>
        </template>
      </Card>
    </div>

<!-- {{races.map(x=>x.status)}} -->
  </div>
</template>
<style scoped>
table tr td:first {
  font-variant: small-caps;
}
</style>