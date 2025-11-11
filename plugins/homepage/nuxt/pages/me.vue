
<template><div /></template>
<script setup lang="ts">
import { onMounted } from 'vue'
import { navigateTo } from '#app'
onMounted(() => {
  try {
    const r = (/* TODO: replace with gqlFetch to proper query */ undefined && ('byway:role') || 'student').toLowerCase()
    const isGuest = !/* TODO: replace with gqlFetch to proper query */ undefined && ('byway:auth') && !document.cookie.includes('auth=')
    if (isGuest) return navigateTo('/auth/login')
    if (r === 'teacher' || r==='admin') return navigateTo('/teach')
    return navigateTo('/dashboard')
  } catch { navigateTo('/dashboard') }
})
definePageMeta({ alias: ['/me'] })
</script>
