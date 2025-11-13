<template>
  <a-config-provider :theme="{ algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm }">
    <a-layout :class="['assignments-wrap', isDark ? 'is-dark' : '']">
      <!-- Header with navigation -->
      <a-page-header class="page-header" title="Assignments" sub-title="Manage your coursework">
        <template #extra>
          <a-space>
            <a-button type="primary" @click="showCreateModal = true">
              <template #icon><span>+</span></template>
              New Assignment
            </a-button>
            <a-button :type="isDark ? 'default' : 'text'" @click="isDark = !isDark">
              {{ isDark ? '☀️ Light' : '🌙 Dark' }}
            </a-button>
          </a-space>
        </template>
      </a-page-header>

      <div class="p-4">
        <!-- Statistics Dashboard -->
        <a-row :gutter="[12, 12]" class="mb-4">
          <a-col :xs="12" :sm="12" :md="6">
            <a-statistic title="Total Assignments" :value="allAssignments.length" />
          </a-col>
          <a-col :xs="12" :sm="12" :md="6">
            <a-statistic title="Due Soon" :value="upcomingCount" :value-style="{ color: '#faad14' }" />
          </a-col>
          <a-col :xs="12" :sm="12" :md="6">
            <a-statistic title="Graded" :value="gradedCount" :value-style="{ color: '#52c41a' }" />
          </a-col>
          <a-col :xs="12" :sm="12" :md="6">
            <a-statistic title="Completion Rate" :value="`${completionRate}%`" :precision="0" :value-style="{ color: '#1890ff' }" />
          </a-col>
        </a-row>

        <!-- Filters -->
        <a-card class="mb-4" :bordered="false">
          <a-space wrap>
            <a-input-search 
              v-model:value="searchQuery" 
              placeholder="Search assignments..."
              style="width: 200px"
            />
            <a-select 
              v-model:value="filterStatus" 
              style="width: 150px"
              @change="filterStatus = $event"
            >
              <a-select-option value="">All Status</a-select-option>
              <a-select-option value="due">Due</a-select-option>
              <a-select-option value="assigned">Assigned</a-select-option>
              <a-select-option value="graded">Graded</a-select-option>
            </a-select>
            <a-select 
              v-model:value="sortBy" 
              style="width: 150px"
            >
              <a-select-option value="dueDate">Due Date</a-select-option>
              <a-select-option value="course">Course</a-select-option>
              <a-select-option value="status">Status</a-select-option>
            </a-select>
          </a-space>
        </a-card>

        <!-- Upcoming Assignments -->
        <a-row :gutter="[12, 12]">
          <a-col :xs="24" :md="12">
            <a-card title="📋 Upcoming" :bordered="false" class="card-section">
              <a-skeleton v-if="loading" active :paragraph="{ rows: 4 }" class="mb-2" />
              <a-empty v-else-if="filteredUpcoming.length === 0" description="No upcoming assignments" />
              <a-list 
                v-else 
                :data-source="filteredUpcoming" 
                :render-item="renderUpcoming"
                :pagination="{ pageSize: 5, position: 'bottom' }"
              />
            </a-card>
          </a-col>

          <a-col :xs="24" :md="12">
            <a-card title="✅ Recently Graded" :bordered="false" class="card-section">
              <a-skeleton v-if="loading" active :paragraph="{ rows: 4 }" class="mb-2" />
              <a-empty v-else-if="filteredGraded.length === 0" description="No graded assignments" />
              <a-list 
                v-else 
                :data-source="filteredGraded" 
                :render-item="renderGraded"
                :pagination="{ pageSize: 5, position: 'bottom' }"
              />
            </a-card>
          </a-col>
        </a-row>

        <!-- All Assignments Table View -->
        <a-card title="📊 All Assignments" :bordered="false" class="mt-4">
          <a-table
            :columns="columns"
            :data-source="filteredAssignments"
            :loading="loading"
            :pagination="{ pageSize: 10, position: 'both' }"
            :scroll="{ x: 600 }"
            row-key="id"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'status'">
                <a-tag :color="getStatusColor(record.status)">
                  {{ record.status }}
                </a-tag>
              </template>
              <template v-else-if="column.key === 'grade'">
                <span v-if="record.graded">{{ record.grade }}%</span>
                <span v-else class="text-gray-400">—</span>
              </template>
              <template v-else-if="column.key === 'dueDate'">
                {{ formatDate(record.dueDate) }}
              </template>
              <template v-else-if="column.key === 'actions'">
                <a-space size="small">
                  <a-button type="link" size="small" @click="viewAssignment(record)">View</a-button>
                  <a-button type="link" size="small" @click="editAssignment(record)">Edit</a-button>
                  <a-popconfirm title="Delete this assignment?" @confirm="deleteAssignment(record.id)">
                    <a-button type="link" danger size="small">Delete</a-button>
                  </a-popconfirm>
                </a-space>
              </template>
            </template>
          </a-table>
        </a-card>

        <!-- Detail Modal -->
        <a-modal 
          v-model:visible="showDetailModal" 
          title="Assignment Details"
          :footer="null"
          width="600px"
        >
          <div v-if="selectedAssignment" class="space-y-4">
            <a-descriptions :column="1" bordered size="small">
              <a-descriptions-item label="Title">
                {{ selectedAssignment.title }}
              </a-descriptions-item>
              <a-descriptions-item label="Course">
                {{ selectedAssignment.course }}
              </a-descriptions-item>
              <a-descriptions-item label="Status">
                <a-tag :color="getStatusColor(selectedAssignment.status)">
                  {{ selectedAssignment.status }}
                </a-tag>
              </a-descriptions-item>
              <a-descriptions-item label="Due Date">
                {{ formatDate(selectedAssignment.dueDate) }}
              </a-descriptions-item>
              <a-descriptions-item v-if="selectedAssignment.graded" label="Grade">
                <a-progress :percent="selectedAssignment.grade" status="success" />
              </a-descriptions-item>
              <a-descriptions-item v-if="selectedAssignment.graded" label="Graded Date">
                {{ formatDate(selectedAssignment.gradedAt) }}
              </a-descriptions-item>
              <a-descriptions-item label="Description">
                {{ selectedAssignment.description || 'No description' }}
              </a-descriptions-item>
            </a-descriptions>
            <a-button type="primary" block @click="$router.push(`/modules/${selectedAssignment.moduleId || 'mock'}/view`)">
              Open Assignment
            </a-button>
          </div>
        </a-modal>

        <!-- Create/Edit Modal -->
        <a-modal 
          v-model:visible="showCreateModal" 
          :title="editingId ? 'Edit Assignment' : 'Create Assignment'"
          @ok="saveAssignment"
          width="600px"
        >
          <a-form :model="formData" layout="vertical">
            <a-form-item label="Title" required>
              <a-input v-model:value="formData.title" placeholder="Assignment title" />
            </a-form-item>
            <a-form-item label="Course" required>
              <a-input v-model:value="formData.course" placeholder="Course name" />
            </a-form-item>
            <a-form-item label="Description">
              <a-textarea v-model:value="formData.description" rows="4" />
            </a-form-item>
            <a-form-item label="Due Date" required>
              <a-date-picker v-model:value="formData.dueDate" style="width: 100%" />
            </a-form-item>
            <a-form-item label="Status" required>
              <a-select v-model:value="formData.status">
                <a-select-option value="assigned">Assigned</a-select-option>
                <a-select-option value="due">Due</a-select-option>
                <a-select-option value="graded">Graded</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item v-if="formData.status === 'graded'" label="Grade (%)">
              <a-input-number v-model:value="formData.grade" :min="0" :max="100" />
            </a-form-item>
          </a-form>
        </a-modal>
      </div>
    </a-layout>
  </a-config-provider>
