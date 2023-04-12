<script setup>
import { useStore } from 'vuex';
import { useRouter, useLink } from 'vue-router'

import { computed,ref } from 'vue';
import {getDateTime} from '../helpers';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputSwitch from 'primevue/inputswitch';
const store = useStore()
const router = useRouter()

const races = computed(() => {let arr = store.state.datastore.races
                              if (arr instanceof Object) 
                                if (nolist.value ){
                                  return arr
                                } else {
                                  return arr.filter(x=>!(x.status && x.status.includes('nolist')))
                                }
                              })

store.dispatch('getRacesAction')

import { db } from '../../firebase/config';

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
        <InputSwitch v-model="nolist"/>
      </div>
      <DataTable :value="races">
          <!-- <Column v-for="col of races[0]" :field="col.field" :header="col.header" :key="col.field"></Column> -->
          <!-- <Column field="id" header="Id"></Column> -->
          <Column field="Date" header="Date"></Column>
          <Column field="Name" header="Race"></Column>
          <!-- <Column field="Location" header="Location"></Column> -->
          <!-- <Column >
                    <template #body="slotProps">
                        <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editProduct(slotProps.data)" />
                        <Button icon="pi pi-trash" class="p-button-rounded p-button-warning" @click="confirmDeleteProduct(slotProps.data)" />
                    </template>          
            <Button>@click="$router.push(`race/${r.id}`)">Go</Button>
          </Column>  -->
          <Column>
            <template #body="slotProps">
              <!-- <router-link :to="slotProps.data.id" class="text-primary mr-2 hover:text-[#FF9000] transition ease-in-out">
                Goto
              </router-link> -->
              <Button type="button" :label="slotProps.data.id" 
                @click="router.push(`/e/${slotProps.data.id}`)"
                class="p-button-raised p-button-secondary"></Button>
              <Button type="button" @click="router.push(`/e/${slotProps.data.id}`)"
                class="p-button-raised p-button-secondary">Record</Button>
              <Button type="button" @click="router.push(`/e/${slotProps.data.id}/i`)"
                class="p-button-raised p-button-secondary">Images</Button>
            </template>
          </Column>
      </DataTable>
     
    </div>
  </div>
</template>