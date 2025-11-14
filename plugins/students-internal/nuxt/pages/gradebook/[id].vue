<template>
  <a-config-provider>
    <a-layout class="gradebook-root" :class="isDark ? 'is-dark' : ''">

      <!-- GLOBAL BANNERS -->
      <div class="global-banners px-4 pt-3">
        <a-alert
          v-if="!isOnline"
          type="warning"
          banner
          show-icon
          message="You're offline. Mock/local mode active."
          class="mb-2"
        />
        <a-alert
          v-if="usingMocks"
          type="info"
          banner
          show-icon
          :message="`Mock data active${mockReason ? ` · ${mockReason}` : ''}`"
        />
      </div>

      <!-- PAGE HEADER -->
      <a-page-header
        class="page-header shadow-sm px-6 py-4 bg-white"
        title="My Gradebook"
        sub-title="Grades · Analytics · Feedback"
      >
        <template #tags>
          <a-space>
            <a-tag color="blue">Student</a-tag>
            <a-tag color="gold">Performance</a-tag>
            <a-badge :status="isOnline ? 'processing' : 'default'" :text="isOnline ? 'Online' : 'Offline'" />
            <a-badge
              :status="usingMocks ? 'warning' : 'success'"
              :text="usingMocks ? 'Mock' : 'Live'"
            />
          </a-space>
        </template>

        <template #extra>
          <a-space>
            <a-tooltip title="Toggle dark mode">
              <a-button shape="circle" @click="toggleDark">
                <BulbOutlined />
              </a-button>
            </a-tooltip>

            <a-button type="primary" @click="openExport = true">
              <CloudSyncOutlined />
              Export
            </a-button>
          </a-space>
        </template>
      </a-page-header>

      <!-- MAIN LAYOUT -->
      <a-layout class="main-layout">

        <!-- LEFT SIDER – COURSES -->
        <a-layout-sider
          width="300"
          collapsible
          v-model:collapsed="leftCollapsed"
          :collapsed-width="64"
          breakpoint="lg"
          class="left-sider border-r"
        >
          <div class="sider-inner p-3">

            <a-input-search
              v-model:value="filter"
              allow-clear
              placeholder="Search courses..."
              class="mb-3"
            />

            <a-card
              v-if="!leftCollapsed"
              size="small"
              :bordered="false"
              title="Filters"
              class="mb-3"
            >
              <a-segmented
                v-model:value="statusFilter"
                :options="[
                  { label: 'All', value: 'all' },
                  { label: 'Graded', value: 'graded' },
                  { label: 'Pending', value: 'pending' },
                  { label: 'Submitted', value: 'submitted' }
                ]"
              />
            </a-card>

            <a-divider />

            <a-list
              size="small"
              :data-source="courses"
              :row-key="c => c.courseId"
              class="course-list"
            >
              <template #renderItem="{ item }">
                <a-list-item
                  class="course-item"
                  :class="currentCourseId === item.courseId ? 'active' : ''"
                  @click="selectCourse(item.courseId)"
                >
                  <a-list-item-meta
                    :title="item.courseName"
                    :description="`${item.gradedCount} graded • avg ${item.avg}%`"
                  />
                </a-list-item>
              </template>
            </a-list>

          </div>
        </a-layout-sider>

        <!-- CENTER CONTENT -->
        <a-layout-content class="center-content px-6 py-6">

          <a-breadcrumb class="mb-4">
            <a-breadcrumb-item>Students</a-breadcrumb-item>
            <a-breadcrumb-item>Gradebook</a-breadcrumb-item>
          </a-breadcrumb>

          <!-- COURSE SUMMARY -->
          <a-card :loading="loading" class="mb-5" bordered>
            <template #title>
              <div class="flex justify-between items-center">
                <span class="font-semibold">{{ currentCourse?.courseName || 'Your Grades' }}</span>
                <a-tag color="blue">{{ grades.length }} records</a-tag>
              </div>
            </template>

            <div class="grid md:grid-cols-3 gap-4">
              <a-card size="small" class="kpi-card">
                <template #title>Average Grade</template>
                <div class="kpi-value text-green-600">
                  {{ metrics.average ?? '—' }}%
                </div>
              </a-card>

              <a-card size="small" class="kpi-card">
                <template #title>Completed</template>
                <div class="kpi-value text-blue-600">
                  {{ metrics.completed }}/{{ metrics.total }}
                </div>
              </a-card>

              <a-card size="small" class="kpi-card">
                <template #title>Pending</template>
                <div class="kpi-value text-orange-500">
                  {{ metrics.pending }}
                </div>
              </a-card>
            </div>
          </a-card>

          <!-- TABS -->
          <a-card>
            <a-tabs v-model:activeKey="tab" animated>

              <!-- GRADES -->
              <a-tab-pane key="grades" tab="Grades">
                <a-alert
                  v-if="grades.length === 0"
                  type="info"
                  message="No grades available."
                  class="mb-4"
                />
                <a-table
                  v-else
                  :columns="gradeColumns"
                  :data-source="grades"
                  row-key="id"
                  bordered
                  :pagination="{ pageSize: 8 }"
                />
              </a-tab-pane>

              <!-- ANALYTICS -->
              <a-tab-pane key="analytics" tab="Analytics">
                <div class="grid md:grid-cols-2 gap-6">

                  <a-card size="small" title="Distribution">
                    <div v-for="(count, label) in gradeDistribution" :key="label" class="py-2">
                      <div class="flex justify-between items-center">
                        <span>{{ label }}</span>
                        <a-progress
                          :percent="(count / grades.length) * 100"
                          :format="() => count"
                        />
                      </div>
                    </div>
                  </a-card>

                  <a-card size="small" title="Performance Trend">
                    <p>Current average: <b>{{ metrics.average }}%</b></p>
                    <p>Last semester: <b>82%</b></p>
                    <a-progress :percent="metrics.average" />
                  </a-card>

                </div>
              </a-tab-pane>

              <!-- FEEDBACK -->
              <a-tab-pane key="feedback" tab="Feedback">
                <a-empty v-if="feedbackList.length === 0" />

                <a-card
                  v-for="f in feedbackList"
                  :key="f.id"
                  class="mb-3"
                >
                  <template #title>
                    <div class="flex justify-between items-center">
                      <span>{{ f.assignmentName }}</span>
                      <a-tag :color="statusColor(f.status)">
                        {{ f.status }}
                      </a-tag>
                    </div>
                  </template>

                  <p><b>Grade:</b> {{ f.grade ?? '—' }}</p>
                  <p><b>Feedback:</b> {{ f.feedback || '—' }}</p>
                  <div class="text-muted text-xs">
                    Updated: {{ format(f.updatedAt) }}
                  </div>
                </a-card>
              </a-tab-pane>

            </a-tabs>
          </a-card>

        </a-layout-content>

        <!-- RIGHT SIDER -->
        <a-layout-sider
          width="340"
          collapsible
          v-model:collapsed="rightCollapsed"
          :collapsed-width="64"
          class="right-sider border-l"
        >
          <div class="right-inner p-3">

            <a-tabs v-model:activeKey="rightTab" size="small">

              <!-- NOTES -->
              <a-tab-pane key="notes" tab="Notes">
                <a-card size="small">
                  <a-form layout="vertical">
                    <a-form-item label="Course notes">
                      <a-textarea
                        v-model:value="notes[currentCourseId].text"
                        :rows="6"
                        @change="persistNotes"
                      />
                    </a-form-item>
                  </a-form>
                </a-card>
              </a-tab-pane>

              <!-- RECENT FEEDBACK FEED -->
              <a-tab-pane key="feed" tab="Recent">
                <a-list :data-source="recentFeed" size="small">
                  <template #renderItem="{ item }">
                    <a-list-item>
                      <a-list-item-meta :title="item.assignment" :description="item.text" />
                    </a-list-item>
                  </template>
                </a-list>
              </a-tab-pane>

              <!-- BOOKMARKS -->
              <a-tab-pane key="bookmarks" tab="Bookmarks">
                <a-empty v-if="!bookmarks.length" />
                <a-list v-else :data-source="bookmarks">
                  <template #renderItem="{ item, index }">
                    <a-list-item :actions="[
                      h('a', { onClick: () => removeBookmark(index) }, 'Remove')
                    ]">
                      <a-list-item-meta :title="item.label" />
                    </a-list-item>
                  </template>
                </a-list>
              </a-tab-pane>

            </a-tabs>

          </div>
        </a-layout-sider>

      </a-layout>

      <!-- EXPORT MODAL -->
      <a-modal
        v-model:open="openExport"
        title="Export Grades"
        :footer="null"
      >
        <p>Download your gradebook as JSON.</p>
        <a-button type="primary" block @click="exportGrades">Download JSON</a-button>
      </a-modal>

    </a-layout>
  </a-config-provider>
