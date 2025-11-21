<template>
  <div class="people-directory">
    <a-page-header title="Institution People Directory">
      <template #extra>
        <a-space>
          <a-select v-model:value="roleFilter" :options="roleOptions" allow-clear placeholder="Filter by role" style="width:180px" />
          <a-button size="small" @click="load">Reload</a-button>
        </a-space>
      </template>
    </a-page-header>

    <a-skeleton :loading="loading" active :paragraph="{ rows: 8 }">
      <a-card size="small">
        <a-table size="small" :columns="columns" :dataSource="filtered" row-key="id" />
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

onMounted(load)

const filtered = computed(() => members.value.filter((m) => (roleFilter.value ? m.role === roleFilter.value : true)))
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
</script>

<style scoped>
.people-directory { padding: 16px; }
</style>