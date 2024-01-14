<template>
  <Card>
    <template #title> Bibs {{ raceId }} </template>
    <template #content>
      Start: {{ race?.timestamp?.start?.toLocaleString() }} -

      <div class="card p-fluid">
        <span class="text-xl">{{ racesObj[raceId]?.name }}</span>

        <div v-if="false" class="flex gap-2 justify-stretch">
                <Button
                  @click="readStartListDb()"
                  icon="pi pi-cloud-download"
                  label="Download"
                  rounded
                  outlined
                  severity="success"
                  _disabled="files?.length != 0 "
                ></Button>    
                <Button
                  @click="onSelectedFiles()"
                  icon="pi pi-table"
                  label="Select CSV"
                  rounded
                  outlined
                ></Button>
                <Button
                  @click="onTemplatedUpload()"
                  icon="pi pi-cloud-upload"
                  label="Upload"
                  rounded
                  outlined
                  severity="success"
                  :disabled="!downloaded && (!files || files.length === 0)"
                ></Button>
            
                <Button
                  @click="cancelFileUpload()"
                  icon="pi pi-times"
                  rounded
                  outlined
                  severity="danger"
                  :disabled="!downloaded && (!files || files.length === 0)"
                ></Button>
              </div>

        <FileUpload v-else
          name="demo[]"
          url="%VITE_API_URL_PREFIX%/api/startlist"
          accept=".csv"
          :maxFileSize="1000000"
          customUpload
          @uploader="onTemplatedUpload($event)"
          @select="onSelectedFiles"
          @clear="cancelFileUpload"
        >
          <template #header="{ chooseCallback, uploadCallback, clearCallback, files }">
            <div
              class="flex flex-wrap justify-content-between align-items-center flex-1 gap-2"
            >
              <div class="flex gap-2 justify-stretch">
                <Button
                  @click="readStartListDb()"
                  icon="pi pi-cloud-download"
                  label="Download"
                  rounded
                  outlined
                  severity="success"
                  _disabled="files?.length != 0 "
                ></Button>    
                <Button
                  @click="chooseCallback()"
                  icon="pi pi-table"
                  label="Select CSV"
                  rounded
                  outlined
                ></Button>
                <Button
                  @click="uploadEvent(uploadCallback)"
                  icon="pi pi-cloud-upload"
                  label="Upload"
                  rounded
                  outlined
                  severity="success"
                  :disabled="!downloaded && (!files || files.length === 0)"
                ></Button>
            
                <Button
                  @click="clearCallback()"
                  icon="pi pi-times"
                  rounded
                  outlined
                  severity="danger"
                  :disabled="!downloaded && (!files || files.length === 0)"
                ></Button>
              </div>
            </div>
          </template>

          <template
            #content="{
              files,
              uploadedFiles,
              removeUploadedFileCallback,
              removeFileCallback,
            }"
          >
            <ProgressBar :value="progressValue" class="text-dark">
              <!-- {{ progressValue }} / {{ allEntries.length }} -->
            </ProgressBar>

            <div v-if="files.length > 0">
              <h5>Pending</h5>
              <div class="flex flex-wrap p-0 sm:p-5 gap-5">
                <div
                  v-for="(file, index) of files"
                  :key="file.name + file.type + file.size"
                  class="card m-0 px-6 flex flex-column border-1 surface-border align-items-center gap-3"
                >
                  <span class="font-semibold">{{ file.name }}</span>
                  <div>{{ allEntries.length }} entries</div>
                  <Badge value="Pending" severity="warning" />
                </div>
              </div>
            </div>

            <div v-if="uploadedFiles.length > 0">
              <h5>Completed</h5>
              <div class="flex flex-wrap p-0 sm:p-5 gap-5">
                <div
                  v-for="(file, index) of uploadedFiles"
                  :key="file.name + file.type + file.size"
                  class="card m-0 px-6 flex flex-column border-1 surface-border align-items-center gap-3"
                >
                  <span class="font-semibold">{{ file.name }}</span>
                  <div>{{ allEntries.length }} entries</div>
                  <Badge value="Completed" class="mt-3" severity="success" />
                </div>
              </div>
            </div>
          </template>

          <template #empty>
            <div v-if="!downloaded" class="flex align-items-center justify-content-center flex-column">
              <!-- <i class="pi pi-cloud-upload border-2 border-circle p-5 text-8xl text-400 border-400" /> -->
              <p class="mt-4 mb-0">
                Please upload or drag a csv file columns BIB, NAME, GENDER, CATEGORY,
                DISTANCE, STATUS
              </p>
            </div>
          </template>
        </FileUpload>

        <DataTable
          :value="allEntries"
          editMode="row" 
          dataKey="Bib" 
          paginator
          paginatorPosition="both"
          :pageLinkSize="3"
          :rows="10"
          tableClass="editable-cells-table"
          tableStyle="min-width: 50rem"
          v-model:editingRows="editingRows"
          @row-edit-save="onRowEditSave"
          :pt="{
                table: { style: 'min-width: 50rem' },
                column: {
                    bodycell: ({ state }) => ({
                        style:  state['d_editing']&&'padding-top: 0.6rem; padding-bottom: 0.6rem'
                    })
                }
            }"
        >
          <template #empty> No particpants.</template>
          <Column
            v-for="col of columns"
            :key="col.field"
            :field="col.field"
            :header="col.header"
            sortable
          >
            <template #body="{ data, field }">
              {{ data[field] }}
            </template>
            <template #editor="{ data, field }">
              <template v-if="field !== 'price'">
                <InputText v-model="data[field]" autofocus />
              </template>
            </template>
          </Column>
          <Column :rowEditor="true" class="bg-blue-200"
          style="width: 10%; min-width: 8rem" bodyStyle="text-align:center"></Column>
        </DataTable>

        <InputText v-model="bibSearch" />

        <!-- <Paginator v-model:first="first" v-model:rows="rows" :totalRecords="filtBibs.length"
          template="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
          currentPageReportTemplate="{first}-{last} of {totalRecords}" />
        <table class="w-full">
          <tr>
            <th v-for="col in columns">{{ col.header }}</th>
          </tr>
          <tr v-for="i in range(first, rows)">
            <template v-if="filtBibs[i]">
              <td v-for="col in columns">{{ filtBibs[i][col.field] }}</td>
            </template>
          </tr>
        </table> -->
      </div>
    </template>
    <template #footer>
      <Button @click="router.back()" icon="pi pi-chevron-left"></Button>
      <Button @click="klick">popup</Button>
    </template>
  </Card>
