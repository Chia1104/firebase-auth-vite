<script>
import Nav from "./components/Nav.vue";
export default {
  components: { Nav }
}
</script>

<template>
  <Nav />
  <div class="mt-20">
    <RouterView />
  </div>
</template>
