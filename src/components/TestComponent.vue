<script setup>
import { onMounted, reactive, ref } from 'vue'
import Dropdown from 'primevue/dropdown';
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

  <!-- <h1 class="test-color">{{ msg }}</h1> -->
  <div id="container">

<!-- <script src="js/main.js" async></script> -->
  <button type="button" @click="increment">count is: <p v-text="countExample.count" /></button>
  </div>

</template>

<style scoped >
button#recButton {
	width: 35px;
	height: 35px;
	/* font-size: 0;
	background-color: red; */
	border: 0;
	border-radius: 35px;
	margin: 18px;
	outline: none;
}

.notRec{
	background-color: darkred;
}

.Rec{
  background-color: red;
	animation-name: pulse;
	animation-duration: 1.5s;
	animation-iteration-count: infinite;
	animation-timing-function: linear;
}

@keyframes pulse{
	0%{
		box-shadow: 0px 0px 5px 0px rgba(173,0,0,.3);
	}
	65%{
		box-shadow: 0px 0px 5px 13px rgba(173,0,0,.3);
	}
	90%{
		box-shadow: 0px 0px 5px 13px rgba(173,0,0,0);
	}
}
</style>
