<template>
  <div class="people-directory">
    <a-page-header title="Institution People Directory">
      <template #extra>
        <a-space>
          <a-menu mode="horizontal" :selectedKeys="['people']">
            <a-menu-item key="overview"><a :href="navHref('overview')">Overview</a></a-menu-item>
            <a-menu-item v-if="currentRole==='admin'" key="departments"><a :href="navHref('departments')">Departments</a></a-menu-item>
            <a-menu-item key="classrooms"><a :href="navHref('classrooms')">Classrooms</a></a-menu-item>
            <a-menu-item key="people"><a :href="navHref('people')">People Directory</a></a-menu-item>
            <a-menu-item key="catalog"><a :href="navHref('catalog')">Catalog</a></a-menu-item>
            <a-menu-item key="calendar"><a :href="navHref('calendar')">Calendar</a></a-menu-item>
            <a-menu-item key="assignments"><a :href="navHref('assignments')">Assignments</a></a-menu-item>
          </a-menu>
          <a-select v-model:value="roleFilter" :options="roleOptions" allow-clear placeholder="Filter by role" style="width:180px" />
          <a-button size="small" @click="load">Reload</a-button>
        </a-space>
      </template>
    </a-page-header>

    <a-skeleton :loading="loading" active :paragraph="{ rows: 8 }">
      <a-card size="small">
        <a-table size="small" :columns="columns" :dataSource="filtered" row-key="id">
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex==='userId'">
              <a :href="`/institution/students/${record.userId}?institutionId=${encodeURIComponent(institutionId)}`">{{ record.userId }}</a>
            </template>
          </template>
        </a-table>
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

const institutionId = computed(() => (route.query.institutionId as string) || (route.params?.institution_id as string) || 'inst_byway')
const loading = ref(true)
const members = ref<any[]>([])
const roleFilter = ref<string | undefined>(undefined)
const currentRole = ref<'student' | 'teacher' | 'admin' | 'none'>('none')
const meId = ref<string | null>(null)
const teacherStudentIds = ref<Set<string>>(new Set())

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
    const url = `${baseUrl}/api/institution-portal/people?institutionId=${encodeURIComponent(institutionId.value)}`
    const resp = await fetch(url, { headers: { Authorization: auth } })
    if (!resp.ok) throw new Error(await resp.text().catch(() => `HTTP ${resp.status}`))
    const json = await resp.json()
    members.value = json.members || []
  } catch (e: any) {
    message.error(e?.message || 'Failed to load directory')
  } finally {
    loading.value = false
  }
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
  if (currentRole.value === 'teacher') await loadTeacherRoster()
} catch {}
}

onMounted(async () => {
  await load()
  await resolveCurrentRole()
})

const filtered = computed(() => {
  let base = members.value
  if (currentRole.value === 'student') {
    base = base.filter((m) => m.role === 'student')
  } else if (currentRole.value === 'teacher') {
    base = base.filter((m) => m.role === 'student' && teacherStudentIds.value.has(String(m.userId)))
  }
  return base.filter((m) => (roleFilter.value ? m.role === roleFilter.value : true))
})
const roleOptions = [
  { label: 'Student', value: 'student' },
  { label: 'Teacher', value: 'teacher' },
  { label: 'Admin', value: 'admin' },
]

const columns = [
  { title: 'User ID', dataIndex: 'userId', key: 'userId' },
  { title: 'Role', dataIndex: 'role', key: 'role' },
  { title: 'Status', dataIndex: 'status', key: 'status' },
  { title: 'Classrooms', dataIndex: 'classroomCount', key: 'classroomCount' },
]
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
async function loadTeacherRoster() {
  try {
    const auth = resolveAuthHeader()
    if (!auth) return
    const baseUrl = apiBase ? apiBase.replace(/\/$/, '') : ''
    const resp = await fetch(`${baseUrl}/api/institution-portal/teacher-dashboard?institutionId=${encodeURIComponent(institutionId.value)}`, { headers: { Authorization: auth } })
    const json = await resp.json().catch(() => null)
    const rooms = Array.isArray(json?.classrooms) ? json.classrooms : []
    const ids = new Set<string>()
    rooms.forEach((room: any) => {
      const enrollments = Array.isArray(room?.enrollments) ? room.enrollments : []
      enrollments.forEach((e: any) => { if (e?.studentId) ids.add(String(e.studentId)) })
    })
    teacherStudentIds.value = ids
  } catch {}
}
</script>

<style scoped>
.people-directory { padding: 16px; }
</style>