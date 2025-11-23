
<template>
  <div class="top-tabs">
    <a-tabs :activeKey="active" @change="onChange">
      <a-tab-pane :key="base" tab="Overview"/>
      <a-tab-pane :key="base + '/courses'" tab="Courses"/>
      <a-tab-pane :key="base + '/classrooms'" tab="Classrooms"/>
      <a-tab-pane :key="base + '/assignments'" tab="Assignments"/>
      <a-tab-pane :key="base + '/analytics'" tab="Analytics"/>
      <a-tab-pane :key="base + '/settings'" tab="Settings"/>
    </a-tabs>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from '#imports'
const route = useRoute(); const router = useRouter()
const base = computed(() => `/institutions/${route.params?.slug || 'unknown'}`)
const active = computed(() => {
  const p = route.path
  if (p.includes('/courses')) return `${base.value}/courses`
  if (p.includes('/classrooms')) return `${base.value}/classrooms`
  if (p.includes('/assignments')) return `${base.value}/assignments`
  if (p.includes('/analytics')) return `${base.value}/analytics`
  if (p.includes('/settings')) return `${base.value}/settings`
  return base.value
})
function onChange(k:string){ router.push(k) }
</script>
<style scoped>
.top-tabs{ background: var(--ant-color-bg-container); padding: 0 12px; border-bottom: 1px solid var(--ant-color-border); }
</style>
