<template>
  <a-card :bordered="false" class="mb-4">
    <template #title>Overview</template>
    <a-row :gutter="[12,12]">
      <a-col :span="8"><a-statistic title="Enrolled Courses" :value="stats.courses"/></a-col>
      <a-col :span="8"><a-statistic title="Assignments Due" :value="stats.assignments"/></a-col>
      <a-col :span="8"><a-statistic title="Avg. Grade" :value="stats.avgGrade" suffix="%"/></a-col>
    </a-row>
  </a-card>
  <a-card :bordered="false" title="Recent Activity">
    <a-list :data-source="activity" :renderItem="renderItem"/>
  </a-card>
</template>
<script setup lang="ts">
const stats = reactive({ courses: 0, assignments: 0, avgGrade: 0 })
const activity = ref<{at:string, text:string}[]>([])
onMounted(async () => {
  try {
    const { data } = await $fetch('/api/students-internal/api/overview', { credentials: 'include' })
    stats.courses = data?.courses || 0
    stats.assignments = data?.assignments || 0
    stats.avgGrade = data?.avgGrade || 0
    activity.value = data?.activity || []
  } catch {}
})
const renderItem = (item:any) => h('div', {}, `${item.at} – ${item.text}`)
</script>
