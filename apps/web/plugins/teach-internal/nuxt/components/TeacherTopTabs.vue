
<template>
  <div class="top-tabs">
    <a-tabs :activeKey="active" @change="onChange">
      <a-tab-pane key="/teach" tab="Dashboard"/>
      <a-tab-pane key="/teach/courses" tab="Courses"/>
      <a-tab-pane key="/teach/modules" tab="Modules"/>
      <a-tab-pane key="/teach/assignments" tab="Assignments"/>
      <a-tab-pane key="/institutions" tab="Institutions"/>
      <a-tab-pane key="/teach/analytics" tab="Analytics"/>
    </a-tabs>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from '#imports'
const route = useRoute(); const router = useRouter()
const active = computed(() => {
  const p = route.path
  if (p.startsWith('/institutions')) return '/institutions'
  if (p.includes('/assign')) return '/teach/assignments'
  if (p.includes('/module')) return '/teach/modules'
  if (p.includes('/course')) return '/teach/courses'
  if (p.includes('/analytics')) return '/teach/analytics'
  return '/teach'
})
function onChange(k:string){ router.push(k) }
</script>

<style scoped>
.top-tabs{ background: var(--ant-color-bg-container); padding: 0 12px; border-bottom: 1px solid var(--ant-color-border); }
</style>
