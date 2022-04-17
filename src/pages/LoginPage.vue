<script setup>
import LoginCard from "../components/LoginCard.vue";
import Message from "../components/Message.vue";
import {useStore} from "vuex";

const store = useStore()
const signInState = store.state.auth.signIn
const message = signInState.errorMessage

</script>

<template>
  <div class="flex flex-col items-center">
    <div class="container mx-auto">
      <LoginCard />
    </div>
    <Message
        :warning="signInState.isError"
        warningMsg="Invalid Email or password"
    />
  </div>
</template>
