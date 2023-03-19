<script setup>
import { useStore } from 'vuex';
import TestComponent from "../components/TestComponent.vue";
import DataTable from 'primevue/datatable';
import Button from 'primevue/button';
import Column from 'primevue/column';

import { computed } from 'vue';
import {getDateTime} from '../helpers';

const store = useStore()
const races = computed(() => store.state.datastore.races)

store.dispatch('getRacesAction')

import { db } from '../../firebase/config';
let fsdb={races:[]}

let js=(x)=>JSON.parse(JSON.stringify(x))

let klick=() => { 
  
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
    <h1>Races</h1>
    <div class="w-full text-center justify-center flex-col">
      <DataTable :value="races">
          <!-- <Column v-for="col of races[0]" :field="col.field" :header="col.header" :key="col.field"></Column> -->
          <Column field="id" header="Id"></Column>
          <Column field="Date" header="Date"></Column>
          <Column field="Name" header="Race"></Column>
          <Column field="Location" header="Location"></Column>
          <!-- <Column >
                    <template #body="slotProps">
                        <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editProduct(slotProps.data)" />
                        <Button icon="pi pi-trash" class="p-button-rounded p-button-warning" @click="confirmDeleteProduct(slotProps.data)" />
                    </template>          
            <Button>@click="$router.push(`race/${r.id}`)">Go</Button>
          </Column>  -->
          <Column field="connect" header="Connect" >
            <template #body="slotProps">
              <Button type="button" :label="slotProps.data.id" 
                @click="$router.push(`race/${slotProps.data.id}`)"
                class="p-button-raised p-button-secondary"></Button>
            </template>
          </Column>
      </DataTable>
      <!-- <div>
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

      </div> -->
        <!-- <HelloWorld/> -->
      <Button name="create" @click="klick">Create</Button>
      <TestComponent msg="Hello Vue and Vite"/>
    </div>
  </div>
</template>