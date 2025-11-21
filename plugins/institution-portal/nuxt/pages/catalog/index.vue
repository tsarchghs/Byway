<template>
  <div class="catalog-page">
    <a-page-header title="Institution Course Catalog">
      <template #extra>
        <a-space>
          <a-input v-model:value="q" placeholder="Search" style="width:220px" />
          <a-select v-model:value="difficulty" placeholder="Difficulty" style="width:160px" allow-clear :options="difficultyOptions" />
          <a-button size="small" @click="load">Reload</a-button>
        </a-space>
      </template>
    </a-page-header>

    <a-skeleton :loading="loading" active :paragraph="{ rows: 8 }">
      <a-card size="small">
        <a-table size="small" :columns="columns" :dataSource="filtered" row-key="courseId" :pagination="{ pageSize: 8 }" />
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
    if (!resp.ok) throw new Error(await resp.text().catch(() => `HTTP ${resp.status}`))
    const json = await resp.json()
    courses.value = json.courses || []
  } catch (e: any) {
    message.error(e?.message || 'Failed to load catalog')
  } finally {
    loading.value = false
  }
}

onMounted(load)

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
]
</script>

<style scoped>
.catalog-page { padding: 16px; }
</style>