<script setup>
import { firebaseAuth } from '../../firebase/config';
import { useStore } from "vuex";
import { watchEffect, computed } from "vue";

const store = useStore()
const userState = computed(() => store.state.auth.userDetails)

const firebaseUser = () => firebaseAuth.onAuthStateChanged(user => {
  // console.warn(`firebaseAuth.onAuthStateChanged ${JSON.stringify(user)}`)
  if (user) {
    store.commit('successRequestUser', user)
  } else {
    store.commit('failRequestUser', 'Fail to get user')
  }
});

watchEffect(firebaseUser)

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
          <router-link to="/" class="text-primary mr-2 hover:text-[#FF9000] transition ease-in-out">
            Home
          </router-link>
          <router-link to="/profile" class="text-primary mr-2 hover:text-[#FF9000] transition ease-in-out">
            Profile
          </router-link>
        </div>
        <div v-else>
          <router-link to="/login" class="text-primary mr-2 hover:text-[#FF9000] transition ease-in-out">
            Login
          </router-link>
          <router-link to="/register" class="text-primary mr-2 hover:text-[#FF9000] transition ease-in-out">
            Register
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
