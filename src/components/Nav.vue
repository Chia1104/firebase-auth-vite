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
let site= computed(()=>{
  if (document.location.href.toLowerCase().search("fitness.forthe.life")!=-1) 
    return "Fitness.ForThe.life"
  if (document.location.href.toLowerCase().search("memories.forthe.life")!=-1) 
    return "Memories.ForThe.life"
  // default
  return 'RUN PiX'
  })
</script>

<template>
  <div class="w-screen flex h-[70px] items-center bg-white shadow-lg inset-x-0 top-0 fixed justify-center z-40">
    <div class="flex container w-[100%]">
      <div class="flex items-center w-[80%]">
        <div>
          <a class="text-primary text-xl" href="/">
            {{site}}
          </a>
        </div>
      </div>
      <div class="sm:flex items-center w-[30%] sm:hidden justify-center">
        <div v-if="userState.isSignIn">
          <router-link to="/" class="text-primary mr-2 hover:text-[#FF9000] transition ease-in-out">
             <i class="pi pi-home" style="font-size: 1.5rem"></i>
          </router-link>
          <router-link to="/profile" class="text-primary mr-2 hover:text-[#FF9000] transition ease-in-out">
            <i class="pi pi-user" style="font-size: 1.5rem"></i>
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
