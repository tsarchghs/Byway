<template>
  <a-layout class="p-4 space-y-4">
    <TopNav />
    <a-card :bordered="false" title="Student Dashboard">
      <a-row :gutter="[16,16]">
        <a-col :xs="24" :md="12">
          <a-card size="small" title="My Enrollments">
            <a-spin :spinning="loading">
              <a-empty v-if="!loading && enrollments.length===0" description="No enrollments yet" />
              <a-list v-else :data-source="enrollments" :renderItem="renderEnrollment" />
            </a-spin>
            <template #extra><a-button type="link" @click="$router.push('/students-internal/enrollments')">View all</a-button></template>
          </a-card>
        </a-col>
        <a-col :xs="24" :md="12">
          <a-card size="small" title="Quick Actions">
            <a-space>
              <a-button @click="$router.push('/explore')">Explore Courses</a-button>
              <a-button @click="$router.push('/students-internal/gradebook')">My Gradebook</a-button>
            </a-space>
          </a-card>
        </a-col>
      </a-row>
    </a-card>
  </a-layout>
</template>
<script setup lang="ts">
import TopNav from '../components/TopNav.vue'
import { ref, onMounted, h } from 'vue'
const loading = ref(false)
const enrollments = ref<any[]>([])
async function load(){
  loading.value = true
  try {
    const res = await fetch('/api/students-internal/graphql', {
      method: 'POST', headers: { 'content-type':'application/json' },
      body: JSON.stringify({ query: 'query { myEnrollments { courseId title progressPct lastActivity } }' })
    })
    const j = await res.json()
    enrollments.value = j?.data?.myEnrollments || []
  } finally { loading.value=false }
}
function renderEnrollment(item:any){
  return h('div', { class:'flex items-center justify-between py-2' }, [
    h('div', {}, `${item.title || 'Course'} · ${item.courseId}`),
    h('div', {}, `${item.progressPct}%`)
  ])
}
onMounted(load)
</script>
