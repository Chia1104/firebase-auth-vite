<script setup>
import RegisterCard from '../components/RegisterCard.vue'
import Message from "../components/Message.vue";
import { useStore } from "vuex";

const store = useStore()
const registerState = store.state.auth.register
const message = registerState.errorMessage

</script>

<template>
  <div class="flex flex-col items-center">
    <div class="container mx-auto">
      <RegisterCard />
    </div>
    <Message
        :warning="registerState.isError"
        warningMsg="Invalid Email or password"
    />
  </div>
</template>
