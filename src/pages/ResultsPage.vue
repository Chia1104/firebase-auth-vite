
<template>
  <div class="container mx-auto py-4">
    <h1 @dblclick="klick()" class="text-lg">Results </h1>

    <div class="p-inputgroup">
      <Dropdown v-model="year" :options="years" class="w-4/12 " />
      <Dropdown v-model="raceId" :options="races" optionLabel="Name" optionValue="id" @change="loadRace"
        placeholder="Select a race" class="w-full" />
    </div>

    <div class="card flex justify-content-center w-full mt-2">
      <Button @click="bibSelection = ''; entries = [];"><i class="pi pi-times w-6 "></i></Button>

      <AutoComplete v-model="bibSelection" showClear :suggestions="items" @complete="searchBib"
        :dropdown-click="searchBib" class="w-full " inputClass="px-2 mx-2" />
      <Button name="searchResults" @click="searchResults" icon="pi pi-search" raised></Button>
    </div>
  </div>

  <div v-if="bibSelection && ('Name' in bibData) && raceId" class="container text-xl mx-auto mt-30 center">
    <!-- <small>{{ message }}</small> -->
    <Card>
      <!-- <template #header>
          <img alt="user header" src="/images/finisher.png" />
      </template> -->
      <template #title>
        <span class="text-center w-full">{{ getFinishStatus() }}</span>
      </template>
      <template #subtitle>
        <span class="text-center w-full text-2xl">{{ race.Name }} </span>
      </template>
      <template #content>
        <table>
          <tr>
            <td colspan="2" class="text-center"><i class="pi pi-star" style="font-size: 2rem"></i></td>
          </tr>
          <tr>
            <td class="w-1/3">Bib</td>
            <td class="w-2/3">{{ bibData.Bib }}</td>
          </tr>
          <tr>
            <td>Name</td>
            <td>{{ bibData.Name }}</td>
          </tr>
          <tr>
            <td>Gender</td>
            <td>{{ bibData['Gender'] }}</td>
          </tr>
          <tr>
            <td>Race</td>
            <td>{{ bibData.Race }}</td>
          </tr>
          <tr>
            <td>Start</td>
            <td>{{ bibData['Start Time'] }}</td>
          </tr>
          <tr>
            <td>Finish</td>
            <td>{{ bibData['Finish Time'] }}</td>
          </tr>
          <tr>
            <td>Net Time</td>
            <td>{{ bibData['Race Time'] }}</td>
          </tr>
          <tr>
            <td>Category</td>
            <td>{{ bibData.Category }}</td>
          </tr>
          <tr>
            <td>Rank</td>
            <td>{{ bibData.Rank }}</td>
          </tr>
        </table>
      </template>
    </Card>
  </div>
  <div v-if="!bibSelection" class="container mx-auto">
    <Card >
      <template #subtitle>
        <div class="flex w-full justify-end">
          <a v-if="race.linkPhotos && ['available'].includes(race.photoStatus)" 
              :href="race.linkPhotos" class="p-button font-bold text-white">
              Photos
          </a>
          <a v-if="race.linkFeedback" :href="race.linkFeedback" class="p-button font-bold  text-white">
            Feedback
          </a>
        </div>
        <hr/>
        <div class="w-full mx-auto">
          <div class="text-2xl text-center">{{race.Name}}</div>
          <div class="text-xl text-center">{{race.Date}}</div>
          <div class="text-lg text-center">{{race.Location}}</div>
        </div>
      </template>

      <template #content>
        <div v-for="catTop, cat in raceInfo.top">
          <h2 class="text-2xl bg-blue-100 shadow-lg px-2 ">{{ cat }}</h2>
          <table class="table-auto w-full">
            <tr v-for="r, category in catTop" @click="setBib(r.Bib)" 
              class="px-2 ">

              <td v-for="f in ['Rank', 'Bib', 'Name', 'Race Time']" :class="f+'border shadow-md p-1 text-sm'">
                {{ r[f] }}
              </td>
            </tr>
          </table>
        </div>
      </template>
    </Card>
  </div>

  <!-- {{races.map(x=>x.status)}} -->
</template>

<script setup>
import { useStore } from 'vuex';
import Dropdown from 'primevue/dropdown';
import AutoComplete from 'primevue/autocomplete';
import Card from 'primevue/card';
import { collection, getDocs, doc, query, where, limit, onSnapshot } from "firebase/firestore"; //ref as dbRef,
import { db } from "../../firebase/config"
import { useRoute } from 'vue-router';
import { computed, ref } from 'vue';
import _ from "lodash"

const route = useRoute();
const params = route.params;
const store = useStore()
store.dispatch('getRacesAction')

