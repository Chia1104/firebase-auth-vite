<script setup>
import LoginCard from "../components/LoginCard.vue";
import Message from "../components/Message.vue";
import Menu from 'primevue/menu';
import {useStore} from "vuex";

const store = useStore()
const signInState = store.state.auth.signIn
let items= [
				{
					label: 'Results',
					icon: 'pi pi-clock',
					to: '/r'
				},
				{
					label: 'Photos',
					icon: 'pi pi-images',
					to: '/p'
				},
  ]

</script>

<template>

  <div class="flex flex-col items-center">
    <Menu :model="items" />
    <div class="container mx-auto">
      <LoginCard />
    </div>
    <Message
        :warning="signInState.isError"
        :warningMsg="signInState.errorMessage"
    />
  </div>
</template>