</template>

<script setup lang="ts">
import { ref, h, onMounted, computed, resolveComponent } from 'vue'
import { theme } from 'ant-design-vue'
import dayjs from 'dayjs'
import { definePageMeta } from '#imports'

definePageMeta({ layout: 'student', title: 'Assignments' })

const isDark = ref(false)
const loading = ref(false)
const showDetailModal = ref(false)
const showCreateModal = ref(false)
const selectedAssignment = ref<any>(null)
const editingId = ref<string | null>(null)
const searchQuery = ref('')
const filterStatus = ref('')
const sortBy = ref('dueDate')

const allAssignments = ref<any[]>([])
const formData = ref({
  title: '',
  course: '',
  description: '',
  dueDate: null,
  status: 'assigned',
  grade: undefined,
  moduleId: ''
})

const columns = [
  { title: 'Title', dataIndex: 'title', key: 'title', width: 150 },
  { title: 'Course', dataIndex: 'course', key: 'course', width: 120 },
  { title: 'Status', dataIndex: 'status', key: 'status', width: 100 },
  { title: 'Due Date', dataIndex: 'dueDate', key: 'dueDate', width: 120 },
  { title: 'Grade', dataIndex: 'grade', key: 'grade', width: 80 },
  { title: 'Actions', key: 'actions', width: 150, fixed: 'right' }
]

