<template>
  <div class="classroom-overview">
    <a-page-header :title="room?.title || room?.code || 'Classroom'" :sub-title="room?.id || classroomId">
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
          <a-button size="small" type="link" :href="`/institution/classrooms/${classroomId}?institutionId=${encodeURIComponent(institutionId)}`">Refresh</a-button>
          <a-button v-if="currentRole!=='student'" size="small" type="primary" :href="`/institution/classrooms/${classroomId}/attendance?institutionId=${encodeURIComponent(institutionId)}`">Attendance</a-button>
        </a-space>
      </template>
    </a-page-header>

    <a-skeleton :loading="loading" active :paragraph="{ rows: 8 }">
      <a-row :gutter="16">
        <a-col :span="16">
          <a-tabs v-model:activeKey="activeTab">
            <a-tab-pane key="overview" tab="Overview">
              <a-card size="small" title="Assignments">
                <a-table size="small" :columns="assignmentColumns" :dataSource="assignments" row-key="id">
                  <template #bodyCell="{ column, record }">
                    <template v-if="column.dataIndex==='title'">
                      <a :href="institution?.slug ? `/institutions/${institution.slug}/assignments/${record.id}/grading` : '#'">{{ record.title }}</a>
                    </template>
                  </template>
                </a-table>
              </a-card>
              <a-card size="small" title="Modules & Lessons" style="margin-top:16px">
                <a-table size="small" :columns="lessonColumns" :dataSource="lessons" row-key="id" />
              </a-card>
            </a-tab-pane>
            <a-tab-pane v-if="currentRole!=='student'" key="people" tab="People">
              <a-card size="small" title="Enrolled Students">
                <a-table size="small" :columns="studentColumns" :dataSource="students" row-key="studentId">
                  <template #bodyCell="{ column, record }">
                    <template v-if="column.dataIndex==='displayName'">
                      <a :href="`/institution/students/${record.studentId}?institutionId=${encodeURIComponent(institutionId)}`">{{ record.displayName || record.studentId }}</a>
                    </template>
                  </template>
                </a-table>
              </a-card>
            </a-tab-pane>
          </a-tabs>
        </a-col>
        <a-col :span="8">
          <a-card size="small" title="Classroom">
            <a-descriptions :column="1" size="small">
              <a-descriptions-item label="Institution">{{ institution?.name }}</a-descriptions-item>
              <a-descriptions-item label="Department">{{ department?.name || '—' }}</a-descriptions-item>
              <a-descriptions-item label="Teacher">{{ teacherLabel }}</a-descriptions-item>
              <a-descriptions-item label="Capacity">{{ room?.capacity ?? '—' }}</a-descriptions-item>
              <a-descriptions-item label="Status">{{ room?.status || '—' }}</a-descriptions-item>
            </a-descriptions>
          </a-card>
          <a-card size="small" title="Teach Course" style="margin-top:16px">
            <a-descriptions :column="1" size="small">
              <a-descriptions-item label="Bound">{{ classCourse?.bound ? 'Yes' : 'No' }}</a-descriptions-item>
              <a-descriptions-item v-if="classCourse?.bound" label="Title">{{ classCourse?.course?.title }}</a-descriptions-item>
              <a-descriptions-item v-if="classCourse?.bound" label="Modules">{{ classCourse?.moduleCount }}</a-descriptions-item>
              <a-descriptions-item v-if="classCourse?.bound" label="Lessons">{{ classCourse?.lessonCount }}</a-descriptions-item>
            </a-descriptions>
          </a-card>
        </a-col>
      </a-row>
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
const activeTab = ref<'overview' | 'people'>('overview')
const institution = ref<any | null>(null)
const department = ref<any | null>(null)
const room = ref<any | null>(null)
const assignments = ref<any[]>([])
const lessons = ref<any[]>([])
const students = ref<any[]>([])
const currentRole = ref<'student' | 'teacher' | 'admin' | 'none'>('none')
const meId = ref<string | null>(null)
const classCourse = ref<any | null>(null)

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
    const url = `${baseUrl}/api/institution-portal/classrooms/${encodeURIComponent(classroomId.value)}/overview?institutionId=${encodeURIComponent(institutionId.value)}`
    const resp = await fetch(url, { headers: { Authorization: auth } })
    if (!resp.ok) throw new Error(await resp.text().catch(() => `HTTP ${resp.status}`))
    const json = await resp.json()
    institution.value = json.institution || null
    department.value = json.department || null
    room.value = json.classroom || null
    assignments.value = json.assignments || []
    lessons.value = json.lessons || []
    students.value = json.students || []
    const agg = await fetch(`${baseUrl}/api/institution-portal/classrooms/${encodeURIComponent(classroomId.value)}/classroom-course`, { headers: { Authorization: auth } })
    const aggJson = await agg.json().catch(() => null)
    classCourse.value = aggJson || null
  } catch (e: any) {
    message.error(e?.message || 'Failed to load classroom')
  } finally {
    loading.value = false
  }
}

onMounted(load)
onMounted(resolveCurrentRole)

const teacherLabel = computed(() => room.value?.teacherDisplayName || room.value?.teacherId || '—')

const assignmentColumns = [
  { title: 'Title', dataIndex: 'title', key: 'title' },
  { title: 'Due', dataIndex: 'dueDate', key: 'dueDate' },
]

const lessonColumns = [
  { title: 'Module', dataIndex: 'moduleTitle', key: 'moduleTitle' },
  { title: 'Lesson', dataIndex: 'title', key: 'title' },
  { title: 'Type', dataIndex: 'type', key: 'type' },
]

const studentColumns = [
  { title: 'Student', dataIndex: 'displayName', key: 'displayName' },
  { title: 'Student ID', dataIndex: 'studentId', key: 'studentId' },
  { title: 'Status', dataIndex: 'status', key: 'status' },
]
function navHref(key: string) {
  const qs = `?institutionId=${encodeURIComponent(institutionId.value)}`
  if (currentRole.value !== 'admin' && key === 'departments') return `/institution/portal${qs}`
  if (currentRole.value === 'student' && key === 'assignments') return `/institution/portal${qs}`
  if (key==='overview') return `/institution/portal${qs}`
  if (key==='departments') return `/institution/departments/${encodeURIComponent((department.value?.id || ''))}${qs}`
  if (key==='classrooms') return `/institution/classrooms/${encodeURIComponent(classroomId.value)}${qs}`
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
.classroom-overview { padding: 16px; }
</style>
