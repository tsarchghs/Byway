
<template>
  <a-layout class="p-4">
    <a-page-header title="Analytics" sub-title="Engagement & performance">
      <template #extra><a-button href="/teach">Dashboard</a-button></template>
    </a-page-header>
    <div class="p-2">
      <a-statistic title="Students" :value="metrics?.students || 0" />
      <a-statistic title="Submissions" :value="metrics?.submissions || 0" />
      <a-statistic title="Avg Grade" :value="metrics?.avg || 0" suffix="%" />
    </div>
    <a-skeleton active :paragraph="{rows:6}" />
  </a-layout>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'

const metrics = ref<any>({ students:0, submissions:0, avg:0 })
const { call, endpoints } = useGql()
onMounted(async () => { try { const q = `query { teacherAnalytics { students submissions avg } }`; const d:any = await call(endpoints.teachInternal, q); metrics.value = d?.teacherAnalytics || metrics.value } catch {} })
import { useGql } from '#shared/composables/useGql.ts'
definePageMeta({ layout:'teacher', title:'Analytics' })
</script>
