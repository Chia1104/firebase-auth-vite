<script setup>
import { useStore } from 'vuex';

const store = useStore()
const authUser = store.state.auth.user
const emailExample = 'test@test.co'
const passwordExample = 'test123'

const signIn = () => store.dispatch('signInAction', { email: emailExample, password: passwordExample })

</script>

<template>
  <form class="container mx-auto flex-col text-center" @submit.prevent="signIn">
    <h1>Login</h1>
    <button class="bg-amber-400" >Sign In</button>
    <p class="text-blue-400" v-if="authUser.isLoading">
      LOADING
    </p>
    <p class="text-red-500" v-if="authUser.isError" v-text="authUser.errorMessage" />
    <p v-text="authUser.data?.email"/>
  </form>
</template>

<style scoped>

</style>
