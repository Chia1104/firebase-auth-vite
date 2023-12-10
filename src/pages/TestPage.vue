<script setup>
import TestComponent from "../components/TestComponent.vue";
import Button from "primevue/button"
import InputText from 'primevue/inputtext';
import SvgText from "../components/SvgText.vue"
import { ref } from "vue";

</script>

<template>
  <div id="testzone" class="container mx-auto">
    <SvgText bottom="testAvinash" 
            radius="250" 
            fontSize="60"
            top="Race Event" 
            radius-ringwidth
            center="AM"/>
    <!-- <SvgText bottom="testAvinash" 
            radius=150
            fontSize=30
            top="Race Event" 
            ring
            center="AM"/> -->
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

