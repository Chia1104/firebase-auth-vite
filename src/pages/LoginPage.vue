<script setup>
import LoginCard from "../components/LoginCard.vue";
import Message from "../components/Message.vue";
import {useStore} from "vuex";

const store = useStore()
const signInState = store.state.auth.signIn

</script>

<template>
  <div class="flex flex-col items-center">
    <div class="container mx-auto">
      <LoginCard />
    </div>
    <Message
        :warning="signInState.isError"
        :warningMsg="signInState.errorMessage"
    />
  </div>
</template>
