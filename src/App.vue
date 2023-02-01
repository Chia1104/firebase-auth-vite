<script setup>
import Nav from "./components/Nav.vue";
import Footer from "./components/Footer.vue";

</script>

<template>
  <Nav />
  <div class="mt-20">
    <RouterView />
    <Footer />
  </div>
</template>