</template>

<script setup lang="ts">
definePageMeta({ ssr: false })

/** ---------------------------------------------------------
 * FULL MOCK STUDENT GRADEBOOK — MODULES-STYLE TRI-PANEL
 --------------------------------------------------------- */
import { ref, computed, onMounted, h } from 'vue'
import dayjs from 'dayjs/esm/index.js'
// @ts-ignore
import { BulbOutlined, CloudSyncOutlined } from '@ant-design/icons-vue'
import { ConfigProvider } from 'ant-design-vue'
import { theme } from 'ant-design-vue/es'
theme.defaultAlgorithm
const relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)
/* ----------------------------------------------------------
   GLOBAL UI STATE
---------------------------------------------------------- */
const isDark = ref(false)
const isOnline = ref(true)
const usingMocks = ref(true)
const mockReason = ref("Gradebook prototype")
const filter = ref('')
const statusFilter = ref('all')

/* Panels */
const leftCollapsed = ref(false)
const rightCollapsed = ref(false)
const rightTab = ref('notes')

/* Modal */
const openExport = ref(false)

/* ----------------------------------------------------------
   MOCK DATA
---------------------------------------------------------- */
const mockGrades = ref([
  { id: '1', assignmentId: 'a1', assignmentName: 'Midterm', courseId: 'c1', courseName: 'CS 101', grade: 88, feedback: 'Strong understanding', status: 'graded', updatedAt: new Date() },
  { id: '2', assignmentId: 'a2', assignmentName: 'Project 1', courseId: 'c1', courseName: 'CS 101', grade: 92, feedback: 'Excellent code', status: 'graded', updatedAt: new Date(Date.now()-86400000) },
  { id: '3', assignmentId: 'a3', assignmentName: 'Assignment 3', courseId: 'c1', courseName: 'CS 101', grade: null, feedback: null, status: 'pending', updatedAt: new Date() },
  { id: '4', assignmentId: 'a4', assignmentName: 'Final Project', courseId: 'c2', courseName: 'Math 201', grade: 95, feedback: 'Outstanding', status: 'graded', updatedAt: new Date(Date.now()-200000000) },
])

