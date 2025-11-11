<template>
  <a-layout class="p-6">
    <a-page-header
      title="Gradebook"
      :sub-title="me?.role ? `Role: ${me.role}` : '—'"
    >
      <template #breadcrumb>
        <a-breadcrumb>
          <a-breadcrumb-item>Home</a-breadcrumb-item>
          <a-breadcrumb-item>Students</a-breadcrumb-item>
          <a-breadcrumb-item>Gradebook</a-breadcrumb-item>
        </a-breadcrumb>
      </template>
      <template #extra>
        <a-space>
          <a-button @click="$router.push('/explore')">Explore</a-button>
          <a-button @click="$router.push('/dashboard')">Dashboard</a-button>
        </a-space>
      </template>
    </a-page-header>

    <div class="grid md:grid-cols-4 gap-3 mb-4">
      <a-card size="small" title="Courses"><div class="text-xl">{{ overview?.totalCourses ?? '—' }}</div></a-card>
      <a-card size="small" title="Assignments"><div class="text-xl">{{ overview?.totalAssignments ?? '—' }}</div></a-card>
      <a-card size="small" title="Submitted"><div class="text-xl">{{ overview?.submitted ?? '—' }}</div></a-card>
      <a-card size="small" title="Graded"><div class="text-xl">{{ overview?.graded ?? '—' }}</div></a-card>
    </div>

    <a-card :bordered="false">
      <a-tabs v-model:activeKey="tab">
        <a-tab-pane key="by-course" tab="By Course">
          <a-table :data-source="rows" :columns="cols" row-key="id" :loading="loading" />
        </a-tab-pane>
        <a-tab-pane key="analytics" tab="Analytics">
          <a-empty description="Charts coming soon" />
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </a-layout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

const loading = ref(true)
const tab = ref('by-course')
const me = ref<any>(null)
const overview = ref<any>(null)
const rows = ref<any[]>([])

const cols = [
  { title: 'Course', dataIndex: 'courseTitle', key: 'courseTitle' },
  { title: 'Score', dataIndex: 'score', key: 'score' },
  { title: 'Status', dataIndex: 'status', key: 'status' },
  { title: 'Updated', dataIndex: 'updatedAt', key: 'updatedAt' },
]

async function gql(endpoint: string, query: string, variables: any = {}) {
  const headers: any = { 'content-type': 'application/json' }
  const token = (globalThis as any).__AUTH_TOKEN || ''
  if (token) headers['authorization'] = `Bearer ${token}`
  const res = await fetch(endpoint, { method: 'POST', headers, body: JSON.stringify({ query, variables }) })
  const j = await res.json().catch(() => ({}))
  if (j.errors) throw new Error(j.errors.map((e:any)=>e.message).join('; '))
  return j.data
}

onMounted(async () => {
  try {
    const { me: m } = await gql('/api/authentication/graphql', `query { me { id email role uiPrefs } }`)
    me.value = m
  } catch {}
  try {
    const data = await gql('/api/students-internal/graphql', `
      query GB($studentId:String){
        gradebookOverview(studentId:$studentId){ totalCourses totalAssignments submitted graded }
        gradebook(studentId:$studentId){ id courseId courseTitle studentId studentName score status updatedAt }
      }`, { studentId: me.value?.id })
    overview.value = data?.gradebookOverview
    rows.value = data?.gradebook || []
  } catch (e) {
    console.warn('[gradebook] graphql error', (e as any)?.message || e)
    rows.value = []
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.text-xl { font-size: 1.25rem; }
</style>
