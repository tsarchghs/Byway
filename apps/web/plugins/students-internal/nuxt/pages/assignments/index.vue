<template>
  <a-config-provider :theme="{ algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm }">
    <a-layout :class="['student-assignments-wrap', isDark ? 'is-dark' : '']" data-test-id="assignments-wrap">
      
      <!-- HEADER -->
      <a-page-header
        class="page-header"
        title="Assignments"
        sub-title="Your coursework & deadlines"
        data-test-id="assignments-header"
      >
        <template #extra>
          <a-space wrap>
            <a-tooltip title="Toggle dark mode">
              <a-button @click="isDark = !isDark" data-test-id="toggle-dark">
                <BulbOutlined />
              </a-button>
            </a-tooltip>
          </a-space>
        </template>
      </a-page-header>

      <div class="p-4">

        <!-- BREADCRUMB -->
        <a-breadcrumb class="mb-3">
          <a-breadcrumb-item to="/students">Students</a-breadcrumb-item>
          <a-breadcrumb-item>Assignments</a-breadcrumb-item>
        </a-breadcrumb>

        <!-- DASHBOARD -->
        <a-row :gutter="[12, 12]" class="mb-3">
          <a-col :xs="12" :md="6">
            <a-card size="small" :bordered="false">
              <a-statistic title="Total" :value="all.length" />
            </a-card>
          </a-col>

          <a-col :xs="12" :md="6">
            <a-card size="small" :bordered="false">
              <a-statistic title="Due Soon" :value="dueSoonCount" :value-style="{ color: '#faad14' }" />
            </a-card>
          </a-col>

          <a-col :xs="12" :md="6">
            <a-card size="small" :bordered="false">
              <a-statistic title="Graded" :value="gradedCount" :value-style="{ color: '#52c41a' }" />
            </a-card>
          </a-col>

          <a-col :xs="12" :md="6">
            <a-card size="small" :bordered="false">
              <a-statistic title="Completion Rate" :value="`${completionRate}%`" />
            </a-card>
          </a-col>
        </a-row>

        <!-- FILTER BAR -->
        <a-card :bordered="false" class="mb-4">
          <a-space wrap>
            <a-input-search
              v-model:value="search"
              style="width: 240px"
              placeholder="Search assignments"
              data-test-id="search"
            />
            <a-select v-model:value="statusFilter" placeholder="Status" style="width: 160px">
              <a-select-option value="">All</a-select-option>
              <a-select-option value="assigned">Assigned</a-select-option>
              <a-select-option value="due">Due</a-select-option>
              <a-select-option value="graded">Graded</a-select-option>
            </a-select>

            <a-select v-model:value="sortBy" style="width: 160px">
              <a-select-option value="dueDate">Due Date</a-select-option>
              <a-select-option value="course">Course</a-select-option>
              <a-select-option value="status">Status</a-select-option>
            </a-select>
          </a-space>
        </a-card>

        <!-- UPCOMING + GRADED PREVIEWS -->
        <a-row :gutter="[12,12]">
          <a-col :xs="24" :md="12">
            <a-card title="📅 Upcoming" :bordered="false">
              <a-skeleton v-if="loading" active />
              <a-empty v-else-if="upcoming.length === 0" description="No upcoming assignments" />
              <a-list v-else :data-source="upcoming" :render-item="renderUpcoming" />
            </a-card>
          </a-col>

          <a-col :xs="24" :md="12">
            <a-card title="✅ Graded" :bordered="false">
              <a-skeleton v-if="loading" active />
              <a-empty v-else-if="graded.length === 0" description="Nothing graded yet" />
              <a-list v-else :data-source="graded" :render-item="renderGraded" />
            </a-card>
          </a-col>
        </a-row>

        <!-- TABLE -->
        <a-card title="📊 All Assignments" :bordered="false" class="mt-4">
          <a-table
            :columns="columns"
            :data-source="filtered"
            :loading="loading"
            :scroll="{ x: 600 }"
            row-key="id"
            data-test-id="assignments-table"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'status'">
                <a-tag :color="statusColor(record.status)">
                  {{ record.status }}
                </a-tag>
              </template>

              <template v-else-if="column.key === 'due'">
                {{ format(record.dueDate) }}
              </template>

              <template v-else-if="column.key === 'grade'">
                <span v-if="record.grade !== undefined">{{ record.grade }}%</span>
                <span v-else class="muted">—</span>
              </template>

              <template v-else-if="column.key === 'actions'">
                <a-button type="link" @click="openDetail(record)">Open</a-button>
              </template>
            </template>
          </a-table>
        </a-card>

        <!-- DETAIL MODAL -->
        <a-modal v-model:open="detailOpen" width="600" :footer="null" title="Assignment">
          <div v-if="current">
            <a-descriptions :column="1" bordered size="small">
              <a-descriptions-item label="Title">{{ current.title }}</a-descriptions-item>
              <a-descriptions-item label="Course">{{ current.course }}</a-descriptions-item>
              <a-descriptions-item label="Status">
                <a-tag :color="statusColor(current.status)">
                  {{ current.status }}
                </a-tag>
              </a-descriptions-item>
              <a-descriptions-item label="Due">{{ format(current.dueDate) }}</a-descriptions-item>
              <a-descriptions-item v-if="current.grade !== undefined" label="Grade">
                <a-progress :percent="current.grade" />
              </a-descriptions-item>
              <a-descriptions-item label="Description">
                {{ current.description || '—' }}
              </a-descriptions-item>
            </a-descriptions>

            <a-button
              type="primary"
              block
              class="mt-3"
              @click="$router.push(`/modules/${current.moduleId}/view`)"
            >
              Open Lesson
            </a-button>
          </div>
        </a-modal>
      </div>

    </a-layout>
  </a-config-provider>
