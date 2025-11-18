<template>
  <div class="inst-shell">
    <!-- Top bar -->
    <div class="top-bar">
      <div class="top-left">
        <div class="title">Institutions</div>
        <div class="subtitle">Manage institutions, departments, and classrooms</div>
      </div>
      <div class="top-actions">
        <a-button @click="refresh" :loading="loading" ghost>
          <template #icon><ReloadOutlined /></template>
          Refresh
        </a-button>
        <a-button type="primary" @click="openCreate">
          <template #icon><PlusOutlined /></template>
          Add Institution
        </a-button>
      </div>
    </div>

    <!-- Stats -->
    <a-row :gutter="16" class="section">
      <a-col :xs="12" :md="6">
        <a-card class="stat-card" bordered>
          <div class="stat-label">Total Institutions</div>
          <div class="stat-value">{{ institutions.length }}</div>
        </a-card>
      </a-col>
      <a-col :xs="12" :md="6">
        <a-card class="stat-card" bordered>
          <div class="stat-label">Active</div>
          <div class="stat-value">{{ institutions.filter(i => i.active).length }}</div>
        </a-card>
      </a-col>
      <a-col :xs="12" :md="6">
        <a-card class="stat-card" bordered>
          <div class="stat-label">Departments</div>
          <div class="stat-value">{{ institutions.reduce((s,i)=>s+(i.departments?.length||0),0) }}</div>
        </a-card>
      </a-col>
      <a-col :xs="12" :md="6">
        <a-card class="stat-card" bordered>
          <div class="stat-label">Students (est.)</div>
          <div class="stat-value">{{ totalStudents }}</div>
        </a-card>
      </a-col>
    </a-row>

    <!-- Filters -->
    <a-card class="section" bordered>
      <a-row :gutter="12">
        <a-col :xs="24" :md="12">
          <a-input-search v-model:value="searchQuery" placeholder="Search by name or location" @search="onSearch">
            <template #prefix><SearchOutlined /></template>
          </a-input-search>
        </a-col>
        <a-col :xs="12" :md="6">
          <a-select v-model:value="filterStatus" style="width: 100%" @change="onFilterChange">
            <a-select-option value="">All Status</a-select-option>
            <a-select-option value="active">Active</a-select-option>
            <a-select-option value="inactive">Inactive</a-select-option>
          </a-select>
        </a-col>
        <a-col :xs="12" :md="6" class="flex justify-end">
          <a-switch v-model:checked="isDarkMode" @change="toggleDarkMode" />
          <span class="ml-2">Dark mode</span>
        </a-col>
      </a-row>
    </a-card>

    <!-- Grid -->
    <div class="section">
      <a-empty v-if="!loading && filteredInstitutions.length === 0" description="No institutions found" />
      <a-row v-else :gutter="[16,16]">
        <a-col v-for="inst in paginatedInstitutions" :key="inst.id" :xs="24" :sm="12" :lg="8">
          <a-card class="inst-card" :class="{ inactive: inst.active === false }" bordered hoverable>
            <div class="card-head">
              <div>
                <div class="card-title">{{ inst.name }}</div>
                <div class="card-sub">{{ inst.location || 'No location' }}</div>
              </div>
              <a-tag :color="inst.active ? 'green' : 'red'">{{ inst.active ? 'Active' : 'Inactive' }}</a-tag>
            </div>

            <div class="card-body">
              <div class="row"><span>Type</span><strong>{{ inst.type || '—' }}</strong></div>
              <div class="row" v-if="inst.email || inst.phone">
                <span>Contact</span>
                <strong>{{ inst.email || inst.phone || '—' }}</strong>
              </div>
              <div class="row">
                <span>Departments</span><strong>{{ inst.departments?.length || 0 }}</strong>
              </div>
              <div class="row">
                <span>Members</span><strong>{{ inst.members?.length || 0 }}</strong>
              </div>
            </div>

            <div class="card-actions">
              <a-button type="text" size="small" @click="editInstitution(inst)">
                <EditOutlined /> Edit
              </a-button>
              <a-button type="text" size="small" danger @click="deleteInstitution(inst.id)">
                <DeleteOutlined /> Archive
              </a-button>
              <a-button type="primary" size="small" @click="navigateTo(`/institutions/${inst.id}`)">
                Open
              </a-button>
            </div>
          </a-card>
        </a-col>
      </a-row>

      <div class="mt-4 flex justify-center">
        <a-pagination
          v-model:current="currentPage"
          :total="filteredInstitutions.length"
          :page-size="pageSize"
          show-size-changer
          :show-total="(total) => `Total ${total} institutions`"
        />
      </div>
    </div>
  </div>

  <!-- Create/Edit Modal -->
  <a-modal
    v-model:open="showCreateModal"
    :title="editingInst ? 'Edit Institution' : 'Add Institution'"
    ok-text="Save"
    cancel-text="Cancel"
    @ok="saveInstitution"
  >
    <a-form layout="vertical">
      <a-form-item label="Institution Name" required>
        <a-input
          v-model:value="formData.name"
          placeholder="Enter institution name"
        />
      </a-form-item>

      <a-form-item label="Type" required>
        <a-select v-model:value="formData.type">
          <a-select-option value="University">University</a-select-option>
          <a-select-option value="College">College</a-select-option>
          <a-select-option value="Academy">Academy</a-select-option>
          <a-select-option value="Institute">Institute</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item label="Location">
        <a-input
          v-model:value="formData.location"
          placeholder="Enter location"
        />
      </a-form-item>

      <a-form-item label="Email">
        <a-input
          v-model:value="formData.email"
          type="email"
          placeholder="Enter email"
        />
      </a-form-item>

      <a-form-item label="Phone">
        <a-input
          v-model:value="formData.phone"
          placeholder="Enter phone number"
        />
      </a-form-item>

      <a-form-item label="Status">
        <a-switch v-model:checked="formData.active" />
        <span class="ml-2">{{ formData.active ? 'Active' : 'Inactive' }}</span>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRuntimeConfig, useRouter } from '#imports'
