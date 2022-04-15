<script setup>
import { useStore } from 'vuex';

const store = useStore()
const user = store.state.firebaseModule.user

const emailExample = 'test@test.com'
const passwordExample = 'test1234'

const signIn = () => {
  store.dispatch('signInAction', {
    email: emailExample,
    password: passwordExample
  })
}
</script>

<template>
  <form @submit.prevent="signIn">
    <h1>Login</h1>
    <button class="bg-amber-400" >Sign In</button>
    <p class="text-blue-400" v-if="user.isLoading">
      LOADING
    </p>
    <p class="text-red-500" v-if="user.isError">
      ERROR!!!
    </p>
    <p v-text="user.data"/>
  </form>
</template>

<style scoped>

</style>
