<template>
  <div />
</template>
<script setup lang="ts">
import { onMounted } from 'vue'
import { navigateTo } from '#app'
onMounted(() => navigateTo('/courses-listing'))
definePageMeta({ alias: ['/courses'] })
</script>
