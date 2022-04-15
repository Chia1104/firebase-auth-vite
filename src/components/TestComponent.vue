<script setup>
import { defineProps, reactive } from 'vue'
import { useStore } from 'vuex';

defineProps({
  msg: String
})

const store = useStore()
const state = store.state

const increment = () => {
  store.commit("increment");
};

</script>

<template>

  <h1 class="test-color">{{ msg }}</h1>
  <button type="button" @click="increment">count is: <p v-text="state.count" /></button>

</template>

<style scoped lang="postcss">
  .test-color {
    @apply text-blue-400
  }
</style>