const upcomingCount = computed(() => allAssignments.value.filter(a => a.status === 'due' || a.status === 'assigned').length)
const gradedCount = computed(() => allAssignments.value.filter(a => a.status === 'graded').length)
const completionRate = computed(() => gradedCount.value > 0 ? Math.round((gradedCount.value / allAssignments.value.length) * 100) : 0)

const filteredAssignments = computed(() => {
  let filtered = allAssignments.value
  
  if (searchQuery.value) {
    filtered = filtered.filter(a => 
      a.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      a.course.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }
  
  if (filterStatus.value) {
    filtered = filtered.filter(a => a.status === filterStatus.value)
  }
  
  if (sortBy.value === 'dueDate') {
    filtered.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
  } else if (sortBy.value === 'course') {
    filtered.sort((a, b) => a.course.localeCompare(b.course))
  } else if (sortBy.value === 'status') {
    filtered.sort((a, b) => a.status.localeCompare(b.status))
  }
  
  return filtered
})

const filteredUpcoming = computed(() => 
  filteredAssignments.value.filter(a => a.status === 'due' || a.status === 'assigned')
)

const filteredGraded = computed(() => 
  filteredAssignments.value.filter(a => a.status === 'graded')
)

function renderUpcoming(item: any) {
  return h('a-list-item', {}, [
    h('div', { class: 'assignment-item' }, [
      h('div', { class: 'assignment-meta' }, [
        h('div', { class: 'assignment-title' }, item.title),
        h('div', { class: 'assignment-course' }, item.course)
      ]),
      h('div', { class: 'assignment-actions' }, [
        h(resolveComponent('a-space'), {}, { 
          default: () => [
            h(resolveComponent('a-tag'), { color: item.status === 'due' ? 'gold' : 'blue' }, 
              { default: () => item.status }
            ),
            h(resolveComponent('a-button'), { 
              type: 'link', 
              size: 'small',
              onClick: () => viewAssignment(item)
            }, { default: () => 'Details' })
          ]
        })
      ])
    ])
  ])
}

function renderGraded(item: any) {
  return h('a-list-item', {}, [
    h('div', { class: 'assignment-item' }, [
      h('div', { class: 'assignment-meta' }, [
        h('div', { class: 'assignment-title' }, item.title),
        h('div', { class: 'assignment-course' }, item.course)
      ]),
      h('div', { class: 'assignment-actions' }, [
        h(resolveComponent('a-space'), {}, { 
          default: () => [
            h(resolveComponent('a-tag'), { color: 'green' }, 
              { default: () => `${item.grade}%` }
            ),
            h(resolveComponent('a-button'), { 
              type: 'link',
              size: 'small',
              onClick: () => viewAssignment(item)
            }, { default: () => 'View' })
          ]
        })
      ])
    ])
  ])
}

function getStatusColor(status: string) {
  const colors: Record<string, string> = {
    due: 'gold',
    assigned: 'blue',
    graded: 'green'
  }
  return colors[status] || 'default'
}

function formatDate(date: any) {
  return dayjs(date).format('MMM DD, YYYY')
}

function viewAssignment(item: any) {
  selectedAssignment.value = item
  showDetailModal.value = true
}

function editAssignment(item: any) {
  editingId.value = item.id
  formData.value = { ...item, dueDate: dayjs(item.dueDate) }
  showCreateModal.value = true
}

function saveAssignment() {
  if (!formData.value.title || !formData.value.course) {
    return
  }
  
  if (editingId.value) {
    const index = allAssignments.value.findIndex(a => a.id === editingId.value)
    if (index !== -1) {
      allAssignments.value[index] = {
        ...allAssignments.value[index],
        ...formData.value,
        dueDate: formData.value.dueDate?.toDate()
      }
    }
  } else {
    allAssignments.value.push({
      id: `a-${Date.now()}`,
      ...formData.value,
      dueDate: formData.value.dueDate?.toDate(),
      graded: formData.value.status === 'graded'
    })
  }
  
  resetForm()
  showCreateModal.value = false
  saveToStorage()
}

function deleteAssignment(id: string) {
  allAssignments.value = allAssignments.value.filter(a => a.id !== id)
  saveToStorage()
}

function resetForm() {
  formData.value = {
    title: '',
    course: '',
    description: '',
    dueDate: null,
    status: 'assigned',
    grade: undefined,
    moduleId: ''
  }
  editingId.value = null
}

function saveToStorage() {
  if (typeof window !== 'undefined') {
    localStorage.setItem('assignments', JSON.stringify(allAssignments.value))
  }
}

function loadFromStorage() {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('assignments')
    if (saved) {
      allAssignments.value = JSON.parse(saved)
    }
  }
}