import { useAuth } from '../../../../packages/shared-ui/src/composables/useAuth'
import { message } from 'ant-design-vue'
import {
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  TeamOutlined,
  UserOutlined,
  BgColorsOutlined,
} from '@ant-design/icons-vue'

interface Institution {
  id: string
  name: string
  type?: string
  location?: string
  email?: string
  phone?: string
  active?: boolean
  departments?: Array<{ id: string; name: string; studentCount?: number }>
  classrooms?: Array<{ id: string }>
  members?: Array<{ id: string; role: string }>
}

// State
const institutions = ref<Institution[]>([])
const searchQuery = ref('')
const filterStatus = ref('')
const showCreateModal = ref(false)
const editingInst = ref<Institution | null>(null)
const currentPage = ref(1)
const pageSize = ref(12)
const isDarkMode = ref(false)
const apiBase = useRuntimeConfig().public?.apiBase || 'http://localhost:4000'
const loading = ref(false)
const router = useRouter()
const { token } = useAuth()

function tokenHeader() {
  const t = token?.value || (typeof window !== 'undefined' ? localStorage.getItem('token') : '')
  return t ? { Authorization: `Bearer ${t}` } : {}
}

// Form data
const formData = ref({
  name: '',
  type: 'University',
  location: '',
  email: '',
  phone: '',
  active: true,
})

// Initialize with mock data
onMounted(() => {
  loadInstitutions()
  const saved = localStorage.getItem('isDarkMode')
  if (saved) {
    isDarkMode.value = JSON.parse(saved)
    applyTheme()
  }
})

async function loadInstitutions() {
  try {
    loading.value = true
    const resp = await fetch(`${apiBase}/api/institutions/graphql`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...(tokenHeader()),
      },
      body: JSON.stringify({
        query: `query {
          institutions {
            id name type location email phone active
            departments { id name }
            classrooms { id }
            members { id role }
          }
        }`,
      }),
    })
    const json = await resp.json()
    const data = json?.data?.institutions || []
    institutions.value = data
  } catch (e) {
    console.warn('[institutions] load failed', e)
    message.error('Unable to load institutions')
  } finally {
    loading.value = false
  }
}

// Computed properties
const filteredInstitutions = computed(() => {
  return institutions.value.filter(inst => {
    const matchesSearch = !searchQuery.value || 
      inst.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      inst.location.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    const matchesStatus = !filterStatus.value || 
      (filterStatus.value === 'active' ? inst.active : !inst.active)
    
    return matchesSearch && matchesStatus
  })
})

const paginatedInstitutions = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredInstitutions.value.slice(start, end)
})

const totalStudents = computed(() => {
  return institutions.value.reduce((sum, inst) => {
    return sum + (inst.departments?.reduce((dSum, dep) => dSum + (dep.studentCount || 0), 0) || 0)
  }, 0)
})

