<template>
  <a-config-provider :theme="{ token: { colorPrimary: isDark ? '#1890ff' : '#1890ff' } }">
    <a-layout class="min-h-screen">
      <!-- Header -->
      <a-layout-header class="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10 flex items-center justify-between px-6">
        <div class="flex items-center gap-4">
          <a-button type="text" @click="$router.push('/classrooms')">
            <template #icon><ArrowLeftOutlined /></template>
            Back
          </a-button>
          <div>
            <h1 class="text-xl font-bold">{{ classroom?.name }}</h1>
            <p class="text-sm text-slate-500">{{ classroom?.instructor }}</p>
          </div>
        </div>
        <a-space>
          <a-button type="text" @click="isDark = !isDark">
            <template #icon><BgColorsOutlined /></template>
          </a-button>
          <a-popover>
            <template #content>
              <a-space direction="vertical" class="w-full">
                <div>
                  <label class="text-sm font-medium">Student ID</label>
                  <a-input v-model:value="studentId" placeholder="Enter your student ID" />
                </div>
                <a-button type="primary" block @click="refresh">Load My Data</a-button>
              </a-space>
            </template>
            <a-button>{{ studentId ? `📚 ${studentId}` : 'Settings' }}</a-button>
          </a-popover>
        </a-space>
      </a-layout-header>

      <a-layout-content class="p-6">
        <!-- Statistics Cards -->
        <a-row :gutter="16" class="mb-6">
          <a-col :xs="24" :sm="12" :lg="6">
            <a-statistic title="Total Assignments" :value="rows.length" />
          </a-col>
          <a-col :xs="24" :sm="12" :lg="6">
            <a-statistic title="Submissions" :value="mySubs.length" />
          </a-col>
          <a-col :xs="24" :sm="12" :lg="6">
            <a-statistic title="Graded" :value="gradedCount" />
          </a-col>
          <a-col :xs="24" :sm="12" :lg="6">
            <a-statistic title="Average Grade" :value="avgGrade" suffix="%" />
          </a-col>
        </a-row>

        <!-- Status Alert -->
        <div v-if="statusMessage" class="mb-6">
          <a-alert :message="statusMessage" :type="statusType" closable @close="statusMessage = ''" />
        </div>

        <!-- Assignments Section -->
        <a-card title="📋 My Assignments" class="mb-6" :bordered="false">
          <template #extra>
            <a-space>
              <a-input-search v-model:value="searchText" placeholder="Search assignments..." style="width: 200px" />
              <a-select v-model:value="filterStatus" style="width: 150px" placeholder="Filter by status">
                <a-select-option value="">All Statuses</a-select-option>
                <a-select-option value="open">Open</a-select-option>
                <a-select-option value="late">Late Window</a-select-option>
                <a-select-option value="closed">Closed</a-select-option>
              </a-select>
            </a-space>
          </template>

          <a-empty v-if="!filteredAssignments.length" description="No assignments found" />

          <a-list v-else :data-source="filteredAssignments" class="space-y-3">
            <template #renderItem="{ item }">
              <a-list-item :key="item.id">
                <a-card class="w-full" :bordered="false" :body-style="{ padding: '16px' }">
                  <div class="flex items-start justify-between gap-4">
                    <div class="flex-1">
                      <div class="flex items-center gap-3 mb-2">
                        <h3 class="text-lg font-semibold">{{ item.title }}</h3>
                        <a-tag :color="getStatusColor(item)">{{ getStatusLabel(item) }}</a-tag>
                        <a-tag v-if="getSubmissionForAssignment(item.id)" color="green">Submitted</a-tag>
                      </div>
                      <p class="text-slate-600 dark:text-slate-400 mb-3">{{ item.description }}</p>
                      <a-space direction="horizontal" class="text-sm">
                        <span>📅 Due: {{ formatDate(item.dueDate) }}</span>
                        <a-divider type="vertical" />
                        <span>🔄 Attempts: {{ attemptsLeft(item) }} left</span>
                        <a-divider type="vertical" />
                        <span v-if="getSubmissionForAssignment(item.id)?.grade" class="font-semibold">
                          ⭐ Grade: {{ getSubmissionForAssignment(item.id).grade }}%
                        </span>
                      </a-space>
                    </div>
                    <div class="flex flex-col gap-2">
                      <a-button type="primary" @click="openSubmitModal(item)" v-if="!isAssignmentClosed(item)">
                        Submit
                      </a-button>
                      <a-button v-if="getSubmissionForAssignment(item.id)" @click="openDetailsDrawer(item)">
                        View Details
                      </a-button>
                    </div>
                  </div>
                </a-card>
              </a-list-item>
            </template>
          </a-list>
        </a-card>

        <!-- My Submissions Section -->
        <a-card title="📤 My Submissions" :bordered="false">
          <a-empty v-if="!mySubs.length" description="No submissions yet" />

          <a-table v-else :data-source="mySubs" :columns="submissionColumns" row-key="id" :pagination="{ pageSize: 10 }">
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'status'">
                <a-tag :color="record.grade ? 'green' : 'blue'">
                  {{ record.grade ? 'Graded' : 'Pending' }}
                </a-tag>
              </template>
              <template v-else-if="column.key === 'actions'">
                <a-space>
                  <a-button type="link" size="small" @click="openDetailsDrawer(record)">View</a-button>
                  <a-popconfirm title="Delete this submission?" @confirm="deleteSubmission(record.id)">
                    <a-button type="link" size="small" danger>Delete</a-button>
                  </a-popconfirm>
                </a-space>
              </template>
            </template>
          </a-table>
        </a-card>
      </a-layout-content>
    </a-layout>

    <!-- Submit Modal -->
    <a-modal v-model:open="submitModalOpen" title="Submit Assignment" @ok="submitAssignment">
      <a-form layout="vertical">
        <a-form-item label="Assignment" class="mb-4">
          <a-input :value="selectedAssignment?.title" disabled />
        </a-form-item>
        <a-form-item label="File URL" required class="mb-0">
          <a-input v-model:value="fileUrl" placeholder="Enter file URL or link to your submission" />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- Details Drawer -->
    <a-drawer v-model:open="detailsDrawerOpen" title="Submission Details" width="480">
      <a-descriptions v-if="selectedSubmission" :column="1" bordered>
        <a-descriptions-item label="Assignment">
          {{ rows.find(r => r.id === selectedSubmission.assignmentId)?.title }}
        </a-descriptions-item>
        <a-descriptions-item label="Submitted">
          {{ formatDate(selectedSubmission.submittedAt) }}
        </a-descriptions-item>
        <a-descriptions-item label="File">
          <a-button type="link" :href="selectedSubmission.fileUrl" target="_blank">
            Open File
          </a-button>
        </a-descriptions-item>
        <a-descriptions-item label="Status">
          <a-tag :color="selectedSubmission.grade ? 'green' : 'blue'">
            {{ selectedSubmission.grade ? 'Graded' : 'Pending' }}
          </a-tag>
        </a-descriptions-item>
        <a-descriptions-item v-if="selectedSubmission.grade" label="Grade">
          <span class="text-lg font-bold">{{ selectedSubmission.grade }}%</span>
        </a-descriptions-item>
        <a-descriptions-item v-if="selectedSubmission.feedback" label="Feedback">
          <p class="text-slate-600">{{ selectedSubmission.feedback }}</p>
        </a-descriptions-item>
      </a-descriptions>
    </a-drawer>
  </a-config-provider>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import dayjs from 'dayjs'
