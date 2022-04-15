<script setup>
import TestComponent from "../components/TestComponent.vue";

</script>

<template>
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