onMounted(() => {
  loading.value = true
  loadFromStorage()
  
  // Mock data fallback
  if (allAssignments.value.length === 0) {
    allAssignments.value = [
      { 
        id: 'u1', 
        title: 'Essay draft', 
        course: 'Intro to Writing', 
        status: 'due', 
        moduleId: 'm1',
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        description: 'Write a 2000-word essay on your chosen topic'
      },
      { 
        id: 'u2', 
        title: 'Lab 2 - Arrays', 
        course: 'JS Essentials', 
        status: 'due', 
        moduleId: 'm2',
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        description: 'Complete array manipulation exercises'
      },
      { 
        id: 'u3', 
        title: 'Midterm Project', 
        course: 'Web Design', 
        status: 'assigned', 
        moduleId: 'm3',
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        description: 'Build a responsive portfolio website'
      },
      { 
        id: 'g1', 
        title: 'Quiz 1', 
        course: 'Python for Data', 
        status: 'graded', 
        moduleId: 'm4',
        dueDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        graded: true,
        grade: 92,
        gradedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        description: 'Python basics quiz'
      },
      { 
        id: 'g2', 
        title: 'Project 1', 
        course: 'React Fundamentals', 
        status: 'graded', 
        moduleId: 'm5',
        dueDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        graded: true,
        grade: 88,
        gradedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        description: 'Build a todo app in React'
      }
    ]
    saveToStorage()
  }
  
  setTimeout(() => { loading.value = false }, 300)
})
</script>

<style scoped>
.assignments-wrap {
  min-height: 100vh;
  background: var(--ant-color-bg-layout);
}

.page-header {
  background: var(--ant-color-bg-container);
  margin: 8px 8px 0;
  border-radius: 12px;
}

.p-4 {
  padding: 16px;
}

.card-section {
  height: 100%;
}

.assignment-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 0;
  gap: 12px;
}

.assignment-meta {
  flex: 1;
}

.assignment-title {
  font-weight: 600;
  color: var(--ant-color-text);
}

.assignment-course {
  color: var(--ant-color-text-secondary);
  font-size: 12px;
  margin-top: 2px;
}

.assignment-actions {
  display: flex;
  align-items: center;
}

.mt-4 {
  margin-top: 16px;
}

.mb-4 {
  margin-bottom: 16px;
}

.mb-2 {
  margin-bottom: 8px;
}

.space-y-4 > * + * {
  margin-top: 16px;
}

.text-gray-400 {
  color: var(--ant-color-text-tertiary);
}

.is-dark {
  color-scheme: dark;
}
</style>