</template>

<script setup>
import { computed, ref } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";

// import Paginator from "primevue/paginator";
// import Image from "primevue/image";
// import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import Card from "primevue/card";
import Badge from "primevue/badge"; // optional
import FileUpload from "primevue/fileupload";
import ProgressBar from "primevue/progressbar";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import { usePrimeVue } from "primevue/config"; // optional
import { db, storage } from "../../firebase/config"; //storage
import { CSVToArray } from "../helpers/index";
import { config } from "../config";
import _ from "lodash";
import {getAllDocs,setDocData} from '../api'

// import {
//   collection,
//   query,
//   doc,
//   limit,
//   orderBy,
//   onSnapshot,
//   getDocs,
//   updateDoc,
// } from "firebase/firestore";
import { useToast } from "primevue/usetoast";

const toast = useToast();
const route = useRoute();
const router = useRouter();
const store = useStore();
const racesObj = store.state.datastore.racesObj;
const raceId = route.params.raceId;
const race = racesObj[raceId];
const validHeaders = _.map(config.startListHeaders,x=>x.field);
const editingRows = ref([]);
const allEntries = ref([]);
// const totalSize = ref(0);
const progressValue=ref(0)
// const totalSizePercent = ref(0);
const files = ref([]);
const downloaded=ref(false)
const primevue = usePrimeVue();


