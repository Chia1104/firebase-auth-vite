<script setup>
import {useStore} from "vuex";
// import Menu from 'primevue/menu';
import Image from 'primevue/image';

const store = useStore()
const signInState = store.state.auth.signIn
const userData = store.state.auth.userDetails.userData 
const dispKeys={'displayName':'Name','email':'eMail'}//"uid":"uid",

// let items= [
// 				{
// 					label: 'Results',
// 					icon: 'pi pi-clock',
// 					to: '/r'
// 				},
// 				{
// 					label: 'Photos',
// 					icon: 'pi pi-images',
// 					to: '/p'
// 				},
// 				{
//           label: 'Events',
//           icon: 'pi pi-flag',
//           to: '/e'
//         },

// 			]
let items= [
				{
					label: 'Photos',
					img: '/assets/graphics/photos.jpg',
					to: '/p'
				},
				{
					label: 'Results',
					img: '/assets/graphics/results.jpg',
					to: '/r'
				},
				{
					label: 'Events',
					img: '/assets/graphics/events.jpg',
					to: '/e'
				},
  ]
</script>

<template>
  <div class="w-full text-center max-w-lg">
    <h1 class="text-xl">Home </h1>
  </div>
  <div class="flex flex-col items-center">
    <div class="container mx-auto">
        <!-- <Menu :model="items" class="mx-auto"/> -->
      <router-link v-for="i in items" :to="i.to"
          class="">
        <Image :src="i.img" :alt="i.label"/>
      </router-link>
    </div>
    <div v-if="userData.uid"  >
      <div v-for="(v,k) in dispKeys">
          <span><b>{{v}}: </b></span>
          <span>{{userData[k]}}</span>
        </div>

    </div>
    <div v-else>
      Not logged in
    </div>
  </div>
</template>

<style scoped>
.p-image :deep( img) {
  box-shadow: #ddd8 1em;
  border-radius: 2em;
  width: 50vw;
  margin: auto;
}
  .btn {
    @apply py-2 px-4 font-semibold rounded-lg shadow-md;
  }
  .btn-green {
    @apply text-white bg-green-500 hover:bg-green-700;
  }
</style>