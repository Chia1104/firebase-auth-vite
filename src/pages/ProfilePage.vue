<script setup>
import { useStore } from 'vuex';
import router from "../router";

const store = useStore()
const userState = store.state.auth.userDetails

const logOut = () => {
  store.dispatch('logOutAction')
  router.push('/login')
}

</script>

<template>
  <div class="container mx-auto">
    <p v-text="userState.userData.email" />
    <button class="bg-[#2B2E4A] rounded-full drop-shadow-lg text-white text-md h-9 w-[85px] hover:bg-[#FF9000] transition ease-in-out" @click="logOut">LogOut</button>
  </div>
</template>

<style scoped>

</style>
