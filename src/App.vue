<script setup>
import Nav from "./components/Nav.vue";
import Footer from "./components/Footer.vue";

const callback = (response) => {
  // This callback will be triggered when the user selects or login to
  // his Google account from the popup
  console.log("Handle the response", response)
}

</script>

<template>
  <Nav />
  <div class="mt-20">
    <RouterView class="md:min-h-full" />
    <!-- <Footer  /> -->
  </div>
  <!-- Login
  <GoogleLogin :callback="callback"/> -->
</template>

<style scoped>
RouterView {
  min-height: calc(85vh - 70px);
}

footer {
  height: 15vh;
}
</style>
