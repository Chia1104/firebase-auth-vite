<template>
  <div class="card p-fluid">

    <!-- <DataTable :value="allEntries" editMode="cell" @cell-edit-complete="onCellEditComplete" tableClass="editable-cells-table" tableStyle="min-width: 50rem">
        <Column v-for="col of columns" :key="col.field" :field="col.field" :header="col.header" >
            <template #body="{ data, field }">
                {{ data[field] }}
            </template>
            <template #editor="{ data, field }">
                <template v-if="field !== 'price'">
                    <InputText v-model="data[field]" autofocus />
                </template>
            </template>
        </Column>
    </DataTable> -->
    <InputText v-model="bibSearch"/>
    <Paginator v-model:first="first" v-model:rows="rows" :totalRecords="filtBibs.length" 
      template="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
      currentPageReportTemplate="{first}-{last} of {totalRecords}" />
    <table class="w-full">
      <tr>
        <th v-for="col in columns">{{col.header}}</th>
      </tr>
      <tr v-for="i in range(first,rows)">
        <template v-if="filtBibs[i]">
          <td v-for="col in columns">{{filtBibs[i][col.field]}}</td>
        </template>
      </tr>
    </table>
  </div>
  <Button @click="klick">popup</Button>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useStore } from 'vuex';

import Paginator from 'primevue/paginator';
import Image from 'primevue/image';

// import DataTable from 'primevue/datatable';
// import Column from 'primevue/column';
// import ColumnGroup from 'primevue/columngroup';   // optional
// import Row from 'primevue/row';                   // optional

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
})

/**
 * ​​​​
    Bib: "3001"
    ​​​​​Gender: "Female"
    ​​​​​Name: "SHWETA SHAH"
    ​​​​​Race: "My Choice"
    ​​​​​RegiId: "9498181"
    ​​Status: "From sheet"
 */
 const columns = ref([
    { field: 'Bib', header: 'Bib' },
    { field: 'Name', header: 'Name' },
    { field: 'Gender', header: 'Gender' },
    { field: 'Status', header: 'Status' }
]);

debugger;
 /**
  * 
  */
const race = props.race;
const GS_PREFIX='https://storage.googleapis.com/run-pix.appspot.com/'
const NOMATCH='N/A'
const store = useStore()
const races = store.state.datastore.races;

const filtBibs = computed(()=>{
  // search text debugger
  if (bibSearch.value) 
    return bibs.value.filter(x=> x.Bib.includes(bibSearch.value) || 
                      x.Name.includes(bibSearch.value.toUpperCase()))
  else
    return bibs.value
})


// let allEntries=ref([])
const bibsOptions = ['Matched','All',NOMATCH] //matched
const bibsVal = ref('All') //matched
const showAll=ref('Valid')
const showAllOptions=['All','Valid','Invalid']
const sortOptions = ['Desc','Asc']
const sortVal = ref('Desc')
const bibSearch = ref('')
const waypoints=ref(['All']) // availably waypoints
const selWpt=ref('All') // selected waypoints (for display)
let bibs=ref([])
let raceDoc=doc(db, "races", props.raceId); //

const startTime=computed(()=>{
  try{return new Date(props.race.timestamp.start)}
  catch(e) {return ''}
  })

const unsubscribe_bibs = onSnapshot(query(
                            collection(raceDoc, "bibs"),), 
                            (querySnapshot) => {
//   debugger
  querySnapshot.forEach(x=>bibs.value.push(x.data()));

});


function klick(){
  debugger
}


// Paginator
const first = ref(0);
const rows = ref(10);


let range=(i,j)=> ([...Array(j).keys()]
                  .map(x=>x+i )
                  .filter(x=>x<=bibs.value.length)
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


/**
 *  Start list
 */
const startList=ref([])
function getstartList(){
  getDocData(`races/${raceId.value}/bibs`).then(data=>{
    startList=data
    debugger;
  }).catch(console.error)
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