</template>

<script setup lang="ts">
import { ref, computed, h, onMounted, resolveComponent } from 'vue'
import { theme } from 'ant-design-vue'
import dayjs from 'dayjs/esm/index.js'
import { BulbOutlined } from '@ant-design/icons-vue'
import { definePageMeta } from '#imports'
definePageMeta({ layout: 'student', title: 'Assignments' })

/* UI state */
const isDark = ref(false)
const loading = ref(true)
const detailOpen = ref(false)
const current = ref<any>(null)

/* Filters */
const search = ref('')
const statusFilter = ref('')
const sortBy = ref('dueDate')

/* Data */
const all = ref<any[]>([])

/* Columns */
const columns = [
  { title: 'Title', key: 'title', dataIndex: 'title' },
  { title: 'Course', key: 'course', dataIndex: 'course' },
  { title: 'Status', key: 'status' },
  { title: 'Due', key: 'due' },
  { title: 'Grade', key: 'grade' },
  { title: 'Actions', key: 'actions', fixed: 'right' }
]

/* Derived */
const filtered = computed(() => {
  let list = all.value

  if (search.value) {
    const q = search.value.toLowerCase()
    list = list.filter(a => a.title.toLowerCase().includes(q) || a.course.toLowerCase().includes(q))
  }

  if (statusFilter.value) list = list.filter(a => a.status === statusFilter.value)

  if (sortBy.value === 'dueDate') list.sort((a, b) => +new Date(a.dueDate) - +new Date(b.dueDate))
  if (sortBy.value === 'course') list.sort((a, b) => a.course.localeCompare(b.course))
  if (sortBy.value === 'status') list.sort((a, b) => a.status.localeCompare(b.status))

  return list
})

const upcoming = computed(() => filtered.value.filter(a => a.status === 'assigned' || a.status === 'due'))
const graded = computed(() => filtered.value.filter(a => a.status === 'graded'))

/* Dashboard stats */
const dueSoonCount = computed(() => upcoming.value.length)
const gradedCount = computed(() => graded.value.length)
const completionRate = computed(() =>
  all.value.length ? Math.round((gradedCount.value / all.value.length) * 100) : 0
)

/* Helpers */
const statusColor = (s: string) =>
  ({ assigned: 'blue', due: 'gold', graded: 'green' }[s] || 'default')

const format = (d: any) => dayjs(d).format('MMM DD, YYYY')

const openDetail = (a: any) => {
  current.value = a
  detailOpen.value = true
}

function renderUpcoming(item: any) {
  return h('a-list-item', {}, [
    h('div', { class: 'assign-preview' }, [
      h('div', [h('b', item.title), h('div', { class: 'muted' }, item.course)]),
      h(resolveComponent('a-tag'), { color: statusColor(item.status) }, { default: () => item.status })
    ])
  ])
}

function renderGraded(item: any) {
  return h('a-list-item', {}, [
    h('div', { class: 'assign-preview' }, [
      h('div', [h('b', item.title), h('div', { class: 'muted' }, item.course)]),
      h(resolveComponent('a-tag'), { color: 'green' }, { default: () => `${item.grade}%` })
    ])
  ])
}

/* LocalStorage */
function load() {
  const saved = typeof window !== 'undefined' && localStorage.getItem('student-assignments')
  if (saved) all.value = JSON.parse(saved)
}

function save() {
  if (typeof window !== 'undefined') {
    localStorage.setItem('student-assignments', JSON.stringify(all.value))
  }
}

/* Mock fallback */
onMounted(() => {
  load()

  if (all.value.length === 0) {
    all.value = [
      {
        id: 'a1',
        title: 'Essay Draft',
        course: 'Writing 101',
        status: 'due',
        dueDate: new Date(Date.now() + 86400000),
        description: 'Write an essay about your topic.',
        moduleId: 'm1'
      },
      {
        id: 'a2',
        title: 'JS Lab 2',
        course: 'JavaScript Essentials',
        status: 'assigned',
        dueDate: new Date(Date.now() + 3 * 86400000),
        description: 'Complete array exercises.',
        moduleId: 'm2'
      },
      {
        id: 'g1',
        title: 'Quiz 1',
        course: 'Python Basics',
        status: 'graded',
        dueDate: new Date(Date.now() - 5 * 86400000),
        grade: 88,
        graded: true,
        description: 'Python quiz',
        moduleId: 'm3'
      }
    ]
    save()
  }

  setTimeout(() => (loading.value = false), 300)
})
</script>

<style scoped>
.student-assignments-wrap {
  min-height: 100vh;
  background: var(--ant-color-bg-layout);
}

.page-header {
  background: var(--ant-color-bg-container);
  margin: 8px;
  padding: 12px;
  border-radius: 12px;
}

.p-4 {
  padding: 16px;
}

.assign-preview {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 0;
}

.muted {
  color: var(--ant-color-text-secondary);
  font-size: 12px;
}

.mb-3 {
  margin-bottom: 16px;
}

.mt-3 {
  margin-top: 16px;
}

.is-dark {
  color-scheme: dark;
}
</style>
