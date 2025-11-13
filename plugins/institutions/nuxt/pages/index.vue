<template>
  <a-layout class="min-h-screen">
    <a-layout-header class="bg-white sticky top-0 z-10 px-6 flex items-center justify-between shadow-sm">
      <h1 class="text-2xl font-bold">Institutions</h1>
      <a-space>
        <a-button type="primary" @click="showCreateModal = true">
          <template #icon><plus-outlined /></template>
          Add Institution
        </a-button>
        <a-button @click="toggleDarkMode">
          <template #icon><bg-colors-outlined /></template>
        </a-button>
      </a-space>
    </a-layout-header>

    <a-layout-content class="p-6">
      <!-- Statistics Cards -->
      <a-row :gutter="16" class="mb-6">
        <a-col :xs="24" :sm="12" :md="6">
          <a-statistic
            title="Total Institutions"
            :value="institutions.length"
            :value-style="{ color: '#1890ff' }"
          >
            <template #prefix><building-outlined /></template>
          </a-statistic>
        </a-col>
        <a-col :xs="24" :sm="12" :md="6">
          <a-statistic
            title="Active"
            :value="institutions.filter(i => i.active).length"
            :value-style="{ color: '#52c41a' }"
          >
            <template #prefix><check-circle-outlined /></template>
          </a-statistic>
        </a-col>
        <a-col :xs="24" :sm="12" :md="6">
          <a-statistic
            title="Total Departments"
            :value="institutions.reduce((sum, i) => sum + (i.departments?.length || 0), 0)"
            :value-style="{ color: '#faad14' }"
          >
            <template #prefix><team-outlined /></template>
          </a-statistic>
        </a-col>
        <a-col :xs="24" :sm="12" :md="6">
          <a-statistic
            title="Total Students"
            :value="totalStudents"
            :value-style="{ color: '#eb2f96' }"
          >
            <template #prefix><user-outlined /></template>
          </a-statistic>
        </a-col>
      </a-row>

      <!-- Search & Filter -->
      <a-card class="mb-6" :bordered="false">
        <a-space direction="vertical" style="width: 100%">
          <a-row :gutter="16">
            <a-col :xs="24" :sm="12">
              <a-input-search
                v-model:value="searchQuery"
                placeholder="Search institutions..."
                @search="onSearch"
              >
                <template #prefix><search-outlined /></template>
              </a-input-search>
            </a-col>
            <a-col :xs="24" :sm="12">
              <a-select
                v-model:value="filterStatus"
                style="width: 100%"
                @change="onFilterChange"
              >
                <a-select-option value="">All Status</a-select-option>
                <a-select-option value="active">Active</a-select-option>
                <a-select-option value="inactive">Inactive</a-select-option>
              </a-select>
            </a-col>
          </a-row>
        </a-space>
      </a-card>

      <!-- Institutions List -->
      <a-empty v-if="filteredInstitutions.length === 0" description="No institutions found" class="py-12" />

      <a-row v-else :gutter="16">
        <a-col v-for="inst in paginatedInstitutions" :key="inst.id" :xs="24" :sm="12" :lg="8">
          <a-card hoverable class="h-full flex flex-col" :class="{ 'opacity-60': !inst.active }">
            <!-- Card Header -->
            <template #title>
              <a-space>
                <building-outlined style="font-size: 20px; color: #1890ff" />
                <span class="font-semibold">{{ inst.name }}</span>
              </a-space>
            </template>

            <!-- Status Tag -->
            <a-tag :color="inst.active ? 'success' : 'error'" class="mb-3">
              {{ inst.active ? 'Active' : 'Inactive' }}
            </a-tag>

            <!-- Institution Details -->
            <div class="mb-4 text-sm text-gray-600">
              <div class="mb-2">
                <strong>Type:</strong> {{ inst.type }}
              </div>
              <div class="mb-2">
                <strong>Location:</strong> {{ inst.location }}
              </div>
              <div v-if="inst.email" class="mb-2">
                <strong>Email:</strong> {{ inst.email }}
              </div>
              <div v-if="inst.phone" class="mb-2">
                <strong>Phone:</strong> {{ inst.phone }}
              </div>
            </div>

            <!-- Departments Info -->
            <a-divider class="my-3" />
            <div class="mb-4">
              <div class="text-sm font-semibold mb-2">Departments</div>
              <a-progress
                :percent="Math.round((inst.departments?.length || 0) / 10 * 100)"
                :format="() => `${inst.departments?.length || 0} departments`"
              />
            </div>

            <!-- Students Count -->
            <div class="mb-4">
              <div class="text-sm font-semibold mb-2">Students</div>
              <a-statistic
                :value="calculateStudentCount(inst)"
                :value-style="{ fontSize: '16px', color: '#1890ff' }"
              >
                <template #prefix><user-outlined /></template>
              </a-statistic>
            </div>

            <!-- Actions -->
            <template #extra>
              <a-space>
                <a-button type="text" size="small" @click="editInstitution(inst)">
                  <template #icon><edit-outlined /></template>
                </a-button>
                <a-popconfirm
                  title="Delete Institution"
                  description="Are you sure you want to delete this institution?"
                  ok-text="Yes"
                  cancel-text="No"
                  @confirm="deleteInstitution(inst.id)"
                >
                  <a-button type="text" danger size="small">
                    <template #icon><delete-outlined /></template>
                  </a-button>
                </a-popconfirm>
                <a-button type="primary" size="small" @click="navigateTo(`/institutions/${inst.id}`)">
                  Open
                </a-button>
              </a-space>
            </template>
          </a-card>
        </a-col>
      </a-row>

      <!-- Pagination -->
      <div class="mt-6 flex justify-center">
        <a-pagination
          v-model:current="currentPage"
          :total="filteredInstitutions.length"
          :page-size="pageSize"
          show-size-changer
          :show-total="(total) => `Total ${total} institutions`"
        />
      </div>
    </a-layout-content>
  </a-layout>

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
import { message } from 'ant-design-vue'
import {
  PlusOutlined,
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
  type: string
  location: string
  email?: string
  phone?: string
  active: boolean
  departments?: Array<{ id: string; name: string; studentCount?: number }>
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

function loadInstitutions() {
  const saved = localStorage.getItem('institutions')
  if (saved) {
    institutions.value = JSON.parse(saved)
  } else {
    institutions.value = [
      {
        id: 'inst-1',
        name: 'Demo University',
        type: 'University',
        location: 'New York, USA',
        email: 'info@demouniv.edu',
        phone: '+1-800-123-4567',
        active: true,
        departments: [
          { id: 'dep-1', name: 'Computer Science', studentCount: 450 },
          { id: 'dep-2', name: 'Engineering', studentCount: 380 },
          { id: 'dep-3', name: 'Business', studentCount: 320 },
        ],
      },
      {
        id: 'inst-2',
        name: 'Tech Faculty',
        type: 'College',
        location: 'San Francisco, USA',
        email: 'contact@techfaculty.edu',
        phone: '+1-888-999-7777',
        active: true,
        departments: [
          { id: 'dep-4', name: 'Software Engineering', studentCount: 280 },
          { id: 'dep-5', name: 'Data Science', studentCount: 200 },
        ],
      },
      {
        id: 'inst-3',
        name: 'Global Institute',
        type: 'Institute',
        location: 'London, UK',
        email: 'hello@globalinst.org',
        phone: '+44-20-1234-5678',
        active: false,
        departments: [
          { id: 'dep-6', name: 'International Studies', studentCount: 150 },
        ],
      },
    ]
    saveInstitutions()
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

  if (editingInst.value) {
    const index = institutions.value.findIndex(i => i.id === editingInst.value!.id)
    if (index > -1) {
      institutions.value[index] = {
        ...institutions.value[index],
        ...formData.value,
      }
      message.success('Institution updated successfully')
    }
  } else {
    const newInst: Institution = {
      id: `inst-${Date.now()}`,
      ...formData.value,
      departments: [],
    }
    institutions.value.push(newInst)
    message.success('Institution created successfully')
  }

  saveInstitutions()
  showCreateModal.value = false
  editingInst.value = null
  resetForm()
}

function deleteInstitution(id: string) {
  institutions.value = institutions.value.filter(i => i.id !== id)
  saveInstitutions()
  message.success('Institution deleted successfully')
}

function saveInstitutions() {
  localStorage.setItem('institutions', JSON.stringify(institutions.value))
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
