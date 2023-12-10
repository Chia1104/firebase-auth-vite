
<template>
    <div id="app">
        
        
        <svg :viewBox="'0 0 '+2*radius+' '+2*radius" class="svg"> 
            <!-- R - width/2  v-if="props.background"  -->
        <circle v-bind='{cx: props.radius, cy: props.radius, r: props.radius}'  stroke="none" :fill="props.fill"/>
        <circle v-if="props.ring" v-bind='{cx: props.radius, cy: props.radius}'  r="210" fill="transparent" stroke="none" :stroke-width="fontSize*2"/>

        
        <!-- <path d=" oldd="M60,250a190,190 0 1,1 380,0" " fill="transparent" v-bind="{stroke: hsl}" stroke-width="8px" />
         -->
        <path id="top"
            :d="getPath('top')"
            fill="transparent" />
        <text class="circular" :width="2*radius" >
            <textPath v-bind="{'xlink:href': '#top', startOffset: '50%', 'text-anchor': 'middle'}">
            {{ top }} 
            </textPath>
        </text>

         <rect x="0" y="0" :width="2*radius" :height="2*radius" fill="none"/>
        <text class="centerText" x="50%" y="48%" :font-size="radius/2">
            {{center}}</text>    


        <!-- <path d="oldd="M30,250a190,190 0 1,0 440,0"  fill="transparent" v-bind="{stroke: hsl}" stroke-width="8px" /-->        
        <path id="bottom"
            :d="getPath('bottom')" 
            fill="transparent" />
        <text class="circular" :width="2*radius" >
            <textPath v-bind="{'xlink:href': '#bottom', startOffset: '50%', 'text-anchor': 'middle'}" >
             {{ bottom }} 
            </textPath>

        </text>
        </svg>

    
        <div class="wrapper">
        <input type="text" class="input" v-model="top"/>/
        <input type="text" class="input" v-model="center"/>/
        <input type="text" class="input" v-model="bottom"/>
        </div>
    </div>
</template>

<script setup>
/**
* Radius:  500
* ring widths: 80
* font size: 50
* font family: 
*/
import { ref,computed  } from "vue";
const top = ref( 'THE TEST ADASRSH')
const center= ref ('WW')
const bottom= ref('MONTH 2023')

const props = defineProps({
    radius: { type: Number, required: true },
    top: { type: String, required: false},
    fontSize: {type: Number},
    ring: {type: Boolean, default: false },
    fill: {type: String, default: "aliceblue"}
})

let radius = parseInt(props.radius )
let fontSize = parseInt(props.fontSize ) || radius/4
props.fontSize = parseInt(props.fontSize ) || radius/4

let ymargin=radius*.1
let ringwidth = Math.round(ymargin + 1*fontSize)
let r_inner=radius-ringwidth/2



// Arc: A rx ry x-axis-rotation large-arc-flag sweep-flag x y
function getPath (top_bottom) {
    let inner = radius-ringwidth/2, 
        margin, ret
    if (top_bottom == 'top'){
        ret=`M${ringwidth/2},${radius}a${inner},${inner} 0 1,1 ${radius*2-ringwidth},0`
    } else {
        margin = ymargin //ringwidth-
        // inner = radius-ymargin       
        ret=`M${ringwidth/2},${radius}a${inner},${inner} 0 1,0 ${radius*2-ringwidth},0`
    }
    // debugger

    console.log(ret)
    return ret
}

</script>

<style>


.circular {
    dominant-baseline: middle;
    /* dominant-baseline:"middle" ;
    font: 10rem Verdana, Helvetica, Arial, sans-serif;
    test-align:"middle"; */
}

.centerText {
  dominant-baseline: mathematical;
  text-anchor: middle;
  /* font-size: 10rem; */
}

.svg {
  font-size: 3rem;
  font-weight: 700;
  max-width: 250px;
}

.wrapper {
  font-size: 1rem;
}
.input {
  width: 100px;
  border: none;
  border-bottom: 1px solid;
  margin: 1em;
  padding: 0.5em;
  font-size: 1rem;
}

.shadow {
  -webkit-filter: drop-shadow( 3px 3px 2px rgba(0, 0, 0, .4));
  filter: drop-shadow( 3px 3px 2px rgba(0, 0, 0, .4));
  /* Similar syntax to box-shadow */
}
/* circle.background {
    background-color: linear-gradient(to right, rgb(199, 210, 254), rgb(254, 202, 202), rgb(254, 249, 195))
} */
</style>