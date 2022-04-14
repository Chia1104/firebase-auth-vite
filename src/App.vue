<template>
  <Nav />
  <div class="mt-20">
    <RouterView />
  </div>
</template>
<script>
import Nav from "./components/Nav.vue";
export default {
  components: {Nav}
}
</script>
