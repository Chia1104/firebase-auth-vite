<script setup>
import {useStore} from "vuex";
import Menu from 'primevue/menu';

const store = useStore()
const signInState = store.state.auth.signIn
const userData = store.state.auth.userDetails.userData 
const dispKeys={'displayName':'Name','email':'eMail'}//"uid":"uid",

let items= [
				{
					label: 'Results',
					icon: 'pi pi-clock',
					to: '/r'
				},
				{
					label: 'Photos',
					icon: 'pi pi-images',
					to: '/p'
				},
				{
          label: 'Events',
          icon: 'pi pi-flag',
          to: '/e'
        },

			]

</script>

<template>
  <div class="container mx-auto">
    <div class="w-full text-center max-w-lg">
      <h1 class="text-xl">Home </h1>
      <div v-if="userData.uid" class="mx-auto" >
        <table>
          <tr v-for="(v,k) in dispKeys">
            <td><b>{{v}}</b></td>
            <td>{{userData[k]}}</td>
          </tr>
        </table>
      </div>
      <div v-else>
        Not logged in
      </div>
      <Menu :model="items" class="mx-auto"/>
      
    </div>
  </div>
</template>

<style>
  .btn {
    @apply py-2 px-4 font-semibold rounded-lg shadow-md;
  }
  .btn-green {
    @apply text-white bg-green-500 hover:bg-green-700;
  }
</style>