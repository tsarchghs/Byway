<template>
  <div class="institution-cockpit">
    <a-page-header :title="title" :sub-title="subtitle">
      <template #extra>
        <a-space>
          <a-menu mode="horizontal" :selectedKeys="['overview']">
            <a-menu-item key="overview"><a :href="navHref('overview')">Overview</a></a-menu-item>
            <a-menu-item v-if="currentRole==='admin'" key="departments"><a :href="navHref('departments')">Departments</a></a-menu-item>
            <a-menu-item key="classrooms"><a :href="navHref('classrooms')">Classrooms</a></a-menu-item>
            <a-menu-item key="people"><a :href="navHref('people')">People Directory</a></a-menu-item>
            <a-menu-item key="catalog"><a :href="navHref('catalog')">Catalog</a></a-menu-item>
            <a-menu-item key="calendar"><a :href="navHref('calendar')">Calendar</a></a-menu-item>
            <a-menu-item key="assignments"><a :href="navHref('assignments')">Assignments</a></a-menu-item>
          </a-menu>
          <a-segmented v-model:value="activeRole" :options="roles" />
          <a-button size="small" @click="load">Reload</a-button>
          <a-button size="small" :href="'/institution/join'">Join Institution</a-button>
        </a-space>
      </template>
    </a-page-header>

    <a-skeleton :loading="loading" active :paragraph="{ rows: 8 }">
      <a-row :gutter="16">
        <a-col :span="16">
          <a-card :title="mainTitle" size="small">
            <a-tabs v-model:activeKey="activeTab">
              <a-tab-pane key="overview" tab="Overview">
                <a-row :gutter="16">
                  <a-col :span="8">
                    <a-statistic title="Departments" :value="stats.departments" />
                  </a-col>
                  <a-col :span="8">
                    <a-statistic title="Classrooms" :value="stats.classrooms" />
                  </a-col>
                  <a-col :span="8">
                    <a-statistic title="Members" :value="stats.members" />
                  </a-col>
                </a-row>
                <a-divider />
                <a-list size="small" :data-source="overviewItems">
                  <template #renderItem="{ item }">
                    <a-list-item>
                      <div class="row-item">
                        <span class="row-title">{{ item.title }}</span>
                        <span class="row-meta">{{ item.meta }}</span>
                      </div>
                    </a-list-item>
                  </template>
                </a-list>
              </a-tab-pane>

              <a-tab-pane key="classrooms" tab="Classrooms">
                <a-table size="small" :columns="classroomColumns" :dataSource="classrooms" row-key="id">
                  <template #bodyCell="{ column, record }">
                    <template v-if="column.dataIndex==='title'">
                      <a :href="`/institution/classrooms/${record.id}?institutionId=${encodeURIComponent(institutionId)}`">{{ record.title || record.code }}</a>
                    </template>
                  </template>
                </a-table>
              </a-tab-pane>

              <a-tab-pane v-if="activeRole==='student'" key="courses" tab="Courses">
                <a-table size="small" :columns="courseColumns" :dataSource="courses" row-key="courseId" />
              </a-tab-pane>

              <a-tab-pane v-if="activeRole==='teacher'" key="assignments" tab="Assignments">
                <a-table size="small" :columns="assignmentColumns" :dataSource="assignments" row-key="id" />
              </a-tab-pane>
            </a-tabs>
          </a-card>
        </a-col>
        <a-col :span="8">
          <a-card size="small" title="Quick Links">
            <a-space direction="vertical" style="width:100%">
              <a-button type="link" :href="`/institution/catalog`">Course Catalog</a-button>
              <a-button type="link" :href="`/institution/people`">People Directory</a-button>
              <a-button v-if="currentRole!=='student'" type="link" :href="`/institution/assignments/teachers`">Teacher Assignments</a-button>
            </a-space>
          </a-card>
          <a-card size="small" title="Institution" style="margin-top:16px">
            <a-descriptions :column="1" size="small">
              <a-descriptions-item label="Name">{{ institution?.name }}</a-descriptions-item>
              <a-descriptions-item label="Slug">{{ institution?.slug }}</a-descriptions-item>
              <a-descriptions-item label="Type">{{ institution?.type || '—' }}</a-descriptions-item>
              <a-descriptions-item label="Location">{{ institution?.location || '—' }}</a-descriptions-item>
            </a-descriptions>
          </a-card>
        </a-col>
      </a-row>
    </a-skeleton>
  </div>
 </template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRuntimeConfig } from '#imports'