const onClearTemplatingUpload = (clear) => {
  clear();
  // totalSize.value = 0;
  // totalSizePercent.value = 0;
};

const uploadEvent = (callback) => {
  // debugger;
  // totalSizePercent.value = totalSize.value / 10;

  callback();
  
};

const onTemplatedUpload = async () => {
  // debugger;
  console.log(allEntries.value)
  allEntries.value.forEach(async (x,i,arr)=>{
    const bibData=_.pick(x,validHeaders)
    {
      let ret =await setDocData(`/races/${raceId}/bibs/${bibData.Bib}`,bibData)
      progressValue.value=100*i/arr.length
      // debugger
      // console.log(`${i},${ret} : ${progressValue.value}`)
    }
  })
  cancelFileUpload() 

  toast.add({
    severity: "info",
    summary: "Success",
    detail: "File Uploaded",
    life: 3000,
  });
};

function readStartListDb(){
  
  getAllDocs(`/races/${raceId}/bibs`).then(d=>{
    allEntries.value=d;
    // debugger
  })
  downloaded.value=true
  progressValue.value=0
}

function cancelFileUpload(e) {
  // console.warn(e)
  files.value=[]
  allEntries.value = [];
  progressValue.value=0
  downloaded.value=false
}

async function onSelectedFiles(event) {
  // debugger
  console.warn(event);
  files.value = event.files;
  
  const file = event.files[0];
  // console.warn(files.value[0]);
  const reader = new FileReader();

  reader.onloadend = function () {
    let data = CSVToArray(reader.result);
    let headers = data.shift();
    // fix the case for headers
    headers=headers.map(x=> validHeaders.find( x1=> 
        x1.toUpperCase()==x.toUpperCase()) || x)

    allEntries.value = data
      .map((row) =>
        headers.reduce((obj, header, index) => {
          obj[header] = row[index];
          return obj;
        }, {})
      )
      .filter((x) => x?.Bib?.length > 0);

    // console.log(allEntries.value);
  };

  reader.readAsText(file);
}

const onRowEditSave = (event) => {
    let { newData, index } = event;

    allEntries.value[index] = newData;
};

/**
 * ​​​​
    Bib: "3001"
         Gender: "Female"
         Name: "SHWETA SHAH"
         Race: "My Choice"
         RegiId: "9498181"
      Status: "From sheet"
 */
const columns = ref(config.startListHeaders)
const NOMATCH = "N/A";

const filtBibs = computed(() => {
  // search text debugger
  if (bibSearch.value)
    return bibs.value.filter(
      (x) =>
        x?.Bib.includes(bibSearch.value) || x.Name.includes(bibSearch.value.toUpperCase())
    );
  else return bibs.value;
});

// let allEntries=ref([])
const bibsOptions = ["Matched", "All", NOMATCH]; //matched
const bibsVal = ref("All"); //matched
const showAll = ref("Valid");
const showAllOptions = ["All", "Valid", "Invalid"];
const sortOptions = ["Desc", "Asc"];
const sortVal = ref("Desc");
const bibSearch = ref("");
const waypoints = ref(["All"]); // availably waypoints
const selWpt = ref("All"); // selected waypoints (for display)
let bibs = ref([]);
// let raceDoc = doc(db, "races", raceId); //

// const unsubscribe_bibs = onSnapshot(
//   query(collection(raceDoc, "bibs")),
//   (querySnapshot) => {
//     //   debugger
//     querySnapshot.forEach((x) => bibs.value.push(x.data()));
//   }
// );

function klick() {
  debugger;
}

// Paginator
const first = ref(0);
const rows = ref(10);

let range = (i, j) =>
  [...Array(j).keys()].map((x) => x + i).filter((x) => x <= bibs.value.length);
let abbr = (x, len = 6) => String(x).substring(0, len);
let pad = (x, n = 2) => ("00" + x).slice(-n);
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

Button {
  margin-left: 2rem;
}
</style>
