<template>
  <div class="institution-calendar">
    <a-page-header title="Institution Schedule">
      <template #extra>
        <a-space>
          <a-menu mode="horizontal" :selectedKeys="['calendar']">
            <a-menu-item key="overview"><a :href="navHref('overview')">Overview</a></a-menu-item>
            <a-menu-item v-if="currentRole==='admin'" key="departments"><a :href="navHref('departments')">Departments</a></a-menu-item>
            <a-menu-item key="classrooms"><a :href="navHref('classrooms')">Classrooms</a></a-menu-item>
            <a-menu-item key="people"><a :href="navHref('people')">People Directory</a></a-menu-item>
            <a-menu-item key="catalog"><a :href="navHref('catalog')">Catalog</a></a-menu-item>
            <a-menu-item key="calendar"><a :href="navHref('calendar')">Calendar</a></a-menu-item>
            <a-menu-item key="assignments"><a :href="navHref('assignments')">Assignments</a></a-menu-item>
          </a-menu>
          <a-date-picker v-model:value="rangeStart" placeholder="From" />
          <a-date-picker v-model:value="rangeEnd" placeholder="To" />
          <a-button size="small" @click="load">Reload</a-button>
        </a-space>
      </template>
    </a-page-header>

    <a-skeleton :loading="loading" active :paragraph="{ rows: 8 }">
      <a-row :gutter="16">
        <a-col :span="14">
          <a-card size="small" title="Upcoming Events">
            <a-table size="small" :columns="columns" :dataSource="events" row-key="id">
              <template #bodyCell="{ column, record }">
                <template v-if="column.dataIndex==='title'">
                  <a :href="eventLink(record)">{{ record.title }}</a>
                </template>
              </template>
            </a-table>
          </a-card>
        </a-col>
        <a-col :span="10">
          <a-card size="small" title="Summary">
            <a-statistic title="Assignments" :value="assignmentCount" />
            <a-statistic title="Lab Sessions" :value="labCount" style="margin-top:8px" />
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

const institutionId = computed(() => (route.query.institutionId as string) || (route.params?.institution_id as string) || 'inst_byway')
const loading = ref(true)
const events = ref<any[]>([])
const rangeStart = ref<string | undefined>(undefined)
const rangeEnd = ref<string | undefined>(undefined)
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
    const params = new URLSearchParams()
    params.set('institutionId', institutionId.value)
    if (rangeStart.value) params.set('from', String(rangeStart.value))
    if (rangeEnd.value) params.set('to', String(rangeEnd.value))
    const url = `${baseUrl}/api/institution-portal/calendar?${params.toString()}`
    const resp = await fetch(url, { headers: { Authorization: auth } })
    if (!resp.ok) throw new Error(await resp.text().catch(() => `HTTP ${resp.status}`))
    const json = await resp.json()
    events.value = json.events || []
  } catch (e: any) {
    message.error(e?.message || 'Failed to load calendar')
  } finally {
    loading.value = false
  }
}

onMounted(load)

const assignmentCount = computed(() => events.value.filter((e) => e.kind === 'assignment').length)
const labCount = computed(() => events.value.filter((e) => e.kind === 'lab').length)

const columns = [
  { title: 'Type', dataIndex: 'kind', key: 'kind' },
  { title: 'Title', dataIndex: 'title', key: 'title' },
  { title: 'Classroom', dataIndex: 'classroomName', key: 'classroomName' },
  { title: 'Date', dataIndex: 'date', key: 'date' },
]

function eventLink(e: any) {
  if (e.kind==='assignment' && e.assignmentId && e.institutionSlug) return `/institutions/${e.institutionSlug}/assignments/${e.assignmentId}/grading`
  if (e.kind==='lab') return '/teach/labs'
  return '#'
}

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

onMounted(resolveCurrentRole)
</script>

<style scoped>
.institution-calendar { padding: 16px; }
</style>