// Methods
function calculateStudentCount(inst: Institution) {
  return inst.departments?.reduce((sum, dep) => sum + (dep.studentCount || 0), 0) || 0
}

function openCreate() {
  editingInst.value = null
  resetForm()
  showCreateModal.value = true
}

function navigateTo(path: string) {
  router.push(path)
}

function refresh() {
  loadInstitutions()
}

function onSearch() {
  currentPage.value = 1
}

function onFilterChange() {
  currentPage.value = 1
}

function editInstitution(inst: Institution) {
  editingInst.value = inst
  formData.value = { ...inst }
  showCreateModal.value = true
}

function saveInstitution() {
  if (!formData.value.name.trim()) {
    message.error('Institution name is required')
    return
  }

  const mutation = editingInst.value
    ? `mutation($id:String!,$name:String,$slug:String,$type:String,$location:String,$email:String,$phone:String,$active:Boolean){
        updateInstitution(id:$id,name:$name,slug:$slug,type:$type,location:$location,email:$email,phone:$phone,active:$active){ id }
      }`
    : `mutation($name:String!,$slug:String!,$type:String,$location:String,$email:String,$phone:String,$active:Boolean){
        createInstitution(name:$name,slug:$slug,type:$type,location:$location,email:$email,phone:$phone,active:$active){ id }
      }`

  const vars: any = { ...formData.value }
  if (editingInst.value) vars.id = editingInst.value.id
  // basic slug guess
  if (!vars.slug) vars.slug = formData.value.name.toLowerCase().replace(/\s+/g, '-')

  fetch(`${apiBase}/api/institutions/graphql`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...(tokenHeader()),
    },
    body: JSON.stringify({ query: mutation, variables: vars }),
  })
    .then(r => r.json())
    .then((json) => {
      if (json.errors?.length) throw new Error(json.errors[0].message)
      message.success(editingInst.value ? 'Institution updated' : 'Institution created')
      showCreateModal.value = false
      editingInst.value = null
      resetForm()
      loadInstitutions()
    })
    .catch((e) => {
      message.error(e?.message || 'Unable to save institution')
    })
}

function deleteInstitution(id: string) {
  const mutation = `mutation($id:String!){ updateInstitution(id:$id, active:false){ id active } }`
  fetch(`${apiBase}/api/institutions/graphql`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...(tokenHeader()),
    },
    body: JSON.stringify({ query: mutation, variables: { id } }),
  })
    .then(r => r.json())
    .then((json) => {
      if (json.errors?.length) throw new Error(json.errors[0].message)
      message.success('Institution archived')
      loadInstitutions()
    })
    .catch((e) => message.error(e?.message || 'Unable to archive'))
}

function resetForm() {
  formData.value = {
    name: '',
    type: 'University',
    location: '',
    email: '',
    phone: '',
    active: true,
  }
}

function toggleDarkMode() {
  isDarkMode.value = !isDarkMode.value
  applyTheme()
  localStorage.setItem('isDarkMode', JSON.stringify(isDarkMode.value))
}

function applyTheme() {
  const html = document.documentElement
  if (isDarkMode.value) {
    html.classList.add('dark')
  } else {
    html.classList.remove('dark')
  }
}
</script>

<style scoped>
:global(body) {
  background: #f5f7fb;
}

.inst-shell {
  padding: 16px 24px 32px;
  max-width: 1400px;
  margin: 0 auto;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
}
.top-left .title {
  font-size: 24px;
  font-weight: 700;
}
.top-left .subtitle {
  color: #6b7280;
}
.top-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.section {
  margin-top: 16px;
}

.stat-card {
  border-radius: 10px;
}
.stat-label {
  color: #6b7280;
  font-size: 13px;
}
.stat-value {
  font-size: 24px;
  font-weight: 700;
}

.inst-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.inst-card.inactive {
  opacity: 0.6;
}
.card-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
.card-title {
  font-weight: 700;
  font-size: 17px;
}
.card-sub {
  color: #94a3b8;
  font-size: 13px;
}
.card-body {
  display: grid;
  gap: 6px;
  margin: 8px 0;
  font-size: 13px;
}
.card-body .row {
  display: flex;
  justify-content: space-between;
}
.card-body span {
  color: #94a3b8;
}
.card-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  margin-top: auto;
}

:deep(.ant-card) {
  border-radius: 8px;
  transition: all 0.3s ease;
}

:deep(.ant-card:hover) {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

:deep(.ant-card-head) {
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
}
</style>
