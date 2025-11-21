<template>
  <div class="attendance-view">
    <a-page-header :title="room?.title || room?.code || 'Classroom Attendance'" :sub-title="classroomId">
      <template #extra>
        <a-space>
          <a-button size="small" @click="load">Reload</a-button>
        </a-space>
      </template>
    </a-page-header>

    <a-skeleton :loading="loading" active :paragraph="{ rows: 8 }">
      <a-card size="small" title="Roster">
        <a-table size="small" :columns="columns" :dataSource="rows" row-key="studentId" />
      </a-card>
    </a-skeleton>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRuntimeConfig } from '#imports'
import { message } from 'ant-design-vue'

const route = useRoute()
const runtime = useRuntimeConfig()
const apiBase = runtime.public?.apiBase || runtime.public?.appBaseUrl || ''

const classroomId = computed(() => String(route.params.classroomId || route.params.id || ''))
const institutionId = computed(() => (route.query.institutionId as string) || (route.params?.institution_id as string) || 'inst_byway')

const loading = ref(true)
const room = ref<any | null>(null)
const rows = ref<any[]>([])

function resolveAuthHeader(): string | null {
  if (typeof window === 'undefined') return null
  const rawToken = localStorage.getItem('token') || localStorage.getItem('access_token') || ''
  if (!rawToken) return null
  return rawToken.startsWith('Bearer') ? rawToken : `Bearer ${rawToken}`
}

async function load() {
  loading.value = true
  try {
    const auth = resolveAuthHeader()
    if (!auth) throw new Error('Missing auth token')
    const baseUrl = apiBase ? apiBase.replace(/\/$/, '') : ''
    const url = `${baseUrl}/api/institution-portal/classrooms/${encodeURIComponent(classroomId.value)}/attendance?institutionId=${encodeURIComponent(institutionId.value)}`
    const resp = await fetch(url, { headers: { Authorization: auth } })
    if (!resp.ok) throw new Error(await resp.text().catch(() => `HTTP ${resp.status}`))
    const json = await resp.json()
    room.value = json.classroom || null
    rows.value = json.roster || []
  } catch (e: any) {
    message.error(e?.message || 'Failed to load attendance')
  } finally {
    loading.value = false
  }
}

onMounted(load)

const columns = [
  { title: 'Student', dataIndex: 'studentId', key: 'studentId' },
  { title: 'Status', dataIndex: 'status', key: 'status' },
  { title: 'Assignments Submitted', dataIndex: 'submissions', key: 'submissions' },
  { title: 'Avg Grade', dataIndex: 'avgGrade', key: 'avgGrade' },
]
</script>

<style scoped>
.attendance-view { padding: 16px; }
</style>