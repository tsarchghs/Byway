<template>
  <div class="student-record">
    <a-page-header :title="displayName" :sub-title="studentId">
      <template #extra>
        <a-space>
          <a-button size="small" @click="load">Reload</a-button>
        </a-space>
      </template>
    </a-page-header>

    <a-skeleton :loading="loading" active :paragraph="{ rows: 8 }">
      <a-row :gutter="16">
        <a-col :span="16">
          <a-card size="small" title="Courses">
            <a-table size="small" :columns="courseColumns" :dataSource="courses" row-key="courseId" />
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

const displayName = computed(() => student.value?.displayName || 'Student')
const avgProgress = computed(() => {
  if (!courses.value.length) return 0
  const sum = courses.value.reduce((acc, c) => acc + (c.progressPct || 0), 0)
  return Math.round(sum / courses.value.length)
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
</script>

<style scoped>
.student-record { padding: 16px; }
</style>