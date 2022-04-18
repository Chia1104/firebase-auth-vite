<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';
import router from "../router";

const store = useStore()
const userState = computed(() => store.state.auth.userDetails)

const logOut = () => {
  store.dispatch('logOutAction')
  router.push('/login')
}

const showChangePassword = () => {
  return store.dispatch('activeChangePasswordSheetAction')
}

</script>

<template>
  <div class="flex-col text-center bg-white md:w-[75%] rounded-xl shadow-lg mx-auto sm:w-full relative pb-5 mb-8">
    <div class="overflow-hidden w-full h-full">
      <img class="rounded-tl-xl rounded-tr-xl h-[300px] w-full top-0 left-0 " src="../assets/portfolio-1.jpg"  alt="portfolio"/>
    </div>
    <div class="flex justify-center z-30 absolute w-full top-[13rem]">
      <img class="rounded-full h-[200px] w-[200px] border-8 border-white" src="../assets/portfolio-2.jpg" alt="profile"/>
    </div>
    <div class="mt-28">
      <h1 class="text-3xl text-left ml-5 mb-7" v-text="userState.userData.email" />
      <div class="text-center mr-5 flex justify-end">
        <button class="bg-[#2B2E4A] rounded-full drop-shadow-lg text-white text-md h-9 w-[85px] hover:bg-[#FF9000] transition ease-in-out mr-5" @click="logOut">LogOut</button>
        <button class="bg-[#2B2E4A] rounded-full drop-shadow-lg text-white text-md h-9 w-[190px] hover:bg-[#FF9000] transition ease-in-out" @click="showChangePassword">Change Password</button>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
