<script setup>
import { defineProps, computed, ref } from 'vue'
import { useToast } from "primevue/usetoast";
import { db, storage } from "../../firebase/config"
import { getStorage, ref as dbRef, uploadBytes } from "firebase/storage";
import {useStore} from "vuex";
import Button from 'primevue/button';
import Toast from 'primevue/toast';
import Dropdown from 'primevue/dropdown';
// import FileUpload from 'primevue/fileupload';
import { useRoute } from 'vue-router';

const UPLOADS_FOLDER = 'uploads';

const route = useRoute();  

const props = defineProps({
  raceId: String,
  waypoint: String,
})

const store = useStore()
const userData = store.state.auth.userDetails.userData 

const race = computed(() => {
  for (let r of store.state.datastore.races) 
    if(r.id==route.params.raceId)
      return r
  })

let fileList; // list of File objects
const files = ref([]);
const fileName = computed(() => file.value?.name);
const fileExtension = computed(() => fileName.value?.substr(fileName.value?.lastIndexOf(".") + 1));
const fileMimeType = computed(() => file.value?.type);

const uploadFile = (event) => {
    fileList=event.target.files
    let arr=[]
    for(let i=0;i<fileList.length;i++){
        let file_i = fileList[i]
        let fileObj={}
        for (let x of ['name','size','lastModified','type']){ 
            if (true || file_i.hasOwnProperty(x)){
                fileObj[x]=file_i[x];
            }
        };
        arr.push(fileObj)
    }

  files.value = arr;

};

const submitFile = async () => {

    // const storage = getStorage();

    for (let file of fileList){
        let timestamp = new Date(file.lastModified).toISOString()
        let uploadPath = `${UPLOADS_FOLDER}/${props.raceId}/${timestamp}~${props.waypoint}~${userData.email.replace("@","$")}~${file.name}`

        console.log(uploadPath);
        uploadFiletoGCS(uploadPath, file);
    }

  function uploadFiletoGCS(uploadPath, file) {
    // Create file metadata including the content type
    /** @type {any} */
    const metadata={
      contentType: file.type,
    };

    const storageRef=dbRef(storage, uploadPath);

    // 'file' comes from the Blob or File API
    uploadBytes(storageRef, file, metadata).then((snapshot) => {
      console.log('Uploaded a blob or file!');
    });
  }
};
function klick(){
    debugger;
}
</script>

<template>
    {{props.raceId}}/~{{userData.email}}~file
    <div>
        <input id="upload" type="file" accept=".jpg,.png,image/*" multiple @change="uploadFile" />
        <Button @click="submitFile">Submit</Button>
        <Button @click="klick()">debug</Button>
        <table>
            <tr v-for="(f,i) in files">
                <td>{{i}}</td>
                <td>{{props.waypoint}}~{{new Date(f.lastModified).toISOString()}}~{{f.name}}</td>
            </tr>
        </table>
    </div>
    <hr/>

</template>

<style scoped>

</style>