import { ArrowLeftOutlined, BgColorsOutlined } from '@ant-design/icons-vue'
import { useRuntimeConfig } from '#app'
import { $fetch } from 'ohmyfetch'

const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()
const baseUrl = config.public?.apiBase || 'http://localhost:4000'

// State
const isDark = ref(false)
const classroomId = computed(() => String(route.params.id))
const studentId = ref('')
const rows = ref<any[]>([])
const mySubs = ref<any[]>([])
const searchText = ref('')
const filterStatus = ref('')
const classroom = ref<any>(null)
const statusMessage = ref('')
const statusType = ref<'success' | 'error' | 'info'>('info')

// Modal state
const submitModalOpen = ref(false)
const detailsDrawerOpen = ref(false)
const selectedAssignment = ref<any>(null)
const selectedSubmission = ref<any>(null)
const fileUrl = ref('')

// Computed properties
const filteredAssignments = computed(() => {
  return rows.value.filter(a => {
    const matchesSearch = !searchText.value || 
      a.title.toLowerCase().includes(searchText.value.toLowerCase()) ||
      a.description.toLowerCase().includes(searchText.value.toLowerCase())
    
    const matchesStatus = !filterStatus.value || getStatusValue(a) === filterStatus.value
    return matchesSearch && matchesStatus
  })
})

const gradedCount = computed(() => mySubs.value.filter(s => s.grade !== null).length)

const avgGrade = computed(() => {
  const graded = mySubs.value.filter(s => s.grade !== null)
  if (graded.length === 0) return 0
  const total = graded.reduce((sum, s) => sum + (s.grade || 0), 0)
  return Math.round(total / graded.length)
})

// Columns
const submissionColumns = [
  { title: 'Assignment', dataIndex: 'assignmentId', key: 'assignmentId', render: (text: string) => {
    return rows.value.find(r => r.id === text)?.title || text
  }},
  { title: 'Submitted', dataIndex: 'submittedAt', key: 'submittedAt', render: (date: string) => formatDate(date) },
  { title: 'Status', key: 'status' },
  { title: 'Grade', dataIndex: 'grade', key: 'grade', render: (grade: number) => grade ? `${grade}%` : '-' },
  { title: 'Actions', key: 'actions' },
]

