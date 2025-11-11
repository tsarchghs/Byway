
<template><div /></template>
<script setup lang="ts">
import { onMounted } from 'vue'
import { navigateTo } from '#app'
onMounted(()=> navigateTo('/dashboard'))
definePageMeta({ layout: 'student', alias: ['/student'] })
</script>
