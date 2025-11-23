
<template>
  <a-breadcrumb class="crumbs">
    <a-breadcrumb-item><NuxtLink to="/institutions">Institutions</NuxtLink></a-breadcrumb-item>
    <a-breadcrumb-item>{{ slug }}</a-breadcrumb-item>
    <a-breadcrumb-item v-if="page">{{ page }}</a-breadcrumb-item>
  </a-breadcrumb>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from '#imports'
const route = useRoute()
const slug = computed(() => (route.params?.slug as string) || '—')
const page = computed(() => (route.meta?.title as string) || 'Overview')
</script>
<style scoped>
.crumbs{ padding:8px 16px; }
</style>
