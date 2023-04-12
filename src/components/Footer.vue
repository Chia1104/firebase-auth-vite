<script setup>
let header="text|link".split('|')
let values=`
RUNPIX @2023|#
Rating link|#
Feedback link|#`
// bg-indigo-900 text-white
const footer=values.split('\n').filter(x=>x)
             .map(x=>x.split("|"))
             .map(x=>header.reduce((obj, k, i) => ({...obj, [k]: x[i] }), {})) 
</script>

<template>
  <div class="grid grid-cols-4 gap-4 mt-4 mx-auto bg-gray-300 hover:items-center">
    <!-- <div v-for="x in footer">
        {{x.text}} {{x.link}}
    </div> -->
    <a href="https://www.facebook.com/runpixindia">
      <i class="pi pi-camera" style="font-size: 1.5rem"></i>
      RUNPIX @2023
    </a>
    <a href="https://runpix.page.link/feedback">
      <i class="pi pi-star-fill" style="font-size: 1.5rem"></i>
      Feedback
    </a>
    <a href="https://runpix.page.link/features">
      <i class="pi pi-user-edit" style="font-size: 1.5rem"></i>
      Feature requests
    </a>    
    <a href="https://pcmcrunners.in/#/profile">
      <i class="pi pi-info-circle" style="font-size: 1.5rem"></i>
      Get Fit for FREE
    </a>
    
  </div>
</template>

<style scoped>

</style>