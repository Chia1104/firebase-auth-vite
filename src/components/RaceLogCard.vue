<script setup>
import { defineProps, ref } from 'vue'
import { useStore } from 'vuex';
import { useToast } from "primevue/usetoast";
// import Button from 'primevue/button';
import { db, storage } from "../../firebase/config" //storage

let props = defineProps({
  raceId: String,
  bibRegex: String,
  waypoint: String,
})

const store = useStore()
const toast = useToast();

const showTemplate = (summary, detail) => {
  toast.add({severity: 'warn', summary: summary, detail: detail, group: 'bc'});
}
const popup = () => {
    debugger;
    toast.add({severity: 'warn', summary: 'summary', detail: 'detail', group: 'bc'});
}

import { collection,query,doc, onSnapshot,getDocs } from "firebase/firestore";

let entries=ref([])
let raceDoc=doc(db, "races", props.raceId); //

const q = query(collection(raceDoc, "readings"));

const unsubscribe = onSnapshot(q, (querySnapshot) => {
  let re=RegExp(props.bibRegex ? `^${props.bibRegex}$` : '^\\d{3,5}$')
  querySnapshot.forEach((doc) => {
      let data = doc.data()
      console.log(re,data,data.bib.search(re))
      if (data.bib.search(re)!=-1) // matching bib pattern
        entries.value.push(data);
  });
  // console.log("Array", entries.value);
});

</script>
    
<template>
    <div v-for="i in entries">
        {{i.timestamp}} / {{i.bib}} / {{i.score}} 
    </div>
    <Button @click="popup">popup</Button>
</template>

<style scoped>

</style>
