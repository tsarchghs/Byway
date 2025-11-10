<template>
  <a-space direction="vertical" size="large" style="width:100%">
    <a-typography-title :level="2">My Learning</a-typography-title>

    <a-card title="Continue learning">
      <a-row :gutter="[16,16]">
        <a-col v-for="c in courses" :key="c.id" :xs="24" :sm="12" :md="8">
          <a-card :title="c.title">
            <a-progress :percent="c.progress || 0" />
            <a-space>
              <NuxtLink :to="`/course/${c.id}`"><a-button type="primary">Continue</a-button></NuxtLink>
              <a-button @click="markComplete(c.id)">Mark complete</a-button>
            </a-space>
          </a-card>
        </a-col>
      </a-row>
    </a-card>

    <a-card title="Certificates">
      <a-list :data-source="certs">
        <template #renderItem="{ item }">
          <a-list-item>
            <a-space>
              <a-badge status="success" />
              <span>{{ item.title }}</span>
              <a-button type="link">Download</a-button>
            </a-space>
          </a-list-item>
        </template>
      </a-list>
    </a-card>
  </a-space>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
const courses = ref<any[]>([])
const certs = ref<any[]>([])

function markComplete(id:string){
  const idx = courses.value.findIndex(c=> c.id===id)
  if (idx>=0){
    courses.value[idx].progress = 100
    if (process.client){
      localStorage.setItem('byway_enrollments', JSON.stringify(courses.value))
    }
  }
}

onMounted(async()=>{
  if (process.client){
    courses.value = JSON.parse(localStorage.getItem('byway_enrollments') || '[]')
  }
  try{
    const res:any = await $fetch('/plugins/students-internal/api/certificates')
    certs.value = res.items || []
  }catch(e){
    certs.value = []
  }
})
</script>