// Helper functions
function formatDate(date: string | Date) {
  return dayjs(date).format('MMM DD, YYYY HH:mm')
}

function getStatusLabel(a: any) {
  const now = dayjs()
  const due = a.dueDate ? dayjs(a.dueDate) : null
  const accept = a.acceptUntil ? dayjs(a.acceptUntil) : due
  
  if (accept && now.isAfter(accept)) return 'Closed'
  if (due && now.isAfter(due)) return 'Late Window'
  return 'Open'
}

function getStatusValue(a: any) {
  const label = getStatusLabel(a)
  return label.toLowerCase().replace(' window', '')
}

function getStatusColor(a: any) {
  const label = getStatusLabel(a)
  if (label === 'Closed') return 'red'
  if (label === 'Late Window') return 'orange'
  return 'green'
}

function isAssignmentClosed(a: any) {
  const now = dayjs()
  const accept = a.acceptUntil ? dayjs(a.acceptUntil) : (a.dueDate ? dayjs(a.dueDate) : null)
  return accept && now.isAfter(accept)
}

function attemptsLeft(a: any) {
  const maxA = Number(a.maxAttempts ?? 1)
  const used = mySubs.value.filter((s: any) => s.assignmentId === a.id).length
  return Math.max(0, maxA - used)
}

function getSubmissionForAssignment(assignmentId: string) {
  return mySubs.value.find(s => s.assignmentId === assignmentId)
}

// API calls
async function loadAssignments() {
  try {
    const q = 'query($classroomId:String!){ assignmentsByClassroom(classroomId:$classroomId){ id title description dueDate acceptUntil maxAttempts } }'
    const r = await $fetch(`${baseUrl}/api/teach-internal/graphql`, { 
      method: 'POST', 
      body: { query: q, variables: { classroomId: classroomId.value }}
    }) as any
    rows.value = r.data?.assignmentsByClassroom ?? []
  } catch (err) {
    statusMessage.value = 'Failed to load assignments'
    statusType.value = 'error'
  }
}

async function loadMySubs() {
  if (!studentId.value) {
    mySubs.value = []
    return
  }
  try {
    const q = 'query($studentId:String!){ mySubmissions(studentId:$studentId){ id assignmentId fileUrl grade feedback submittedAt } }'
    const r = await $fetch(`${baseUrl}/api/teach-internal/graphql`, { 
      method: 'POST', 
      body: { query: q, variables: { studentId: studentId.value }}
    }) as any
    mySubs.value = r.data?.mySubmissions ?? []
    statusMessage.value = 'Data loaded successfully'
    statusType.value = 'success'
  } catch (err) {
    statusMessage.value = 'Failed to load submissions'
    statusType.value = 'error'
  }
}

async function submitAssignment() {
  if (!selectedAssignment.value || !studentId.value || !fileUrl.value) {
    statusMessage.value = 'Please fill in all fields'
    statusType.value = 'error'
    return
  }
  
  try {
    const q = 'mutation($assignmentId:String!,$studentId:String!,$fileUrl:String){ createSubmission(assignmentId:$assignmentId,studentId:$studentId,fileUrl:$fileUrl){ id } }'
    await $fetch(`${baseUrl}/api/teach-internal/graphql`, { 
      method: 'POST', 
      body: { 
        query: q, 
        variables: { 
          assignmentId: selectedAssignment.value.id, 
          studentId: studentId.value, 
          fileUrl: fileUrl.value
        }
      }
    })
    fileUrl.value = ''
    submitModalOpen.value = false
    await loadMySubs()
    statusMessage.value = 'Submission successful!'
    statusType.value = 'success'
  } catch (err) {
    statusMessage.value = 'Failed to submit assignment'
    statusType.value = 'error'
  }
}

async function deleteSubmission(id: string) {
  try {
    // Implement delete mutation if available
    mySubs.value = mySubs.value.filter(s => s.id !== id)
    statusMessage.value = 'Submission deleted'
    statusType.value = 'success'
  } catch (err) {
    statusMessage.value = 'Failed to delete submission'
    statusType.value = 'error'
  }
}

async function refresh() {
  await Promise.all([loadAssignments(), loadMySubs()])
}

function openSubmitModal(assignment: any) {
  selectedAssignment.value = assignment
  fileUrl.value = ''
  submitModalOpen.value = true
}

function openDetailsDrawer(item: any) {
  if (item.assignmentId) {
    selectedSubmission.value = item
  } else {
    selectedSubmission.value = getSubmissionForAssignment(item.id)
  }
  detailsDrawerOpen.value = true
}

// Hooks must be called at the top level
onMounted(() => {
  if (studentId.value) {
    refresh()
  }
})
watch(studentId, (newVal) => {
  if (newVal) {
    refresh()
  } else {
    mySubs.value = []
  }
})
watch(isDark, (val) => {
  if (val) document.documentElement.classList.add('dark')
  else document.documentElement.classList.remove('dark')
})

// definePageMeta({ layout: 'student' })
</script>
