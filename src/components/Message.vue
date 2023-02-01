<script setup>
import { defineProps } from 'vue'
import Message from 'primevue/message';

defineProps({
  error: Boolean,
  errorMsg: String,
  warning: Boolean,
  warningMsg: String,
  info: Boolean,
  infoMsg: String,
  success: Boolean,
  successMsg: String,
})

</script>

<template>
  <div class="bottom-10 md:right-10 fixed md:w-[500px] sm:w-[300px] sm:mx-auto">
    <Message severity="success" v-if="success" :life="3000" :sticky="false">
      {{successMsg || 'Success Message Content'}}
    </Message>
    <Message severity="info" v-if="info" :life="3000" :sticky="false">
      {{infoMsg || 'Info Message Content'}}
    </Message>
    <Message severity="warn" v-if="warning" :life="3000" :sticky="false">
      {{warningMsg || 'Warning Message Content'}}
    </Message>
    <Message severity="error" v-if="error" :life="3000" :sticky="false">
      {{errorMsg || 'Error Message Content'}}
    </Message>
  </div>
</template>
