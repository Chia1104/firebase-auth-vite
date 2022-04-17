<script setup>
import { useStore } from 'vuex';
import {ref, reactive } from "vue";
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import LoadingSpinner from './LoadingSpinner.vue';

const store = useStore()
const changePasswordState = store.state.auth.changePassword
const errorMessage = changePasswordState.errorMessage

console.debug(errorMessage)

const oldPasswordModel = ref('')
const newPasswordModel = ref('')
const localState = reactive({
  disableChange: true,
  oldPasswordError: false,
  newPasswordError: false,
})

const validateOldPassword = () => {
  localState.oldPasswordError = oldPasswordModel.value.length < 8;
}

const validateNewPassword = () => {
  localState.newPasswordError = newPasswordModel.value.length < 8 || newPasswordModel.value === oldPasswordModel.value;
}

const validateForm = () => {
  validateOldPassword()
  validateNewPassword()
  localState.disableChange = localState.oldPasswordError || localState.newPasswordError;
}

const changePassword = () => {
  console.debug('changePassword')
  store.dispatch('changePasswordAction', {
    oldPassword: oldPasswordModel.value,
    newPassword: newPasswordModel.value,
  })
}

</script>

<template>
  <form class="flex-col text-center bg-white md:w-[75%] rounded-xl shadow-lg mx-auto sm:w-full relative py-7 mb-8" @submit.prevent="changePassword" @change="validateForm">
    <LoadingSpinner v-if="changePasswordState.isLoading" />
    <h1 class="text-left text-2xl mb-10 ml-3">Change Password</h1>
    <div class="md:w-[65%] mx-auto my-10 sm:w-full">
      <span class="p-float-label mb-2">
        <InputText id="OldPasswordInputText" type="password" v-model="oldPasswordModel" class="w-full" required :class="{'p-invalid': localState.oldPasswordError}"/>
        <label for="OldPasswordInputText">Old Password</label>
      </span>
      <p v-if="localState.oldPasswordError" class="text-red-500 text-xs italic text-left">Old password at least 8 characters</p>
    </div>
    <div class="md:w-[65%] mx-auto my-10 sm:w-full">
      <span class="p-float-label mb-2">
        <InputText id="NewPasswordInputText" type="password" v-model="newPasswordModel" class="w-full" required :class="{'p-invalid': localState.newPasswordError}"/>
        <label for="NewPasswordInputText">New Password</label>
      </span>
      <p v-if="localState.newPasswordError" class="text-red-500 text-xs italic text-left">New password can't be equal to old password</p>
    </div>
    <div class="text-right mr-5">
      <button class="bg-[#2B2E4A] rounded-full drop-shadow-lg text-white text-md h-9 w-[85px] opacity-40" :class="{ 'ableChange': !localState.disableChange }" :disabled="localState.disableChange">Change</button>
    </div>
  </form>
</template>

<style scoped lang="postcss">
.ableChange {
  @apply hover:bg-[#FF9000] transition ease-in-out opacity-100
}
</style>
