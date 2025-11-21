<template>
  <div class="student-record">
    <a-page-header :title="displayName" :sub-title="studentId">
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
          <a-button size="small" @click="load">Reload</a-button>
        </a-space>
      </template>
    </a-page-header>

    <a-skeleton v-if="canView" :loading="loading" active :paragraph="{ rows: 8 }">
      <a-row :gutter="16">
        <a-col :span="16">
          <a-card size="small" title="Courses">
            <a-table size="small" :columns="courseColumns" :dataSource="courses" row-key="courseId">
              <template #bodyCell="{ column, record }">
                <template v-if="column.dataIndex==='title'">
                  <a :href="`/teach-internal/${encodeURIComponent(record.teacherId || 'teacher')}`">{{ record.title }}</a>
                </template>
              </template>
            </a-table>
          </a-card>
          <a-card size="small" title="Gradebook" style="margin-top:16px">
            <a-table size="small" :columns="gradeColumns" :dataSource="grades" row-key="id" />
          </a-card>
        </a-col>
        <a-col :span="8">
          <a-card size="small" title="Summary">
            <a-statistic title="Courses" :value="courses.length" />
            <a-statistic title="Average Progress" :value="avgProgress" suffix="%" style="margin-top:8px" />
          </a-card>
        </a-col>
      </a-row>
    </a-skeleton>
    <a-result v-else status="403" title="Not allowed" sub-title="Access restricted to admin and assigned teachers; students may view only their own record.">
      <template #extra>
        <a-button type="primary" :href="navHref('overview')">Go to portal</a-button>
      </template>
    </a-result>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRuntimeConfig } from '#imports'
import { message } from 'ant-design-vue'

const route = useRoute()
const runtime = useRuntimeConfig()
const apiBase = runtime.public?.apiBase || runtime.public?.appBaseUrl || ''

const studentId = computed(() => String(route.params.studentId || route.params.id || ''))
const institutionId = computed(() => (route.query.institutionId as string) || (route.params?.institution_id as string) || 'inst_byway')

const loading = ref(true)
const courses = ref<any[]>([])
const grades = ref<any[]>([])
const student = ref<any | null>(null)
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
    const url = `${baseUrl}/api/institution-portal/students/${encodeURIComponent(studentId.value)}/record?institutionId=${encodeURIComponent(institutionId.value)}`
    const resp = await fetch(url, { headers: { Authorization: auth } })
    if (!resp.ok) throw new Error(await resp.text().catch(() => `HTTP ${resp.status}`))
    const json = await resp.json()
    courses.value = json.courses || []
    grades.value = json.gradebook || []
    student.value = json.student || null
  } catch (e: any) {
    message.error(e?.message || 'Failed to load record')
  } finally {
    loading.value = false
  }
}

onMounted(load)
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

onMounted(() => { resolveCurrentRole() })

const displayName = computed(() => student.value?.displayName || 'Student')
const avgProgress = computed(() => {
  if (!courses.value.length) return 0
  const sum = courses.value.reduce((acc, c) => acc + (c.progressPct || 0), 0)
  return Math.round(sum / courses.value.length)
})

const canView = computed(() => {
  if (currentRole.value === 'admin') return true
  if (currentRole.value === 'teacher') return teacherStudentIds.value.has(String(studentId.value))
  if (currentRole.value === 'student') return !!meId.value && studentId.value === meId.value
  return false
})

const courseColumns = [
  { title: 'Course', dataIndex: 'title', key: 'title' },
  { title: 'Progress', dataIndex: 'progressPct', key: 'progressPct' },
  { title: 'Completed', dataIndex: 'completed', key: 'completed' },
]

const gradeColumns = [
  { title: 'Course', dataIndex: 'courseTitle', key: 'courseTitle' },
  { title: 'Score', dataIndex: 'grade', key: 'grade' },
  { title: 'Feedback', dataIndex: 'feedback', key: 'feedback' },
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
</script>

<style scoped>
.student-record { padding: 16px; }
</style>