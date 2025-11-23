<template>
  <div class="attendance-view">
    <a-page-header :title="room?.title || room?.code || 'Classroom Attendance'" :sub-title="classroomId">
      <template #extra>
        <a-space>
          <a-menu mode="horizontal" :selectedKeys="['classrooms']">
            <a-menu-item key="overview"><a :href="navHref('overview')">Overview</a></a-menu-item>
            <a-menu-item v-if="currentRole==='admin'" key="departments"><a :href="navHref('departments')">Departments</a></a-menu-item>
            <a-menu-item key="classrooms"><a :href="navHref('classrooms')">Classrooms</a></a-menu-item>
            <a-menu-item key="people"><a :href="navHref('people')">People Directory</a></a-menu-item>
            <a-menu-item key="catalog"><a :href="navHref('catalog')">Catalog</a></a-menu-item>
            <a-menu-item key="calendar"><a :href="navHref('calendar')">Calendar</a></a-menu-item>
            <a-menu-item key="assignments"><a :href="navHref('assignments')">Assignments</a></a-menu-item>
          </a-menu>
          <a-button size="small" @click="load">Reload</a-button>
        </a-space>
      </template>
    </a-page-header>

    <a-skeleton :loading="loading" active :paragraph="{ rows: 8 }">
      <a-card size="small" title="Roster" v-if="currentRole!=='student'">
        <a-table size="small" :columns="columns" :dataSource="rows" row-key="studentId">
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex==='studentId'">
              <a :href="`/institution/students/${record.studentId}?institutionId=${encodeURIComponent(institutionId)}`">{{ record.studentId }}</a>
            </template>
          </template>
        </a-table>
      </a-card>
      <a-card size="small" title="My Attendance Summary" v-else>
        <template v-if="meRow">
          <a-descriptions :column="1" size="small">
            <a-descriptions-item label="Student">{{ meRow.studentId }}</a-descriptions-item>
            <a-descriptions-item label="Status">{{ meRow.status }}</a-descriptions-item>
            <a-descriptions-item label="Submissions">{{ meRow.submissions }}</a-descriptions-item>
            <a-descriptions-item label="Avg Grade">{{ meRow.avgGrade }}</a-descriptions-item>
          </a-descriptions>
        </template>
        <a-empty v-else description="No attendance records for you in this classroom" />
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
const currentRole = ref<'student' | 'teacher' | 'admin' | 'none'>('none')
const meId = ref<string | null>(null)

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
onMounted(resolveCurrentRole)

const columns = [
  { title: 'Student', dataIndex: 'studentId', key: 'studentId' },
  { title: 'Status', dataIndex: 'status', key: 'status' },
  { title: 'Assignments Submitted', dataIndex: 'submissions', key: 'submissions' },
  { title: 'Avg Grade', dataIndex: 'avgGrade', key: 'avgGrade' },
]

const meRow = computed(() =>
  rows.value.find((r) => r.studentId === meId.value) || null,
)

function navHref(key: string) {
  const qs = `?institutionId=${encodeURIComponent(institutionId.value)}`
  if (key==='overview') return `/institution/portal${qs}`
  if (key==='departments') return `/institution/departments/${qs}`
  if (key==='classrooms') return `/institution/classrooms/${qs}`
  if (key==='people') return `/institution/people${qs}`
  if (key==='catalog') return `/institution/catalog${qs}`
  if (key==='calendar') return `/institution/calendar${qs}`
  if (key==='assignments') return `/institution/assignments/teachers${qs}`
  return `/institution/portal${qs}`
}

async function resolveCurrentRole() {
  try {
    const auth = resolveAuthHeader()
    if (!auth) return
    const baseUrl = apiBase ? apiBase.replace(/\/$/, '') : ''
    const meResp = await fetch(`${baseUrl}/api/authentication/graphql`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', Authorization: auth },
      body: JSON.stringify({ query: `query Me { me { id } }` }),
    })
    const meJson = await meResp.json().catch(() => null)
    const uid = meJson?.data?.me?.id || null
    meId.value = uid
    if (!uid) { currentRole.value = 'none'; return }
    const resp = await fetch(`${baseUrl}/api/institutions/graphql`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', Authorization: auth },
      body: JSON.stringify({
        query: `query($institutionId:String!){ members(institutionId:$institutionId){ userId role } }`,
        variables: { institutionId: institutionId.value },
      }),
    })
    const json = await resp.json().catch(() => null)
    const arr = Array.isArray(json?.data?.members) ? json.data.members : []
    const mem = arr.find((m: any) => m.userId === uid)
    const role = String(mem?.role || '').toLowerCase()
    if (role.includes('admin')) currentRole.value = 'admin'
    else if (role.includes('teach')) currentRole.value = 'teacher'
    else if (role.includes('student')) currentRole.value = 'student'
    else currentRole.value = 'none'
  } catch {}
}
</script>

<style scoped>
.attendance-view { padding: 16px; }
</style>