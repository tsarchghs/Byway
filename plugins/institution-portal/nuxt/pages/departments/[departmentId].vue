<template>
  <div class="department-overview">
    <a-page-header :title="dept?.name || 'Department'" :sub-title="dept?.slug || departmentId">
      <template #extra>
        <a-space>
          <a-button size="small" @click="load">Reload</a-button>
        </a-space>
      </template>
    </a-page-header>

    <a-skeleton :loading="loading" active :paragraph="{ rows: 8 }">
      <a-row :gutter="16">
        <a-col :span="16">
          <a-card size="small" title="Classrooms">
            <a-table size="small" :columns="classroomColumns" :dataSource="classrooms" row-key="id" />
          </a-card>
          <a-card size="small" title="Courses" style="margin-top:16px">
            <a-table size="small" :columns="courseColumns" :dataSource="courses" row-key="courseId" />
          </a-card>
        </a-col>
        <a-col :span="8">
          <a-card size="small" title="Department">
            <a-descriptions :column="1" size="small">
              <a-descriptions-item label="Institution">{{ institution?.name }}</a-descriptions-item>
              <a-descriptions-item label="Contact">{{ dept?.contact || '—' }}</a-descriptions-item>
              <a-descriptions-item label="Head">{{ dept?.head || '—' }}</a-descriptions-item>
              <a-descriptions-item label="Active">{{ dept?.active ? 'Yes' : 'No' }}</a-descriptions-item>
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

const departmentId = computed(() => String(route.params.departmentId || route.params.id || ''))
const institutionId = computed(() => (route.query.institutionId as string) || (route.params?.institution_id as string) || 'inst_byway')

const loading = ref(true)
const institution = ref<any | null>(null)
const dept = ref<any | null>(null)
const classrooms = ref<any[]>([])
const courses = ref<any[]>([])

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
    const url = `${baseUrl}/api/institution-portal/departments/${encodeURIComponent(departmentId.value)}/overview?institutionId=${encodeURIComponent(institutionId.value)}`
    const resp = await fetch(url, { headers: { Authorization: auth } })
    if (!resp.ok) throw new Error(await resp.text().catch(() => `HTTP ${resp.status}`))
    const json = await resp.json()
    institution.value = json.institution || null
    dept.value = json.department || null
    classrooms.value = json.classrooms || []
    courses.value = json.courses || []
  } catch (e: any) {
    message.error(e?.message || 'Failed to load department')
  } finally {
    loading.value = false
  }
}

onMounted(load)

const classroomColumns = [
  { title: 'Title', dataIndex: 'title', key: 'title' },
  { title: 'Code', dataIndex: 'code', key: 'code' },
  { title: 'Capacity', dataIndex: 'capacity', key: 'capacity' },
  { title: 'Status', dataIndex: 'status', key: 'status' },
]

const courseColumns = [
  { title: 'Course', dataIndex: 'title', key: 'title' },
  { title: 'Category', dataIndex: 'category', key: 'category' },
  { title: 'Difficulty', dataIndex: 'difficulty', key: 'difficulty' },
]
</script>

<style scoped>
.department-overview { padding: 16px; }
</style>