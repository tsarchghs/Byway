<template>
  <a-config-provider :theme="{ algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm }">
    <a-layout class="institution-wrap" data-test-id="institution-wrap">
      <!-- GLOBAL STATUS BANNERS -->
      <div class="global-banners">
        <a-alert
          v-if="!isOnline"
          type="warning"
          banner
          show-icon
          message="You're offline. Working in local mode; changes will sync when you reconnect."
          data-test-id="offline-banner"
        />
        <a-alert
          v-if="usingMocks"
          type="info"
          banner
          show-icon
          :message="`Mock data active${mockReason ? ` · ${mockReason}` : ''}`"
          data-test-id="mock-banner"
        />
      </div>

      <!-- PAGE HEADER -->
      <a-page-header
        class="page-header"
        :title="inst?.name || 'Institution'"
        sub-title="Overview"
        data-test-id="page-header"
        @back="$router.push('/institutions')"
      >
        <template #extra>
          <a-space wrap>
            <a-statistic title="Total Departments" :value="departments.length" />
            <a-statistic title="Active Classrooms" :value="classroomStats.active" />
            <a-statistic title="Total Students" :value="totalEnrollment" />
            <a-dropdown trigger="click">
              <a-button>
                <template #icon><SettingOutlined /></template>
                Settings
              </a-button>
              <template #overlay>
                <a-menu>
                  <a-menu-item @click="isDark = !isDark">
                    <BulbOutlined />
                    <span class="ml-1">Toggle Dark Mode</span>
                  </a-menu-item>
                  <a-menu-divider />
                  <a-menu-item @click="clearLocalData">
                    <DeleteOutlined />
                    <span class="ml-1">Clear Local Data</span>
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </a-space>
        </template>
      </a-page-header>

      <a-layout>
        <!-- LEFT SIDER: DEPARTMENTS -->
        <a-layout-sider
          width="300"
          class="left-sider"
          collapsible
          v-model:collapsed="siderCollapsed"
          :collapsed-width="60"
          data-test-id="left-sider"
        >
          <div class="sider-inner">
            <a-card :title="$t('Departments')" :bordered="false">
              <a-button type="primary" block class="mb-3" @click="openNewDeptModal = true">
                + Add Department
              </a-button>

              <a-input-search
                v-model:value="deptFilter"
                placeholder="Search departments..."
                allow-clear
                class="mb-3"
                data-test-id="dept-search"
              />

              <!-- Department List -->
              <a-empty v-if="filteredDepartments.length === 0" description="No departments yet" />
              <a-list v-else :data-source="filteredDepartments" :render-item="renderDeptItem" size="small">
                <template #renderItem="{ item: dept }">
                  <a-list-item
                    :class="['dept-row', selectedDept?.id === dept.id && 'active']"
                    @click="selectDepartment(dept)"
                    style="cursor: pointer"
                  >
                    <a-list-item-meta
                      :title="dept.name"
                      :description="`${classroomsByDept(dept.id).length} classrooms`"
                    />
                  </a-list-item>
                </template>
              </a-list>
            </a-card>

            <!-- FILTERS -->
            <a-card :title="$t('Filters')" :bordered="false" class="mt-3">
              <a-space direction="vertical" style="width: 100%">
                <a-checkbox v-model:checked="filterActive" data-test-id="filter-active">
                  Active Only
                </a-checkbox>
                <a-checkbox v-model:checked="filterFull" data-test-id="filter-full">
                  Full Classrooms
                </a-checkbox>
              </a-space>
            </a-card>
          </div>
        </a-layout-sider>

        <!-- CENTER CONTENT: CLASSROOMS -->
        <a-layout-content class="content" data-test-id="content">
          <div class="mb-4">
            <a-row :gutter="16" class="mb-4">
              <a-col :xs="24" :sm="8">
                <a-card :bordered="false">
                  <a-statistic title="Total Departments" :value="departments.length" />
                </a-card>
              </a-col>
              <a-col :xs="24" :sm="8">
                <a-card :bordered="false">
                  <a-statistic title="Total Classrooms" :value="classroomStats.total" />
                </a-card>
              </a-col>
              <a-col :xs="24" :sm="8">
                <a-card :bordered="false">
                  <a-statistic title="Total Enrollment" :value="totalEnrollment" />
                </a-card>
              </a-col>
            </a-row>
          </div>

          <a-card
            :title="selectedDept ? `${selectedDept.name} - Classrooms` : 'All Classrooms'"
            :bordered="false"
            class="mb-4"
          >
            <template #extra>
              <a-button type="primary" @click="openNewClassModal = true">
                + New Classroom
              </a-button>
            </template>

            <a-input-search
              v-model:value="classFilter"
              placeholder="Search classrooms..."
              allow-clear
              class="mb-4"
              data-test-id="class-search"
            />

            <!-- Classrooms Grid -->
            <a-empty v-if="filteredClassrooms.length === 0" description="No classrooms found" />

            <a-row :gutter="16" v-else>
              <a-col
                v-for="classroom in filteredClassrooms"
                :key="classroom.id"
                :xs="24"
                :sm="12"
                :md="8"
              >
                <a-card
                  hoverable
                  :title="classroom.title"
                  @click="selectClassroom(classroom)"
                  :bordered="selectedClassroom?.id === classroom.id"
                  data-test-id="classroom-card"
                >
                  <template #extra>
                    <a-tag
                      :color="classroom.status === 'active' ? 'green' : 'default'"
                    >
                      {{ classroom.status || 'Pending' }}
                    </a-tag>
                  </template>

                  <a-descriptions :column="1" size="small" :bordered="false">
                    <a-descriptions-item label="Code">
                      {{ classroom.code }}
                    </a-descriptions-item>
                    <a-descriptions-item label="Enrollment">
                      {{ classroom.enrollment || 0 }} / {{ classroom.capacity || 30 }}
                    </a-descriptions-item>
                    <a-descriptions-item label="Capacity Used">
                      <a-progress
                        type="circle"
                        :percent="Math.round((classroom.enrollment || 0) / (classroom.capacity || 30) * 100)"
                        :size="40"
                      />
                    </a-descriptions-item>
                  </a-descriptions>

                  <a-space class="mt-3" style="width: 100%">
                    <a-button
                      size="small"
                      @click.stop="editClassroom(classroom)"
                      data-test-id="edit-btn"
                    >
                      Edit
                    </a-button>
                    <a-popconfirm
                      title="Delete Classroom?"
                      description="Are you sure you want to delete this classroom?"
                      @confirm="deleteClassroom(classroom.id)"
                      ok-text="Yes"
                      cancel-text="No"
                    >
                      <a-button size="small" danger @click.stop>Delete</a-button>
                    </a-popconfirm>
                  </a-space>
                </a-card>
              </a-col>
            </a-row>
          </a-card>
        </a-layout-content>

        <!-- RIGHT SIDER: DETAIL PANEL -->
        <a-layout-sider
          v-if="selectedClassroom"
          width="320"
          class="right-sider"
          collapsible
          v-model:collapsed="rightCollapsed"
          :collapsed-width="60"
          data-test-id="right-sider"
        >
          <a-card :title="$t('Classroom Details')" :bordered="false" class="sider-inner">
            <a-descriptions :column="1" size="small" :bordered="false">
              <a-descriptions-item label="Title">
                {{ selectedClassroom.title }}
              </a-descriptions-item>
              <a-descriptions-item label="Code">
                {{ selectedClassroom.code }}
              </a-descriptions-item>
              <a-descriptions-item label="Department">
                {{ getDeptName(selectedClassroom.institutionId) }}
              </a-descriptions-item>
              <a-descriptions-item label="Capacity">
                {{ selectedClassroom.capacity || 30 }}
              </a-descriptions-item>
              <a-descriptions-item label="Enrollment">
                {{ selectedClassroom.enrollment || 0 }}
              </a-descriptions-item>
              <a-descriptions-item label="Enrollment %">
                {{ Math.round((selectedClassroom.enrollment || 0) / (selectedClassroom.capacity || 30) * 100) }}%
              </a-descriptions-item>
              <a-descriptions-item label="Status">
                <a-tag :color="selectedClassroom.status === 'active' ? 'green' : 'default'">
                  {{ selectedClassroom.status || 'Pending' }}
                </a-tag>
              </a-descriptions-item>
              <a-descriptions-item label="Created">
                {{ new Date(selectedClassroom.createdAt).toLocaleDateString() }}
              </a-descriptions-item>
            </a-descriptions>

            <a-progress
              class="mt-3"
              :percent="Math.round((selectedClassroom.enrollment || 0) / (selectedClassroom.capacity || 30) * 100)"
              status="active"
            />

            <a-space class="mt-4" style="width: 100%">
              <a-button type="primary" block @click="editClassroom(selectedClassroom)">
                Edit Classroom
              </a-button>
              <a-popconfirm
                title="Delete Classroom?"
                description="Are you sure?"
                @confirm="deleteClassroom(selectedClassroom.id)"
                ok-text="Yes"
                cancel-text="No"
              >
                <a-button danger block>Delete</a-button>
              </a-popconfirm>
            </a-space>
          </a-card>
        </a-layout-sider>
      </a-layout>
    </a-layout>

    <!-- MODALS -->

    <!-- New Department Modal -->
    <a-modal
      v-model:open="openNewDeptModal"
      title="New Department"
      @ok="createDepartment"
      @cancel="openNewDeptModal = false"
      data-test-id="dept-modal"
    >
      <a-form layout="vertical">
        <a-form-item label="Department Name">
          <a-input
            v-model:value="newDeptName"
            placeholder="e.g., Computer Science"
            data-test-id="dept-name-input"
          />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- New/Edit Classroom Modal -->
    <a-modal
      v-model:open="openNewClassModal"
      :title="`${editingClass ? 'Edit' : 'New'} Classroom`"
      @ok="saveClassroom"
      @cancel="closeClassModal"
      data-test-id="class-modal"
    >
      <a-form layout="vertical">
        <a-form-item label="Title">
          <a-input
            v-model:value="classForm.title"
            placeholder="Classroom title"
            data-test-id="class-title-input"
          />
        </a-form-item>
        <a-form-item label="Code">
          <a-input
            v-model:value="classForm.code"
            placeholder="e.g., CS101"
            data-test-id="class-code-input"
          />
        </a-form-item>
        <a-form-item label="Department">
          <a-select
            v-model:value="classForm.deptId"
            placeholder="Select a department"
            data-test-id="dept-select"
          >
            <a-select-option value="">-- Choose --</a-select-option>
            <a-select-option v-for="dept in departments" :key="dept.id" :value="dept.id">
              {{ dept.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="Capacity">
          <a-input-number
            v-model:value="classForm.capacity"
            :min="1"
            :max="500"
            data-test-id="capacity-input"
          />
        </a-form-item>
        <a-form-item label="Current Enrollment">
          <a-input-number
            v-model:value="classForm.enrollment"
            :min="0"
            data-test-id="enrollment-input"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </a-config-provider>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { theme, message } from 'ant-design-vue'
import { SettingOutlined, BulbOutlined, DeleteOutlined } from '@ant-design/icons-vue'


// Types
type Department = { id: string; name: string; createdAt: string }
type Classroom = {
  id: string
  institutionId: string
  title: string
  code: string
  capacity: number
  enrollment: number
  status?: string
  createdAt: string
}

// Route & Router
const route = useRoute()
const router = useRouter()

// State
const isDark = ref(false)
const inst = ref<any>(null)
const departments = ref<Department[]>([])
const classrooms = ref<Classroom[]>([])
const selectedDept = ref<Department | null>(null)
const selectedClassroom = ref<Classroom | null>(null)

// UI State
const isOnline = ref(typeof navigator !== 'undefined' ? navigator.onLine : true)
const usingMocks = ref(false)
const mockReason = ref('')

// Filters & Search
const deptFilter = ref('')
const classFilter = ref('')
const filterActive = ref(false)
const filterFull = ref(false)

// Modals
const openNewDeptModal = ref(false)
const openNewClassModal = ref(false)
const siderCollapsed = ref(false)
const rightCollapsed = ref(false)
const newDeptName = ref('')
const editingClass = ref<Classroom | null>(null)
const classForm = reactive({
  title: '',
  code: '',
  deptId: '',
  capacity: 30,
  enrollment: 0
})

// Mock data
function makeMockInstitution(instId: string) {
  return {
    id: instId || 'inst-1',
    name: 'Demo University',
    description: 'A comprehensive institution management system',
    createdAt: new Date().toISOString()
  }
}

function makeMockDepartments(): Department[] {
  return [
    { id: 'dept-1', name: 'Computer Science', createdAt: new Date().toISOString() },
    { id: 'dept-2', name: 'Mathematics', createdAt: new Date().toISOString() },
    { id: 'dept-3', name: 'Physics', createdAt: new Date().toISOString() }
  ]
}

function makeMockClassrooms(): Classroom[] {
  return [
    {
      id: 'cls-1',
      institutionId: 'dept-1',
      title: 'Introduction to Programming',
      code: 'CS101',
      capacity: 30,
      enrollment: 28,
      status: 'active',
      createdAt: new Date().toISOString()
    },
    {
      id: 'cls-2',
      institutionId: 'dept-1',
      title: 'Data Structures',
      code: 'CS201',
      capacity: 25,
      enrollment: 22,
      status: 'active',
      createdAt: new Date().toISOString()
    },
    {
      id: 'cls-3',
      institutionId: 'dept-2',
      title: 'Calculus I',
      code: 'MATH101',
      capacity: 35,
      enrollment: 32,
      status: 'active',
      createdAt: new Date().toISOString()
    },
    {
      id: 'cls-4',
      institutionId: 'dept-3',
      title: 'Mechanics',
      code: 'PHYS101',
      capacity: 40,
      enrollment: 38,
      status: 'active',
      createdAt: new Date().toISOString()
    }
  ]
}

// Computed Properties
const filteredDepartments = computed(() => {
  return departments.value.filter(d =>
    d.name.toLowerCase().includes(deptFilter.value.toLowerCase())
  )
})

const filteredClassrooms = computed(() => {
  let filtered = classrooms.value
    .filter(c => selectedDept.value ? c.institutionId === selectedDept.value.id : true)
    .filter(c => c.title.toLowerCase().includes(classFilter.value.toLowerCase()))

  if (filterActive.value) {
    filtered = filtered.filter(c => c.status === 'active')
  }
  if (filterFull.value) {
    filtered = filtered.filter(c => (c.enrollment || 0) >= (c.capacity || 30) * 0.9)
  }

  return filtered
})

const classroomStats = computed(() => {
  const total = classrooms.value.length
  const active = classrooms.value.filter(c => c.status === 'active').length
  return { total, active }
})

const totalEnrollment = computed(() => {
  return classrooms.value.reduce((sum, c) => sum + (c.enrollment || 0), 0)
})

// Methods
function selectDepartment(dept: Department) {
  selectedDept.value = selectedDept.value?.id === dept.id ? null : dept
}

function selectClassroom(classroom: Classroom) {
  selectedClassroom.value = classroom
}

function classroomsByDept(deptId: string): Classroom[] {
  return classrooms.value.filter(c => c.institutionId === deptId)
}

function getDeptName(deptId: string): string {
  return departments.value.find(d => d.id === deptId)?.name || 'Unknown'
}

function createDepartment() {
  if (!newDeptName.value.trim()) return

  const newDept: Department = {
    id: 'dept-' + Date.now(),
    name: newDeptName.value.trim(),
    createdAt: new Date().toISOString()
  }

  departments.value.push(newDept)
  newDeptName.value = ''
  openNewDeptModal.value = false
  persistData()
}

function editClassroom(classroom: Classroom) {
  editingClass.value = classroom
  classForm.title = classroom.title
  classForm.code = classroom.code
  classForm.deptId = classroom.institutionId
  classForm.capacity = classroom.capacity
  classForm.enrollment = classroom.enrollment
  openNewClassModal.value = true
}

function closeClassModal() {
  openNewClassModal.value = false
  editingClass.value = null
  classForm.title = ''
  classForm.code = ''
  classForm.deptId = ''
  classForm.capacity = 30
  classForm.enrollment = 0
}

function saveClassroom() {
  if (!classForm.title.trim() || !classForm.code.trim() || !classForm.deptId) {
    message.error('Please fill all fields')
    return
  }

  if (editingClass.value) {
    const idx = classrooms.value.findIndex(c => c.id === editingClass.value!.id)
    if (idx >= 0) {
      classrooms.value[idx] = {
        ...classrooms.value[idx],
        title: classForm.title,
        code: classForm.code,
        institutionId: classForm.deptId,
        capacity: classForm.capacity,
        enrollment: classForm.enrollment
      }
    }
  } else {
    const newClass: Classroom = {
      id: 'cls-' + Date.now(),
      institutionId: classForm.deptId,
      title: classForm.title,
      code: classForm.code,
      capacity: classForm.capacity,
      enrollment: classForm.enrollment,
      status: 'active',
      createdAt: new Date().toISOString()
    }
    classrooms.value.push(newClass)
  }

  closeClassModal()
  persistData()
}

function deleteClassroom(id: string) {
  if (confirm('Are you sure?')) {
    classrooms.value = classrooms.value.filter(c => c.id !== id)
    if (selectedClassroom.value?.id === id) selectedClassroom.value = null
    persistData()
  }
}

// Persistence
const LS_KEY = `institution.${route.params.id}`

function persistData() {
  try {
    const data = { inst: inst.value, departments: departments.value, classrooms: classrooms.value }
    localStorage.setItem(LS_KEY, JSON.stringify(data))
  } catch {}
}

function loadLocalData() {
  try {
    const data = localStorage.getItem(LS_KEY)
    if (data) {
      const parsed = JSON.parse(data)
      if (parsed.inst) inst.value = parsed.inst
      if (parsed.departments) departments.value = parsed.departments
      if (parsed.classrooms) classrooms.value = parsed.classrooms
    }
  } catch {}
}

function clearLocalData() {
  if (confirm('Clear all local data?')) {
    localStorage.removeItem(LS_KEY)
    inst.value = makeMockInstitution(String(route.params.id))
    departments.value = makeMockDepartments()
    classrooms.value = makeMockClassrooms()
  }
}

// Event listeners
function onOnline() { isOnline.value = true }
function onOffline() { isOnline.value = false }

// Lifecycle
onMounted(() => {
  window.addEventListener('online', onOnline)
  window.addEventListener('offline', onOffline)

  // Load local data first
  loadLocalData()

  // Then load/mock
  if (!inst.value || !departments.value.length) {
    inst.value = makeMockInstitution(String(route.params.id))
    departments.value = makeMockDepartments()
    classrooms.value = makeMockClassrooms()
    usingMocks.value = true
    mockReason.value = 'Using demo data'
    persistData()
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('online', onOnline)
  window.removeEventListener('offline', onOffline)
})

// Watch for dark mode
watch(isDark, (v) => {
  if (v) document.documentElement.classList.add('dark')
  else document.documentElement.classList.remove('dark')
})

// i18n helper (simple version)
function $t(key: string) {
  const translations: Record<string, string> = {
    'Departments': 'Departments',
    'Filters': 'Filters',
    'Classroom Details': 'Classroom Details'
  }
  return translations[key] || key
}
</script>

<style scoped>
.institution-wrap {
  min-height: 100vh;
}

.global-banners {
  position: sticky;
  top: 0;
  z-index: 5;
}

.global-banners :deep(.ant-alert) {
  border-radius: 0;
}

.page-header {
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
  position: sticky;
  top: 0;
  z-index: 9;
}

.left-sider,
.right-sider {
  background: transparent;
}

.sider-inner {
  padding: 12px;
}

.content {
  padding: 24px;
}

.dept-row {
  border-radius: 6px;
  transition: background-color 0.15s ease;
  padding: 8px;
}

.dept-row:hover {
  background-color: #f5f5f5;
}

.dept-row.active {
  background-color: #e6f7ff;
  border-left: 3px solid #1890ff;
}

.mt-1 {
  margin-top: 8px;
}

.mt-3 {
  margin-top: 12px;
}

.mt-4 {
  margin-top: 16px;
}

.mb-3 {
  margin-bottom: 12px;
}

.mb-4 {
  margin-bottom: 16px;
}

.ml-1 {
  margin-left: 6px;
}

/* Dark mode support */
:deep(.ant-config-provider[class*="dark"]) {
  .page-header {
    background: #141414;
    border-bottom-color: #434343;
  }

  .dept-row:hover {
    background-color: #262626;
  }

  .dept-row.active {
    background-color: #111a26;
  }
}
</style>
