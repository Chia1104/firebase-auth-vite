<script setup>
let header="text|link".split('|')
let values=`
RUNPIX @2023|#
Rating link|#
Feedback link|#`
const footer=values.split('\n').filter(x=>x)
             .map(x=>x.split("|"))
             .map(x=>header.reduce((obj, k, i) => ({...obj, [k]: x[i] }), {})) 
</script>

<template>
  <div class="grid grid-cols-4 gap-4 mx-auto bg-indigo-900 text-white">
    <div v-for="x in footer">
        {{x.text}} {{x.link}}
    </div>
  </div>
</template>

<style scoped>

</style>