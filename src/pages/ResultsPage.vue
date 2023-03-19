<script setup>
import { useStore } from 'vuex';
import Dropdown from 'primevue/dropdown';
// import Button from 'primevue/button';
import { useRoute } from 'vue-router';
import { computed, ref } from 'vue';

const route = useRoute();  
const params = route.params;

const store = useStore()
const races =  computed(() => store.state.datastore.races)
let raceId = ref(params.raceId)
let bib = ref(params.bib)
store.dispatch('getRacesAction')


let klick=() => { 
  
  debugger;
}

</script>

<template>
  <div class="container mx-auto">
    <h1>Results</h1>
    <Dropdown v-model="raceId" :options="races" optionLabel="Name" optionValue="id"
                      placeholder="Select a race" class="md:w-14rem" />   
    {{bib}}                  
    <div class="w-full text-center justify-center flex-col">
      <Button name="create" @click="klick">Create</Button>
    </div>
  </div>
</template>