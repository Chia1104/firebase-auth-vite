<script setup>
import { defineProps } from 'vue'
import { useStore } from 'vuex';

defineProps({
  msg: String
})

const store = useStore()
const countExample = store.state.countExample

const increment = () => {
  store.dispatch('incrementAction')
};

</script>

<template>

  <h1 class="test-color">{{ msg }}</h1>
  <button type="button" @click="increment">count is: <p v-text="countExample.count" /></button>

</template>

<style scoped lang="postcss">
  .test-color {
    @apply text-blue-400
  }
</style>
