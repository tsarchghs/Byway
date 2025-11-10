<template>
  <a-space direction="vertical" size="large" style="width:100%">
    <a-page-header title="Reports" sub-title="Key metrics">
      <template #extra><a-button @click="refresh">Refresh</a-button></template>
    </a-page-header>
    <a-row :gutter="[16,16]">
      <a-col :xs="24" :md="8"><a-card title="Enrollments (7d)"><pre>{{ data.enrollments7d }}</pre></a-card></a-col>
      <a-col :xs="24" :md="8"><a-card title="Revenue (7d)"><pre>{{ data.revenue7d }}</pre></a-card></a-col>
      <a-col :xs="24" :md="8"><a-card title="Active users (7d)"><pre>{{ data.activeUsers7d }}</pre></a-card></a-col>
    </a-row>
  </a-space>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
const data = ref<any>({})
async function load(){ data.value = await $fetch('/plugins/students-internal/api/reports') }
function refresh(){ load() }
onMounted(load)
</script>
