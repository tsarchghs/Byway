<template>
  <div class="classroom-overview">
    <a-page-header :title="room?.title || room?.code || 'Classroom'" :sub-title="room?.id || classroomId">
      <template #extra>
        <a-space>
          <a-button size="small" @click="load">Reload</a-button>
        </a-space>
      </template>
    </a-page-header>

    <a-skeleton :loading="loading" active :paragraph="{ rows: 8 }">
      <a-row :gutter="16">
        <a-col :span="16">
          <a-tabs v-model:activeKey="activeTab">
            <a-tab-pane key="overview" tab="Overview">
              <a-card size="small" title="Assignments">
                <a-table size="small" :columns="assignmentColumns" :dataSource="assignments" row-key="id" />
              </a-card>
              <a-card size="small" title="Modules & Lessons" style="margin-top:16px">
                <a-table size="small" :columns="lessonColumns" :dataSource="lessons" row-key="id" />
              </a-card>
            </a-tab-pane>
            <a-tab-pane key="people" tab="People">
              <a-card size="small" title="Enrolled Students">
                <a-table size="small" :columns="studentColumns" :dataSource="students" row-key="studentId" />
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
  } catch (e: any) {
    message.error(e?.message || 'Failed to load classroom')
  } finally {
    loading.value = false
  }
}

onMounted(load)

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
</script>

<style scoped>
.classroom-overview { padding: 16px; }
</style>