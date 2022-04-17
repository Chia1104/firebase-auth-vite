<script setup>
import {firebaseAuth} from "../../firebase/config";

const getUser = () => {
  try {
    const user = firebaseAuth.currentUser;
    if(!user) return false;
    else return user;
  } catch (error) {
    return false;
  }
}

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
        <div v-if="getUser">
          <router-link to="/" class="text-primary mr-2">
            Home
          </router-link>
          <router-link to="/profile" class="text-primary mr-2">
            Profile
          </router-link>
        </div>
        <div v-if="!getUser">
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
