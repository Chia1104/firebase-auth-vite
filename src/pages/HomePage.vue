<script setup>
import {useStore} from "vuex";
const store = useStore()
const signInState = store.state.auth.signIn
const userData = store.state.auth.userDetails.userData 
const dispKeys={"uid":"uid",'displayName':'Name','email':'email'}


</script>

<template>
  <div class="container mx-auto">
    <div class="w-full text-center">
      <h1>Home Page</h1>
      <div v-if="userData.uid" >
        <div>
          <!-- <img v-bind:src="userData.photoURL" />  -->
          {{userData.displayName}}</div>
        <div>uid:{{userData.uid}}, email:{{userData.email}}</div>
      </div>
      <div v-else>
        Not logged in
      </div>
      <button class="px-4 py-1 text-sm text-purple-600 font-semibold rounded-full border border-purple-200 hover:text-white hover:bg-purple-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2"
      @click="$router.push('races')">Races</button>
      
    </div>
  </div>
</template>
