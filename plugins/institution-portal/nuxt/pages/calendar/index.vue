  <template>
  <div class="institution-calendar">
    <a-page-header title="Institution Schedule">
      <template #extra>
        <a-space>
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
            <a-table size="small" :columns="columns" :dataSource="events" row-key="id" />
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
</script>

<style scoped>
.institution-calendar { padding: 16px; }
</style>