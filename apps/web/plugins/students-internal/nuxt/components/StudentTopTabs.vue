
<template>
  <div class="top-tabs">
    <a-tabs :activeKey="active" @change="onChange">
      <a-tab-pane key="/dashboard" tab="Dashboard"/>
      <a-tab-pane key="/courses" tab="My Courses"/>
      <a-tab-pane key="/gradebook" tab="Gradebook"/>
      <a-tab-pane key="/assignments" tab="Assignments"/>
      <a-tab-pane key="/classrooms" tab="Classrooms"/>
      <a-tab-pane key="/progress" tab="Progress"/>
    </a-tabs>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from '#imports'
const route = useRoute(); const router = useRouter()
const active = computed(() => {
  const p = route.path
  if (p.startsWith('/modules') || p.startsWith('/module')) return '/progress'
  if (p.startsWith('/gradebook')) return '/gradebook'
  if (p.startsWith('/assignments')) return '/assignments'
  if (p.startsWith('/classrooms')) return '/classrooms'
  if (p.startsWith('/courses')) return '/courses'
  return '/dashboard'
})
function onChange(k:string){ router.push(k) }
</script>

<style scoped>
.top-tabs{ background: var(--ant-color-bg-container); padding: 0 12px; border-bottom: 1px solid var(--ant-color-border); }
</style>