const races = computed(() => store.state.datastore.races
  .filter(x => new Date(x.Date).getFullYear() == year.value)
  .filter(x => checkResStatus(x))
)
let race = computed(() =>
  (races.value.length && raceId.value) ?
    races.value.filter(x => x.id == raceId.value)[0] : { Name: '' })


let raceId = ref(params.raceId)
let bib = ref(params.bib)

if (params.raceId)
  loadRaceId(params.raceId)

const bibSelection = ref("");
const items = ref([]);
const entries = ref([])
const message = ref("")
let filteredBibObjects = ref([])

let bibData = computed(() => {
  let filt = filteredBibObjects.value.filter(x => x.Bib == bibSelection.value.split(' ')[0])
  return filt.length ? filt[0] : {}
})


const year = ref(new Date().getUTCFullYear())
let years = Array(year.value - (year.value - 6)).fill('').map((v, idx) => year.value - idx);

/////////////////////////////
const searchBib = async (event) => {
  // exit if raceId is not selected
  if (!raceId.value) return;
  console.log(raceId.value)
  // debugger
  var raceBibsCol = collection(db, "races", raceId.value, "result");
  entries.value = []
  let n = 10,
    _items = [];
  console.warn(`Search bib ${event.query}`)
  let searchField = isNaN(event.query) ?
    'Name' : 'Bib';
  let qryString = isNaN(event.query) ?
    event.query.toUpperCase() : event.query;
  let querySnapshot = await getDocs(
    query(raceBibsCol,
      where(searchField, ">=", qryString),
      where(searchField, "<=", qryString + '\uf8ff'),
      limit(n))
  );

  querySnapshot.forEach((doc) => {
    let data = doc.data()
    _items.push(data);
  });

  // map values to list and database
  if (_items.length) {
    filteredBibObjects.value = _items;
    items.value = _items.map(data => [
      data.Bib,
      // data.Race,
      data.Name
    ].join(' - '));
  } else {
    items.value = [event.query.split(" ")[0]]
  }
  message.value = "..."
  console.warn(_items)
}


const searchResults = async () => {
  let bibNo = bibSelection.value.split(" ")[0]

  if (!raceId.value) {
    message.value = `Select race `
    return []
  }
  console.log(`searching for ${bibNo}`)
  return await searchResultsForBib(bibNo)
}

async function searchResultsForBib(bibNo) {
  let containsOperator = '==',//"array-contains",
    _items = [];

  if (bibNo.toUpperCase() == 'MISSING') {
    bibNo = []
    containsOperator = '=='
  }

  message.value = `Searching results for ${bibSelection.value} `

  var resultsCol = collection(db, "races", raceId.value, "result"); //  

  let querySnapshot = await getDocs(
    query(resultsCol,
      where('Bib', containsOperator, bibNo),
    ));
  if (querySnapshot.docs.length) {
    for (let i = 0; i < querySnapshot.docs.length; i++) {
      let data = querySnapshot.docs[i].data()

      if (!(data.status && data.status == "hidden"))
        _items.push(data);
    };
    filteredBibObjects.value = _items
    entries.value = _items;
    message.value = `Found  `
    return _items
  }
  message.value = `Not found`
}

const raceInfo = ref({})

let loadRace = (e) => {
  let raceId = e.value;
  if (raceId) {
    // debugger
    loadRaceId(raceId)
  }
}
const setBib = async (bibNo) => {
  bibSelection.value = bibNo
  // debugger
  // await searchBib()
  await searchResults()
}
const getFinishStatus = () => !isNaN(bibData.value.Rank) ? 'FINISHER' : 'FINISH STATUS'

let klick = () => {
  debugger;
}

const checkResStatus = (race) => {
  ;
  if (race.status)
    return (race.status.includes('final') || race.status.includes('provisional'))
}

async function loadRaceId(raceId) {
  var resultsCol = collection(db, "races", raceId, "result"); //  
  return await getDocs(
    query(resultsCol, where('Rank', '<=', 5),))
    .then(querySnapshot => {
      let data = querySnapshot.docs.map(doc => {
        let dat = doc.data()
        if (!'valid'.includes(dat.Status)) {
          ["Start Time", "Race Time", "Finish Time"].forEach(x => dat[x] = '')
        }
        return dat;
      });
      raceInfo.value.top = _.chain(data)
        .groupBy("Category")
        .pickBy((x, k) => { console.log(k); return !k.includes('Other') })
        .value()
    })
}

</script>

<style scoped>table tr td:first {
  font-variant: small-caps;
}

td.Rank {
  font-weight: bold;
}</style>