import { message } from 'ant-design-vue'
function navHref(key: string) {
  const qs = `?institutionId=${encodeURIComponent(institutionId.value)}`
  const firstClassroomId = classrooms.value[0]?.id
  const firstDepartmentId = classrooms.value.find((c) => c.departmentId)?.departmentId
  if (key==='overview') return `/institution/portal${qs}`
  if (key==='departments') return firstDepartmentId ? `/institution/departments/${encodeURIComponent(firstDepartmentId)}${qs}` : `/institution/portal${qs}`
  if (key==='classrooms') return firstClassroomId ? `/institution/classrooms/${encodeURIComponent(firstClassroomId)}${qs}` : `/institution/portal${qs}`
  if (key==='people') return `/institution/people${qs}`
  if (key==='catalog') return `/institution/catalog${qs}`
  if (key==='calendar') return `/institution/calendar${qs}`
  if (key==='assignments') return `/institution/assignments/teachers${qs}`
  return `/institution/portal${qs}`
}
type Role = 'student' | 'teacher' | 'admin'

const roles = ['student', 'teacher', 'admin']
const route = useRoute()
const runtime = useRuntimeConfig()
const apiBase = runtime.public?.apiBase || runtime.public?.appBaseUrl || ''

const institutionId = computed(() => (route.query.institutionId as string) || (route.params?.institution_id as string) || 'inst_byway')

const activeRole = ref<Role>('student')
const currentRole = ref<'student' | 'teacher' | 'admin' | 'none'>('none')
const meId = ref<string | null>(null)
const activeTab = ref<'overview' | 'classrooms' | 'courses' | 'assignments'>('overview')
const loading = ref(true)
const institution = ref<any | null>(null)
const stats = ref({ departments: 0, classrooms: 0, members: 0 })
const classrooms = ref<any[]>([])
const courses = ref<any[]>([])
const assignments = ref<any[]>([])
const overviewItems = ref<any[]>([])

function resolveAuthHeader(): string | null {
  if (typeof window === 'undefined') return null
  const rawToken = localStorage.getItem('token') || localStorage.getItem('access_token') || ''
  if (!rawToken) return null
  return rawToken.startsWith('Bearer') ? rawToken : `Bearer ${rawToken}`
}

const title = computed(() => 'Institution Portal')
const subtitle = computed(() => activeRole.value.charAt(0).toUpperCase() + activeRole.value.slice(1))
const mainTitle = computed(() => (activeRole.value === 'student' ? 'Student Dashboard' : activeRole.value === 'teacher' ? 'Teacher Dashboard' : 'Admin Dashboard'))

async function load() {
  loading.value = true
  try {
    const auth = resolveAuthHeader()
    if (!auth) throw new Error('Missing auth token')
    const baseUrl = apiBase ? apiBase.replace(/\/$/, '') : ''
    const path = activeRole.value === 'student' ? '/api/institution-portal/student-dashboard' : activeRole.value === 'teacher' ? '/api/institution-portal/teacher-dashboard' : '/api/institution-portal/admin-dashboard'
    const params = new URLSearchParams()
    params.set('institutionId', institutionId.value)
    const url = `${baseUrl}${path}?${params.toString()}`
    const resp = await fetch(url, { headers: { Authorization: auth } })
    if (!resp.ok) throw new Error(await resp.text().catch(() => `HTTP ${resp.status}`))
    const json = await resp.json()
    institution.value = json.institution || null
    stats.value = json.stats || stats.value
    classrooms.value = json.classrooms || []
    courses.value = json.courses || []
    assignments.value = json.assignments || []
    overviewItems.value = json.overview || []
  } catch (e: any) {
    message.error(e?.message || 'Failed to load portal')
  } finally {
    loading.value = false
  }
}

onMounted(load)
watch(activeRole, () => load())
watch(institutionId, () => load())

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
    if (currentRole.value === 'admin' || currentRole.value === 'teacher' || currentRole.value === 'student') {
      activeRole.value = currentRole.value as Role
    }
    if (currentRole.value === 'student') {
      const dest = `/institution/student_mode/${encodeURIComponent(institutionId.value)}`
      window.location.href = dest
    }
  } catch {}
}

onMounted(() => { resolveCurrentRole() })

const classroomColumns = [
  { title: 'Title', dataIndex: 'title', key: 'title' },
  { title: 'Code', dataIndex: 'code', key: 'code' },
  { title: 'Department', dataIndex: 'departmentName', key: 'departmentName' },
  { title: 'Status', dataIndex: 'status', key: 'status' },
]

const courseColumns = [
  { title: 'Course', dataIndex: 'title', key: 'title' },
  { title: 'Category', dataIndex: 'category', key: 'category' },
  { title: 'Difficulty', dataIndex: 'difficulty', key: 'difficulty' },
  { title: 'Progress', dataIndex: 'progressPct', key: 'progressPct' },
]

const assignmentColumns = [
  { title: 'Title', dataIndex: 'title', key: 'title' },
  { title: 'Classroom', dataIndex: 'classroomName', key: 'classroomName' },
  { title: 'Due', dataIndex: 'dueDate', key: 'dueDate' },
]
</script>

<style scoped>
.institution-cockpit { padding: 16px; }
.row-item { display: flex; gap: 8px; justify-content: space-between; }
.row-title { font-weight: 500; }
.row-meta { color: #888; }
</style>