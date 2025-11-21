<template>
  <div class="join-institution">
    <a-page-header title="Join Institution">
      <template #extra>
        <a-space>
          <a-input v-model:value="q" placeholder="Search institutions" style="width:240px" />
          <a-button size="small" @click="load">Reload</a-button>
        </a-space>
      </template>
    </a-page-header>

    <a-skeleton :loading="loading" active :paragraph="{ rows: 6 }">
      <a-card size="small">
        <a-table size="small" :columns="columns" :dataSource="filtered" row-key="id">
          <template #bodyCell="{ column, record }">
            <template v-if="column.key==='actions'">
              <a-button type="link" @click="join(record.id)">Join</a-button>
            </template>
          </template>
        </a-table>
      </a-card>
    </a-skeleton>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRuntimeConfig } from '#imports'
import { message } from 'ant-design-vue'

const runtime = useRuntimeConfig()
const apiBase = runtime.public?.apiBase || runtime.public?.appBaseUrl || ''
const loading = ref(true)
const meId = ref<string | null>(null)
const q = ref('')
const rows = ref<any[]>([])

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
    const meResp = await fetch(`${baseUrl}/api/authentication/graphql`, { method: 'POST', headers: { 'content-type': 'application/json', Authorization: auth }, body: JSON.stringify({ query: `query Me { me { id } }` }) })
    const meJson = await meResp.json().catch(() => null)
    meId.value = meJson?.data?.me?.id || null
    const query = `query { institutions { id name slug type location active createdAt updatedAt } }`
    const resp = await fetch(`${baseUrl}/api/institutions/graphql`, { method: 'POST', headers: { 'content-type': 'application/json', Authorization: auth }, body: JSON.stringify({ query }) })
    if (!resp.ok) throw new Error(await resp.text().catch(() => `HTTP ${resp.status}`))
    const json = await resp.json()
    rows.value = Array.isArray(json?.data?.institutions) ? json.data.institutions : []
    if (meId.value) await checkMembershipAndRedirect(auth, baseUrl)
  } catch (e: any) {
    message.error(e?.message || 'Failed to load institutions')
  } finally {
    loading.value = false
  }
}

onMounted(load)

const filtered = computed(() => rows.value.filter((r) => (q.value ? String(r.name).toLowerCase().includes(q.value.toLowerCase()) || String(r.slug).toLowerCase().includes(q.value.toLowerCase()) : true)))

async function join(id: string) {
  try {
    const auth = resolveAuthHeader()
    if (!auth) throw new Error('Missing auth token')
    const baseUrl = apiBase ? apiBase.replace(/\/$/, '') : ''
    const resp = await fetch(`${baseUrl}/api/institution-portal/institutions/${encodeURIComponent(id)}/join`, { method: 'POST', headers: { Authorization: auth } })
    if (!resp.ok) throw new Error(await resp.text().catch(() => `HTTP ${resp.status}`))
    message.success('Joined institution')
    window.location.href = `/institution/portal?institutionId=${encodeURIComponent(id)}`
  } catch (e: any) {
    message.error(e?.message || 'Join failed')
  }
}

const columns = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Slug', dataIndex: 'slug', key: 'slug' },
  { title: 'Type', dataIndex: 'type', key: 'type' },
  { title: 'Location', dataIndex: 'location', key: 'location' },
  { title: 'Actions', key: 'actions' },
]
async function checkMembershipAndRedirect(auth: string, baseUrl: string) {
  try {
    for (const inst of rows.value) {
      const resp = await fetch(`${baseUrl}/api/institutions/graphql`, { method: 'POST', headers: { 'content-type': 'application/json', Authorization: auth }, body: JSON.stringify({ query: `query($institutionId:String!){ members(institutionId:$institutionId){ userId } }`, variables: { institutionId: inst.id } }) })
      const json = await resp.json().catch(() => null)
      const members = Array.isArray(json?.data?.members) ? json.data.members : []
      if (members.find((m: any) => m.userId === meId.value)) {
        window.location.href = `/institution/portal?institutionId=${encodeURIComponent(inst.id)}`
        return
      }
    }
  } catch {}
}
</script>

<style scoped>
.join-institution { padding: 16px; }
</style>