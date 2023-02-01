<script setup>
import ProfileCard from '../components/ProfileCard.vue'
import ChangePasswordCard from "../components/ChangePasswordCard.vue";
import Message from "../components/Message.vue";
import { useStore } from 'vuex';
import { computed } from 'vue';

const store = useStore()
const isShow = computed(() => store.state.actionSheet.changePasswordSheet.isShow)
const changePasswordState = store.state.auth.changePassword

</script>

<template>
  <div class="flex flex-col items-center">
    <div class="container mx-auto">
      <ProfileCard />
      <Transition>
        <ChangePasswordCard v-if="isShow" />
      </Transition>
    </div>
    <Message
        :success="changePasswordState.isSuccess"
        successMsg="Change Password Success"
        :warning="changePasswordState.isError"
        :warningMsg="changePasswordState.errorMessage"
    />
  </div>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
