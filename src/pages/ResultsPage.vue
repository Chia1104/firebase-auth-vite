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

    <h1 @dblclick="klick()" class="text-lg">Results</h1>
    <Dropdown v-model="raceId" :options="races" optionLabel="Name" optionValue="id"
                      placeholder="Select a race" class="md:w-14rem w-full" />   
    <div class="card flex justify-content-center w-full">
      <AutoComplete v-model="bibSelection" showClear  :suggestions="items" @complete="searchBib" 
        :dropdown-click="searchBib" class="w-full" />
        <!-- <AutoComplete v-model="selectedItem" :suggestions="filteredItems" @complete="searchItems" :virtualScrollerOptions="{ itemSize: 38 }" optionLabel="label" dropdown /> -->
      <Button name="searchImages" @click="searchImages">Enter</Button>
    </div>                     
    <div v-if="bibSelection && raceId" class="text-lg">
      BIB: {{bibSelection}} {{bibData.Name}}
    </div>


  </div>
</template>