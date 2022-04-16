<script setup>
import { useStore } from 'vuex';
import { computed, onActivated } from "vue";

const store = useStore()
const userState = computed(() => store.state.auth.userDetails)
const getUser = () => store.dispatch('getUserAction')

onActivated (() => {
  getUser()
})

</script>

<template>
  <div class="w-screen flex h-[70px] items-center bg-white shadow-lg inset-x-0 top-0 fixed justify-center z-40">
    <div class="flex container w-[100%]">
      <div class="flex items-center w-[80%]">
        <div>
          <h1 class="text-primary text-xl">
            Firebase Auth Example
          </h1>
        </div>
      </div>
      <div class="md:flex items-center w-[20%] sm:hidden justify-center">
        <div v-if="userState.isSignIn">
          <router-link to="/" class="text-primary mr-2">
            Home
          </router-link>
          <router-link to="/profile" class="text-primary mr-2">
            {{ userState.userData.displayName }}
          </router-link>
        </div>
        <div v-if="!userState.isSignIn">
          <router-link to="/login" class="text-primary mr-2">
            Login
          </router-link>
          <router-link to="/register" class="text-primary mr-2">
            Register
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
