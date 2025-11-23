<template>
  <div class="catalog-page">
    <a-page-header title="Institution Course Catalog">
      <template #extra>
        <a-space>
          <a-menu mode="horizontal" :selectedKeys="['catalog']">
            <a-menu-item key="overview"><a :href="navHref('overview')">Overview</a></a-menu-item>
            <a-menu-item v-if="currentRole==='admin'" key="departments"><a :href="navHref('departments')">Departments</a></a-menu-item>
            <a-menu-item key="classrooms"><a :href="navHref('classrooms')">Classrooms</a></a-menu-item>
            <a-menu-item key="people"><a :href="navHref('people')">People Directory</a></a-menu-item>
            <a-menu-item key="catalog"><a :href="navHref('catalog')">Catalog</a></a-menu-item>
            <a-menu-item key="calendar"><a :href="navHref('calendar')">Calendar</a></a-menu-item>
            <a-menu-item key="assignments"><a :href="navHref('assignments')">Assignments</a></a-menu-item>
          </a-menu>
          <a-input v-model:value="q" placeholder="Search" style="width:220px" />
          <a-select v-model:value="difficulty" placeholder="Difficulty" style="width:160px" allow-clear :options="difficultyOptions" />
          <a-button size="small" @click="load">Reload</a-button>
        </a-space>
      </template>
    </a-page-header>

    <a-skeleton :loading="loading" active :paragraph="{ rows: 8 }">
      <a-card size="small">
        <a-table size="small" :columns="columns" :dataSource="filtered" row-key="courseId" :pagination="{ pageSize: 8 }">
          <template #bodyCell="{ column, record }">
            <template v-if="column.key==='actions'">
              <a :href="courseLink(record)">Open</a>
            </template>
            <template v-else-if="column.key==='availability'">
              <a-tag v-if="teacherIds.includes(String(record.teacherId || record.teacher_id || ''))" color="geekblue">Institution course</a-tag>
              <a-tag v-else color="purple">Global course</a-tag>
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
const q = ref('')
const difficulty = ref<string | undefined>(undefined)
const courses = ref<any[]>([])
const modulesByCourse = ref<Record<string, any[]>>({})
const currentRole = ref<'student' | 'teacher' | 'admin' | 'none'>('none')
const meId = ref<string | null>(null)
const teacherIds = ref<string[]>([])
const firstDepartmentId = ref<string | null>(null)
const firstClassroomId = ref<string | null>(null)

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
    const url = `${baseUrl}/api/institution-portal/catalog?institutionId=${encodeURIComponent(institutionId.value)}`
    const resp = await fetch(url, { headers: { Authorization: auth } })
    let json: any = null
    if (resp.ok) {
      json = await resp.json()
    } else {
      const fallback = await fetch(`${baseUrl}/api/teach-internal/courses`, { headers: { Authorization: auth } })
      if (!fallback.ok) throw new Error(await fallback.text().catch(() => `HTTP ${fallback.status}`))
      const payload = await fallback.json().catch(() => ({}))
      const items = Array.isArray(payload?.data) ? payload.data : []
      json = { courses: items.map((c: any) => ({ courseId: c.id, title: c.title, teacherId: c.teacherId || null, category: c.category || null, difficulty: c.difficulty || null, availability: 'available' })) }
    }
    courses.value = json.courses || []
    await loadModulesForCourses(auth)
    await loadInstitutionTeachers(auth)
  } catch (e: any) {
    message.error(e?.message || 'Failed to load catalog')
  } finally {
    loading.value = false
  }
}

onMounted(load)
onMounted(resolveCurrentRole)

const filtered = computed(() => {
  return courses.value
    .filter((c) => (difficulty.value ? c.difficulty === difficulty.value : true))
    .filter((c) => (q.value ? String(c.title).toLowerCase().includes(q.value.toLowerCase()) : true))
})

const difficultyOptions = [
  { label: 'Beginner', value: 'beginner' },
  { label: 'Intermediate', value: 'intermediate' },
  { label: 'Advanced', value: 'advanced' },
]

const columns = [
  { title: 'Course', dataIndex: 'title', key: 'title' },
  { title: 'Teacher', dataIndex: 'teacherId', key: 'teacherId' },
  { title: 'Category', dataIndex: 'category', key: 'category' },
  { title: 'Difficulty', dataIndex: 'difficulty', key: 'difficulty' },
  { title: 'Availability', dataIndex: 'availability', key: 'availability' },
  { title: 'Actions', key: 'actions' },
]

async function loadModulesForCourses(auth: string) {
  try {
    const baseUrl = apiBase ? apiBase.replace(/\/$/, '') : ''
    const resp = await fetch(`${baseUrl}/api/teach-internal/modules`, { headers: { Authorization: auth } })
    if (!resp.ok) return
    const data = await resp.json().catch(() => null)
    const arr = Array.isArray(data) ? data : (Array.isArray(data?.modules) ? data.modules : [])
    const grouped: Record<string, any[]> = {}
    arr.forEach((m: any) => {
      const cid = m.courseId || m.course_id || ''
      if (!cid) return
      grouped[cid] = grouped[cid] || []
      grouped[cid].push(m)
    })
    modulesByCourse.value = grouped
  } catch {}
}

async function loadInstitutionTeachers(auth: string) {
  try {
    const baseUrl = apiBase ? apiBase.replace(/\/$/, '') : ''
    const resp = await fetch(`${baseUrl}/api/institutions/graphql`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', Authorization: auth },
      body: JSON.stringify({
        query: `query($institutionId:String!){ classrooms(institutionId:$institutionId){ id departmentId teacherId } }`,
        variables: { institutionId: institutionId.value },
      }),
    })
    const json = await resp.json().catch(() => null)
    const arr = Array.isArray(json?.data?.classrooms) ? json.data.classrooms : []
    teacherIds.value = Array.from(new Set(arr.map((c: any) => String(c.teacherId || '')).filter(Boolean)))
    firstClassroomId.value = (arr[0]?.id as string) || null
    firstDepartmentId.value = (arr.find((c: any) => c.departmentId)?.departmentId as string) || null
  } catch {}
}

function courseLink(record: any) {
  const cid = record.courseId || record.id
  const teacherId = record.teacherId || record.teacher_id || 'teacher'
  const mods = modulesByCourse.value[cid] || []
  const mod = mods[0]
  if (mod?.id) return `/teach-internal/${encodeURIComponent(teacherId)}/course/${encodeURIComponent(cid)}/module/${encodeURIComponent(mod.id)}/view`
  return `/teach-internal/${encodeURIComponent(teacherId)}`
}

function navHref(key: string) {
  const qs = `?institutionId=${encodeURIComponent(institutionId.value)}`
  if (key==='overview') return `/institution/portal${qs}`
  if (key==='departments') return firstDepartmentId.value ? `/institution/departments/${encodeURIComponent(firstDepartmentId.value)}${qs}` : `/institution/portal${qs}`
  if (key==='classrooms') return firstClassroomId.value ? `/institution/classrooms/${encodeURIComponent(firstClassroomId.value)}${qs}` : `/institution/portal${qs}`
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
.catalog-page { padding: 16px; }
</style>
