<template>
  <a-layout class="p-4 space-y-4">
    <a-card :bordered="false" title="Teacher · Gradebook">
      <a-input-search v-model:value="courseId" placeholder="Enter Course ID" enter-button="Load" @search="load" />
      <a-divider />
      <a-table :data-source="rows" :columns="cols" row-key="studentId" :loading="loading" />
      <template #extra>
        <a-space>
          <a-button @click="$router.push('/students-internal/gradebook')">Student Gradebook</a-button>
          <a-button @click="$router.push('/institutions')">Institutions</a-button>
        </a-space>
      </template>
    </a-card>
  </a-layout>
</template>
<script setup lang="ts">
import { ref } from 'vue'
const courseId = ref('')
const loading = ref(false)
const rows = ref<any[]>([])
const cols = [
  { title:'Student', dataIndex:['student','displayName'], key:'student' },
  { title:'Email', dataIndex:['student','email'], key:'email' },
  { title:'Progress', dataIndex:'progressPct', key:'progressPct', customRender:({text}:any)=> (text==null?'—':`${text}%`) },
  { title:'Last Activity', dataIndex:'lastActivity', key:'lastActivity' },
]
async function load(){
  if(!courseId.value) return
  loading.value = true
  try {
    const res = await fetch('/api/teach/graphql', {
      method: 'POST', headers: { 'content-type':'application/json' },
      body: JSON.stringify({ query: 'query($courseId:String!){ gradebook(courseId:$courseId){ student{ id displayName email } progressPct lastActivity } }', variables:{ courseId: courseId.value } })
    })
    const j = await res.json()
    rows.value = j?.data?.gradebook || []
  } finally { loading.value=false }
}
</script>
