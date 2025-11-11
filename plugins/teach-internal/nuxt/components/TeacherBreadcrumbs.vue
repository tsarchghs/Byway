
<template>
  <a-breadcrumb class="crumbs">
    <a-breadcrumb-item><NuxtLink to="/teach">Teacher</NuxtLink></a-breadcrumb-item>
    <a-breadcrumb-item v-if="context">{{ context }}</a-breadcrumb-item>
    <a-breadcrumb-item v-if="title">{{ title }}</a-breadcrumb-item>
  </a-breadcrumb>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from '#imports'
const route = useRoute()
const context = computed(() => {
  const p = route.path
  if (p.startsWith('/institutions')) return 'Institutions'
  if (p.includes('/assign')) return 'Assignments'
  if (p.includes('/module')) return 'Modules'
  if (p.includes('/course')) return 'Courses'
  if (p.includes('/analytics')) return 'Analytics'
  return ''
})
const title = computed(() => (route.meta?.title as string) || route.params?.id || route.params?.slug || '')
</script>

<style scoped>
.crumbs { padding: 8px 16px; }
</style>
