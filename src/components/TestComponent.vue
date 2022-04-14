<script setup>

import { defineProps, reactive } from 'vue'

defineProps({
  msg: String
})

const state = reactive({ count: 0 })

</script>

<template>

  <h1 class="test-color">{{ msg }}</h1>
  <button type="button" @click="state.count++">count is: <p>{{ state.count }}</p></button>

</template>

<style scoped lang="postcss">
  .test-color {
    @apply text-blue-400
  }
</style>
