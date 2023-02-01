<script>
import { ref, onMounted } from 'vue'
import Button from 'primevue/button';
let loc=ref(new Date())
//Geolocation object

let options = {
    enableHighAccuracy: true,
    timeout: 1000,
    maximumAge: 0
}

let error=(err)=> {
    loc.value['signal']='N/A'
    console.warn(`ERROR(${err.code}): ${err.message}`);
}

let success= (pos)=> {
    const crd = pos.coords;
    //Object.fromEntries(Object.entries(crd).filter(([_, v]) => v!=null ));
    loc.value={latitude: crd.latitude, 
        longitude: crd.longitude,
        accuracy: crd.accuracy,
        timestamp: pos.timestamp,
        signal:'OK'}
    // console.log("success",loc);
    // console.log(`Lat: ${crd.latitude}, Lon: ${crd.longitude},'Accy: ${crd.accuracy} m`);
}

function click(){
    console.log('got ',JSON.stringify(loc))
}
let milliseconds=5000 // frequency

var myVar = setInterval(getLoc, milliseconds); //setting the loop with time interval


function getLoc(){
    navigator.geolocation.getCurrentPosition(success, error, options);
}


export default {
    setup(){
      console.log(loc)
      return {loc,getLoc}
  }
}
</script>

<script setup>


function clearTimer(){
    console.log('stop ')
    clearInterval(myVar); //call this line to stop the loop
} 

</script>

<template>
<div>
    <Button name="click" @click="click" @dblclick="clearTimer">GPS</Button>
    <Button name="click" @click="clearTimer">Cancel GPS</Button>
LOC: {{loc.signal}}/{{new Date(loc.timestamp).toTimeString().substring(0,8)}}
</div>
</template>

<style scoped>

</style>