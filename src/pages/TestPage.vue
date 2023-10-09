<script setup>
import TestComponent from "../components/TestComponent.vue";
import Button from "primevue/button"
import InputText from 'primevue/inputtext';
import { ref } from "vue";
const value1 = ref(42723);
const value2 = ref(58151);
const value3 = ref(2351.35);
const value4 = ref(50);
</script>

<template>
  <div class="container mx-auto">
    <Button label="testButton" primary raised class="p-button text-center">test</Button>
    <div class="card flex flex-wrap gap-3 p-fluid">
        <div class="flex-auto">
            <label for="integeronly" class="font-bold block mb-2"> Integer Only </label>
            <InputText v-model="value1"  />
        </div>
    </div>
    
    <div class="card flex justify-content-center">
        <Button label="Submit" />
    </div>

    <Button label="Check" icon="pi pi-check" class="px-4 py-1 text-sm text-purple-600 font-semibold rounded-full border border-purple-200 hover:text-white hover:bg-purple-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2"></Button>
  </div>
  <div class="container mx-auto">
    <div class="w-full text-center justify-center flex-col">
      <div>
        <h1>Test Page</h1>
        <p>
          This is a test page.
        </p>
      </div>
      <img alt="Vue logo" src="../assets/logo.png" class="mx-auto"/>
      <TestComponent msg="Hello Vue and Vite"/>
    </div>
  </div>

</template>