const tab = ref('grades')
const loading = ref(false)

/* ----------------------------------------------------------
   COURSE BREAKDOWN
---------------------------------------------------------- */
const courses = computed(() => {
  const map: Record<string, any> = {}

  mockGrades.value.forEach(g => {
    if (!map[g.courseId]) {
      map[g.courseId] = {
        courseId: g.courseId,
        courseName: g.courseName,
        grades: []
      }
    }
    map[g.courseId].grades.push(g.grade)
  })

  return Object.values(map).map((c: any) => {
    const graded = c.grades.filter((x: any) => x != null)
    const avg = graded.length ? Math.round(graded.reduce((s: any, x: any) => s+x,0)/graded.length) : 0
    return {
      ...c,
      gradedCount: graded.length,
      totalCount: c.grades.length,
      avg
    }
  })
})

const currentCourseId = ref<string|null>(null)
const currentCourse = computed(() =>
  courses.value.find(c => c.courseId === currentCourseId.value)
)

import { watch } from 'vue'

watch(currentCourseId, (id) => {
  if (!notes.value[id]) {
    notes.value[id] = { text: '' }
  }
})

/* Grades filtered to selected course */
const grades = computed(() => {
  let list = mockGrades.value

  if (currentCourseId.value)
    list = list.filter(g => g.courseId === currentCourseId.value)

  if (filter.value)
    list = list.filter(g => g.assignmentName.toLowerCase().includes(filter.value.toLowerCase()))

  if (statusFilter.value !== 'all')
    list = list.filter(g => g.status === statusFilter.value)

  return list.map(g => ({ ...g, key: g.id }))
})

