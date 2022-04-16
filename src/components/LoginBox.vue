<script setup>
import { useStore } from 'vuex';
import { ref, reactive } from "vue";
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import LoadingSpinner from './LoadingSpinner.vue';
import router from "../router";

const store = useStore()
const signInState = store.state.auth.signIn

const passwordValue = ref()
const emailValue = ref()
const localState = reactive({
  disableSignIn: true
})

const signIn = () => {
  store.dispatch('signInAction', {email: emailValue.value, password: passwordValue.value}).then(() => {
    if (!signInState.isError) router.push('/home')
    else return null
  })
}


</script>

<template>
  <form class="flex-col text-center bg-white md:w-[75%] rounded-xl shadow-lg mx-auto sm:w-full p-5 relative" @submit.prevent="signIn">
    <LoadingSpinner v-if="signInState.isLoading" />
    <h1 class="text-left text-2xl mb-10 ml-3">Login</h1>
    <div class="w-[65%] mx-auto my-10">
      <span class="p-float-label">
        <InputText id="EmailInputText" type="email" v-model="emailValue" class="w-full" />
        <label for="EmailInputText">Email</label>
      </span>
    </div>
    <div class="w-[65%] mx-auto my-10">
      <span class="p-float-label">
        <InputText id="PasswordInputText" type="password" v-model="passwordValue" class="w-full" />
        <label for="PasswordInputText">Password</label>
      </span>
    </div>
    <button class="bg-[#2B2E4A] rounded-full drop-shadow-lg text-white text-md h-9 w-[85px] opacity-40" :class="{ 'ableSignIn': !localState.disableSignIn }" :disabled="localState.disableSignIn">Login</button>
  </form>
</template>

<style scoped lang="postcss">
  .ableSignIn {
    @apply hover:bg-[#FF9000] transition ease-in-out opacity-100
  }
</style>
