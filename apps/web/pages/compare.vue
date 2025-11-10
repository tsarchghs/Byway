<template>
  <a-space direction="vertical" size="large" style="width:100%">
    <a-typography-title :level="2">Compare courses</a-typography-title>
    <a-input v-model:value="idsStr" placeholder="Enter course IDs, comma separated (e.g., fe-1,fe-2)" />
    <a-button style="width:160px" @click="run">Compare</a-button>
    <a-table :columns="cols" :data-source="rows" :pagination="false" row-key="id" />
  </a-space>
</template>
<script setup lang="ts">
import { ref } from 'vue'
const idsStr = ref('')
const rows = ref<any[]>([])
const cols = [
  { title:'Course', dataIndex:'title' },
  { title:'Category', dataIndex:'category' },
  { title:'Price (€)', dataIndex:'price' },
  { title:'Lessons', dataIndex:'lessons' },
  { title:'Level', dataIndex:'level' },
  { title:'Rating', dataIndex:'rating' }
]
async function run(){
  const ids = idsStr.value.split(',').map(s=> s.trim()).filter(Boolean)
  const res:any = await $fetch('/plugins/students-internal/api/compare', { params: { ids: ids.join(',') } })
  rows.value = res.items || []
}
</script>
