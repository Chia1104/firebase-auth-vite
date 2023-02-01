<script setup>
import { defineProps } from 'vue'
import { useToast } from "primevue/usetoast";

defineProps({
  summary: String,
  detail: String,
})

const toast = useToast();
const showTemplate = (summary, detail) => {
  toast.add({severity: 'warn', summary: summary, detail: detail, group: 'bc'});
}
</script>

<template>

</template>

<style scoped>

</style>