/* ----------------------------------------------------------
   METRICS
---------------------------------------------------------- */
const metrics = computed(() => {
  const list = grades.value
  if (!list.length) return { average: null, completed: 0, total: 0, pending: 0 }

  const graded = list.filter(x => x.grade != null)
  const avg = graded.length ? Math.round(graded.reduce((s, x) => s + x.grade, 0) / graded.length) : null

  return {
    average: avg,
    completed: graded.length,
    total: list.length,
    pending: list.filter(x => x.status !== 'graded').length
  }
})

/* Distribution chart */
const gradeDistribution = computed(() => {
  const dist: any = { 'A (90+)': 0, 'B (80-89)': 0, 'C (70-79)': 0, 'D (60-69)': 0, 'F (<60)': 0 }

  grades.value.forEach(g => {
    if (g.grade == null) return
    if (g.grade >= 90) dist['A (90+)']++
    else if (g.grade >= 80) dist['B (80-89)']++
    else if (g.grade >= 70) dist['C (70-79)']++
    else if (g.grade >= 60) dist['D (60-69)']++
    else dist['F (<60)']++
  })

  return dist
})

/* ----------------------------------------------------------
   FEEDBACK LIST
---------------------------------------------------------- */
const feedbackList = computed(() =>
  grades.value.filter(g => g.feedback || g.status === 'graded')
)

const recentFeed = computed(() =>
  feedbackList.value.map(f => ({
    assignment: f.assignmentName,
    text: f.feedback || 'Updated',
  }))
)

/* ----------------------------------------------------------
   NOTES (Right Sider)
---------------------------------------------------------- */
const notes = ref<Record<string, any>>({
  c1: { text: '' },
  c2: { text: '' }
})

function persistNotes() {
  localStorage.setItem('gb-notes', JSON.stringify(notes.value))
}

/* ----------------------------------------------------------
   BOOKMARKS (Right Sider)
---------------------------------------------------------- */
const bookmarks = ref<any[]>([])
function removeBookmark(i: number) {
  bookmarks.value.splice(i, 1)
}

/* ----------------------------------------------------------
   HELPERS
---------------------------------------------------------- */
function selectCourse(id: string) {
  currentCourseId.value = id
}

function format(d: any) {
  return dayjs(d).fromNow()
}

function statusColor(s: string) {
  return { graded: 'green', pending: 'orange', submitted: 'blue' }[s] || 'default'
}

function toggleDark() {
  isDark.value = !isDark.value
}

/* ----------------------------------------------------------
   EXPORT
---------------------------------------------------------- */
function exportGrades() {
  const json = JSON.stringify(mockGrades.value, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'gradebook.json'
  a.click()
}

/* ----------------------------------------------------------
   TABLE COLUMNS
---------------------------------------------------------- */
const gradeColumns = [
  { title: 'Assignment', dataIndex: 'assignmentName' },
  { title: 'Course', dataIndex: 'courseName' },
  {
    title: 'Grade',
    dataIndex: 'grade',
    customRender: ({ record }: any) =>
      record.grade == null
        ? h('span', { class: 'text-muted' }, '—')
        : h('b', `${record.grade}%`),
  },
  {
    title: 'Status',
    dataIndex: 'status',
    customRender: ({ record }: any) =>
      h('a-tag', { color: statusColor(record.status) }, record.status),
  }
]
</script>

<style scoped>
.student-wrap { background: var(--bg); }
.sider-inner { padding: 8px; }
.sider-course.active { background: rgba(0,0,0,0.05); border-left: 3px solid #1890ff; }
.text-muted { color: #999; }
</style>
