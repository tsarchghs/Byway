<template>
  <div class="teacher-assignments">
    <a-page-header title="Teacher Assignment Manager">
      <template #extra>
        <a-space>
          <a-menu mode="horizontal" :selectedKeys="['assignments']">
            <a-menu-item key="overview"><a :href="navHref('overview')">Overview</a></a-menu-item>
            <a-menu-item v-if="currentRole==='admin'" key="departments"><a :href="navHref('departments')">Departments</a></a-menu-item>
            <a-menu-item key="classrooms"><a :href="navHref('classrooms')">Classrooms</a></a-menu-item>
            <a-menu-item key="people"><a :href="navHref('people')">People Directory</a></a-menu-item>
            <a-menu-item key="catalog"><a :href="navHref('catalog')">Catalog</a></a-menu-item>
            <a-menu-item key="calendar"><a :href="navHref('calendar')">Calendar</a></a-menu-item>
            <a-menu-item v-if="currentRole!=='student'" key="assignments"><a :href="navHref('assignments')">Assignments</a></a-menu-item>
          </a-menu>
          <a-button size="small" @click="load">Reload</a-button>
        </a-space>
      </template>
    </a-page-header>

    <a-skeleton v-if="currentRole!=='student' && currentRole!=='none'" :loading="loading" active :paragraph="{ rows: 6 }">
      <a-row :gutter="16">
        <a-col :span="12">
          <a-card size="small" title="Assign to Classroom">
            <a-form layout="vertical" @submit.prevent>
              <a-form-item label="Teacher">
                <a-select v-model:value="form.teacherId" :options="teacherOptions" placeholder="Select teacher" />
              </a-form-item>
              <a-form-item label="Classroom">
                <a-select v-model:value="form.classroomId" :options="classroomOptions" placeholder="Select classroom" />
              </a-form-item>
              <a-form-item>
                <a-button type="primary" @click="assignToClassroom" :disabled="!form.teacherId || !form.classroomId">Assign</a-button>
              </a-form-item>
            </a-form>
          </a-card>
        </a-col>
        <a-col :span="12">
          <a-card size="small" title="Assign to Course">
            <a-form layout="vertical" @submit.prevent>
              <a-form-item label="Teacher">
                <a-select v-model:value="form2.teacherId" :options="teacherOptions" placeholder="Select teacher" />
              </a-form-item>
              <a-form-item label="Course">
                <a-select v-model:value="form2.courseId" :options="courseOptions" placeholder="Select course" />
              </a-form-item>
              <a-form-item>
                <a-button type="primary" @click="assignToCourse" :disabled="!form2.teacherId || !form2.courseId">Assign</a-button>
              </a-form-item>
            </a-form>
          </a-card>
        </a-col>
      </a-row>

      <a-card size="small" title="Current Assignments" style="margin-top:16px">
        <a-table size="small" :columns="columns" :dataSource="assignments" row-key="id" />
      </a-card>
    </a-skeleton>
    <a-result v-else status="403" title="Not allowed" sub-title="This page is for teachers and administrators.">
      <template #extra>
        <a-button type="primary" :href="navHref('overview')">Go to portal</a-button>
      </template>
    </a-result>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRuntimeConfig } from '#imports'
import { message } from 'ant-design-vue'

const route = useRoute()
const runtime = useRuntimeConfig()
const apiBase = runtime.public?.apiBase || runtime.public?.appBaseUrl || ''

const institutionId = computed(() => (route.query.institutionId as string) || (route.params?.institution_id as string) || 'inst_byway')

const loading = ref(true)
const teachers = ref<any[]>([])
const classrooms = ref<any[]>([])
const courses = ref<any[]>([])
const assignments = ref<any[]>([])
const currentRole = ref<'student' | 'teacher' | 'admin' | 'none'>('none')
const meId = ref<string | null>(null)

const form = ref<{ teacherId?: string; classroomId?: string }>({})
const form2 = ref<{ teacherId?: string; courseId?: string }>({})

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
    const url = `${baseUrl}/api/institution-portal/teacher-assignments?institutionId=${encodeURIComponent(institutionId.value)}`
    const resp = await fetch(url, { headers: { Authorization: auth } })
    if (!resp.ok) throw new Error(await resp.text().catch(() => `HTTP ${resp.status}`))
    const json = await resp.json()
    teachers.value = json.teachers || []
    classrooms.value = json.classrooms || []
    courses.value = json.courses || []
    assignments.value = json.assignments || []
  } catch (e: any) {
    message.error(e?.message || 'Failed to load')
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
  } catch {}
}

onMounted(() => { resolveCurrentRole() })
watch(currentRole, (r) => {
  if (r==='student') {
    window.location.href = navHref('overview')
  }
})

const teacherOptions = computed(() => teachers.value.map((t) => ({ label: t.displayName || t.userId, value: t.userId })))
const classroomOptions = computed(() => classrooms.value.map((c) => ({ label: c.title, value: c.id })))
const courseOptions = computed(() => courses.value.map((c) => ({ label: c.title, value: c.courseId })))

async function assignToClassroom() {
  try {
    const auth = resolveAuthHeader()
    if (!auth) throw new Error('Missing auth token')
    const baseUrl = apiBase ? apiBase.replace(/\/$/, '') : ''
    const resp = await fetch(`${baseUrl}/api/institution-portal/assignments/teacher`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', Authorization: auth },
      body: JSON.stringify({ scope: 'classroom', institutionId: institutionId.value, teacherId: form.value.teacherId, classroomId: form.value.classroomId }),
    })
    if (!resp.ok) throw new Error(await resp.text().catch(() => `HTTP ${resp.status}`))
    message.success('Assigned to classroom')
    load()
  } catch (e: any) {
    message.error(e?.message || 'Assign failed')
  }
}

async function assignToCourse() {
  try {
    const auth = resolveAuthHeader()
    if (!auth) throw new Error('Missing auth token')
    const baseUrl = apiBase ? apiBase.replace(/\/$/, '') : ''
    const resp = await fetch(`${baseUrl}/api/institution-portal/assignments/teacher`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', Authorization: auth },
      body: JSON.stringify({ scope: 'course', institutionId: institutionId.value, teacherId: form2.value.teacherId, courseId: form2.value.courseId }),
    })
    if (!resp.ok) throw new Error(await resp.text().catch(() => `HTTP ${resp.status}`))
    message.success('Assigned to course')
    load()
  } catch (e: any) {
    message.error(e?.message || 'Assign failed')
  }
}

const columns = [
  { title: 'Type', dataIndex: 'type', key: 'type' },
  { title: 'Teacher', dataIndex: 'teacher', key: 'teacher' },
  { title: 'Target', dataIndex: 'target', key: 'target' },
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
.teacher-assignments { padding: 16px; }
</style>