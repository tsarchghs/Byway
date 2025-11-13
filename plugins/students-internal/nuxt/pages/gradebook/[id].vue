<!-- biome-ignore lint/correctness/useHookAtTopLevel: Vue template false positive -->
<template>
  <a-layout class="p-6">
    
    <a-page-header
      title="My Gradebook"
      sub-title="View your grades and performance analytics"
      @back="goBack"
    >
      <template #extra>
        <a-space>
          <a-button
            :type="isDark ? 'primary' : 'default'"
            @click="toggleDarkMode"
          >
            {{ isDark ? '☀️ Light' : '🌙 Dark' }}
          </a-button>
        </a-space>
      </template>
    </a-page-header>

    <a-breadcrumb class="mb-4">
      <a-breadcrumb-item @click="nav('/dashboard')">Dashboard</a-breadcrumb-item>
      <a-breadcrumb-item>Gradebook</a-breadcrumb-item>
    </a-breadcrumb>

    <!-- Performance Summary -->
    <div class="grid md:grid-cols-4 gap-4 mb-6">
      <a-card size="small">
        <template #title>
          <span class="text-sm">Overall GPA</span>
        </template>
        <div class="text-3xl font-bold text-blue-600">{{ metrics.gpa ?? '—' }}</div>
      </a-card>

      <a-card size="small">
        <template #title>
          <span class="text-sm">Average Grade</span>
        </template>
        <div class="text-3xl font-bold text-green-600">{{ metrics.average ?? '—' }}%</div>
      </a-card>

      <a-card size="small">
        <template #title>
          <span class="text-sm">Submitted</span>
        </template>
        <div class="text-3xl font-bold text-purple-600">{{ metrics.submitted }}/{{ metrics.total }}</div>
      </a-card>

      <a-card size="small">
        <template #title>
          <span class="text-sm">Pending Grades</span>
        </template>
        <div class="text-3xl font-bold text-orange-600">{{ metrics.pending }}</div>
      </a-card>
    </div>

    <!-- Main Content Tabs -->
    <a-card>
      <a-tabs v-model:activeKey="activeTab">
        <!-- Grades Tab -->
        <a-tab-pane key="grades" tab="My Grades">
          <a-alert
            v-show="grades.length === 0"
            type="info"
            message="No grades available yet"
            class="mb-4"
          />
          
          <a-table
            v-show="grades.length > 0"
            :data-source="grades"
            :columns="gradeColumns"
            row-key="id"
            :loading="loadingGrades"
            :pagination="{ pageSize: 10 }"
            class="mb-4"
          />
        </a-tab-pane>

        <!-- Analytics Tab -->
        <a-tab-pane key="analytics" tab="Performance Analytics">
          <div class="grid md:grid-cols-2 gap-6">
            <!-- Grade Distribution -->
            <div>
              <h3 class="text-lg font-semibold mb-4">Grade Distribution</h3>
              <a-card :bordered="false">
                <div class="space-y-3">
                  <div v-for="(count, grade) in gradeDistribution" :key="grade" class="flex items-center justify-between">
                    <span class="text-sm font-medium">{{ grade }}</span>
                    <a-progress
                      :percent="(count / metrics.total) * 100"
                      :format="() => count"
                      :stroke-color="getGradeColor(grade)"
                      class="flex-1 mx-2"
                    />
                  </div>
                </div>
              </a-card>
            </div>

            <!-- Performance Trend -->
            <div>
              <h3 class="text-lg font-semibold mb-4">Performance Trend</h3>
              <a-card :bordered="false">
                <div class="space-y-2">
                  <div class="flex justify-between items-center">
                    <span class="text-sm">This Semester</span>
                    <span class="font-bold">{{ metrics.semesterAverage }}%</span>
                  </div>
                  <a-progress :percent="metrics.semesterAverage" />
                  
                  <div class="flex justify-between items-center mt-4">
                    <span class="text-sm">Last Semester</span>
                    <span class="font-bold">{{ metrics.lastSemesterAverage }}%</span>
                  </div>
                  <a-progress :percent="metrics.lastSemesterAverage" />
                  
                  <div class="mt-4 p-2 bg-blue-50 dark:bg-blue-900 rounded">
                    <p class="text-sm">
                      <strong>Improvement:</strong>
                      <span :class="(metrics.semesterAverage - metrics.lastSemesterAverage) >= 0 ? 'text-green-600' : 'text-red-600'">
                        {{ Math.abs(metrics.semesterAverage - metrics.lastSemesterAverage).toFixed(1) }}%
                      </span>
                    </p>
                  </div>
                </div>
              </a-card>
            </div>
          </div>

          <!-- Course Breakdown -->
          <div class="mt-6">
            <h3 class="text-lg font-semibold mb-4">Grade by Course</h3>
            <a-table
              :data-source="courseBreakdown"
              :columns="courseColumns"
              row-key="id"
              :pagination="false"
            />
          </div>
        </a-tab-pane>

        <!-- Feedback Tab -->
        <a-tab-pane key="feedback" tab="Instructor Feedback">
          <a-empty v-if="feedbackList.length === 0" description="No feedback yet" />
          
          <div v-else class="space-y-4">
            <a-card v-for="item in feedbackList" :key="item.id" class="mb-3">
              <template #title>
                <div class="flex justify-between items-center">
                  <span>{{ item.assignmentName }}</span>
                  <a-tag :color="getStatusColor(item.status)">{{ item.status }}</a-tag>
                </div>
              </template>
              
              <div class="space-y-2">
                <div class="flex justify-between">
                  <span class="text-sm">Grade:</span>
                  <span class="font-semibold">{{ item.grade }}/100</span>
                </div>
                <div class="text-sm">
                  <strong>Feedback:</strong>
                  <p class="mt-1 text-gray-600 dark:text-gray-300">{{ item.feedback || 'No feedback provided yet' }}</p>
                </div>
                <div class="text-xs text-gray-500">
                  Updated: {{ formatDate(item.updatedAt) }}
                </div>
              </div>
            </a-card>
          </div>
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </a-layout>
</template>
<script setup lang="ts">
/**
 * 100% MOCKED SCRIPT
 * Completely replaces backend data & queries.
 * Ideal for UI/UX prototyping in Byway Student Dashboard.
 */

import { computed, ref, h, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

/* -----------------------------------------------------
   🌓 Dark Mode (Mock)
----------------------------------------------------- */
const isDark = ref(false)
onMounted(() => {
  const saved = localStorage.getItem('darkMode') === 'true'
  isDark.value = saved
  document.documentElement.classList.toggle('dark', saved)
})

function toggleDarkMode() {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
  localStorage.setItem('darkMode', isDark.value ? 'true' : 'false')
}

/* -----------------------------------------------------
   👤 User (Mock)
----------------------------------------------------- */
const currentUser = computed(() => ({
  id: 'mock-user-1',
  email: 'student@example.com',
  displayName: 'Mock Student',
}))

/* -----------------------------------------------------
   📝 Grades (Mock)
----------------------------------------------------- */
const mockGrades = ref([
  { id: '1', assignmentId: 'a1', assignmentName: 'Midterm Exam', courseId: 'c1', courseName: 'CS 101', grade: 87, feedback: 'Good work!', status: 'graded', updatedAt: new Date() },
  { id: '2', assignmentId: 'a2', assignmentName: 'Project 1', courseId: 'c1', courseName: 'CS 101', grade: 92, feedback: 'Excellent implementation', status: 'graded', updatedAt: new Date(Date.now() - 86400000) },
  { id: '3', assignmentId: 'a3', assignmentName: 'Assignment 3', courseId: 'c1', courseName: 'CS 101', grade: null, feedback: null, status: 'pending', updatedAt: new Date(Date.now() - 172800000) },
  { id: '4', assignmentId: 'a4', assignmentName: 'Final Project', courseId: 'c2', courseName: 'MATH 201', grade: 95, feedback: 'Outstanding!', status: 'graded', updatedAt: new Date(Date.now() - 259200000) },
  { id: '5', assignmentId: 'a5', assignmentName: 'Quiz 2', courseId: 'c2', courseName: 'MATH 201', grade: 88, feedback: 'Good effort', status: 'graded', updatedAt: new Date(Date.now() - 345600000) },
  { id: '6', assignmentId: 'a6', assignmentName: 'Lab Report', courseId: 'c3', courseName: 'PHYS 150', grade: null, feedback: null, status: 'submitted', updatedAt: new Date(Date.now() - 432000000) },
])

const grades = computed(() =>
  mockGrades.value.map(g => ({ ...g, key: g.id }))
)

/* -----------------------------------------------------
   📊 Table Columns (Mock)
----------------------------------------------------- */
const gradeColumns = [
  { title: 'Course', dataIndex: 'courseName', width: 120 },
  { title: 'Assignment', dataIndex: 'assignmentName', width: 200 },
  {
    title: 'Grade',
    dataIndex: 'grade',
    width: 100,
    customRender: ({ record }: any) => {
      if (record.grade === null)
        return h('span', { class: 'text-gray-400' }, '—')
      return h('span', { class: 'font-semibold' }, `${record.grade}/100`)
    },
  },
  {
    title: 'Status',
    dataIndex: 'status',
    width: 100,
    customRender: ({ record }: any) =>
      h('a-tag', { color: getStatusColor(record.status) },
        record.status.charAt(0).toUpperCase() + record.status.slice(1)
      ),
  },
  {
    title: 'Feedback',
    dataIndex: 'feedback',
    customRender: ({ record }: any) =>
      h('span', { class: 'text-sm' }, record.feedback || '—'),
  },
]

/* -----------------------------------------------------
   📈 Course Breakdown (Mock)
----------------------------------------------------- */
const courseBreakdown = computed(() => {
  const courses: any = {}

  grades.value.forEach(g => {
    if (!courses[g.courseName]) {
      courses[g.courseName] = {
        id: g.courseId,
        courseName: g.courseName,
        grades: [],
      }
    }
    courses[g.courseName].grades.push(g.grade)
  })

  return Object.values(courses).map((course: any) => {
    const graded = course.grades.filter((g: any) => g !== null)
    const avg = graded.length ? (graded.reduce((s, g) => s + g, 0) / graded.length).toFixed(0) : '0'

    return {
      ...course,
      gradedCount: graded.length,
      totalCount: course.grades.length,
      courseAverage: avg,
      trend: parseInt(avg) - 85, // mock trend
    }
  })
})

const courseColumns = [
  { title: 'Course', dataIndex: 'courseName' },
  {
    title: 'Assignments Graded',
    dataIndex: 'gradedCount',
    customRender: ({ record }: any) =>
      `${record.gradedCount}/${record.totalCount}`,
  },
  {
    title: 'Course Average',
    dataIndex: 'courseAverage',
    customRender: ({ record }: any) =>
      h('span', { class: 'font-semibold' }, `${record.courseAverage}%`),
  },
  {
    title: 'Trend',
    dataIndex: 'trend',
    customRender: ({ record }: any) =>
      h('span', {
        class: record.trend >= 0 ? 'text-green-600' : 'text-red-600',
      }, `${record.trend >= 0 ? '+' : ''}${record.trend}%`),
  },
]

/* -----------------------------------------------------
   ⭐ Metrics (Mock)
----------------------------------------------------- */
const metrics = computed(() => {
  const list = grades.value
  if (!list.length) {
    return { gpa: null, average: null, submitted: 0, total: 0, pending: 0, semesterAverage: 0, lastSemesterAverage: 0 }
  }

  const graded = list.filter(x => x.grade !== null)
  const avg = graded.length ? (graded.reduce((s, x) => s + x.grade, 0) / graded.length).toFixed(1) : null
  const gpa = avg ? (parseFloat(avg) / 100 * 4).toFixed(2) : null

  return {
    gpa,
    average: avg,
    submitted: graded.length,
    total: list.length,
    pending: list.filter(x => x.status === 'pending' || x.status === 'submitted').length,
    semesterAverage: avg ? parseFloat(avg) : 0,
    lastSemesterAverage: 82, // static mock
  }
})

/* -----------------------------------------------------
   🗂️ Feedback Feed (Mock)
----------------------------------------------------- */
const feedbackList = computed(() =>
  grades.value
    .filter(g => g.feedback || g.status === 'graded')
    .map(g => ({
      id: g.id,
      assignmentId: g.assignmentId,
      assignmentName: g.assignmentName,
      grade: g.grade || 0,
      feedback: g.feedback,
      status: g.status,
      updatedAt: g.updatedAt,
    }))
)

/* -----------------------------------------------------
   Helpers
----------------------------------------------------- */
function formatDate(date: Date | string) {
  return dayjs(date).fromNow()
}

const getGradeColor = (range: string) =>
  ({
    'A (90-100)': '#52c41a',
    'B (80-89)': '#1890ff',
    'C (70-79)': '#faad14',
    'D (60-69)': '#ff7a45',
    'F (<60)': '#f5222d',
  }[range] || '#1890ff')

const getStatusColor = (status: string) =>
  ({
    graded: 'green',
    pending: 'orange',
    submitted: 'blue',
    draft: 'default',
  }[status] || 'default')

/* -----------------------------------------------------
   Navigation
----------------------------------------------------- */
function nav(path: string) {
  router.push(path)
}

function goBack() {
  router.back()
}
</script>
<!-- 
<script setup lang="ts">
import { computed, h, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuery, gql } from '@vue/apollo-composable'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

const route = useRoute()
const router = useRouter()
const activeTab = ref('grades')

const isDark = ref(false)

const Q_ME = gql`
  query Me {
    me {
      id
      email
      displayName
    }
  }
`
const { result: meRes } = useQuery(Q_ME)
const currentUser = computed(() => meRes.value?.me || null)

const Q_MY_GRADES = gql`
  query MyGrades {
    myGrades {
      id
      assignmentId
      assignmentName
      courseId
      courseName
      grade
      feedback
      status
      updatedAt
      submittedAt
    }
  }
`
const { result: gradesRes, loading: loadingGrades, refetch: refetchGrades } = useQuery(Q_MY_GRADES)

const mockGrades = ref([
  { id: '1', assignmentId: 'a1', assignmentName: 'Midterm Exam', courseName: 'CS 101', grade: 87, feedback: 'Good work!', status: 'graded', updatedAt: new Date() },
  { id: '2', assignmentId: 'a2', assignmentName: 'Project 1', courseName: 'CS 101', grade: 92, feedback: 'Excellent implementation', status: 'graded', updatedAt: new Date(Date.now() - 86400000) },
  { id: '3', assignmentId: 'a3', assignmentName: 'Assignment 3', courseName: 'CS 101', grade: null, feedback: null, status: 'pending', updatedAt: new Date(Date.now() - 172800000) },
  { id: '4', assignmentId: 'a4', assignmentName: 'Final Project', courseName: 'MATH 201', grade: 95, feedback: 'Outstanding!', status: 'graded', updatedAt: new Date(Date.now() - 259200000) },
  { id: '5', assignmentId: 'a5', assignmentName: 'Quiz 2', courseName: 'MATH 201', grade: 88, feedback: 'Good effort', status: 'graded', updatedAt: new Date(Date.now() - 345600000) },
  { id: '6', assignmentId: 'a6', assignmentName: 'Lab Report', courseName: 'PHYS 150', grade: null, feedback: null, status: 'submitted', updatedAt: new Date(Date.now() - 432000000) },
])

const grades = computed(() => {
  const data = gradesRes.value?.myGrades || mockGrades.value
  return data.map(g => ({
    ...g,
    key: g.id,
  }))
})

const gradeColumns = [
  { title: 'Course', dataIndex: 'courseName', width: 120 },
  { title: 'Assignment', dataIndex: 'assignmentName', width: 200 },
  {
    title: 'Grade',
    dataIndex: 'grade',
    width: 100,
    customRender: ({ record }: any) => {
      if (record.grade === null) return h('span', { class: 'text-gray-400' }, '—')
      return h('span', { class: 'font-semibold' }, `${record.grade}/100`)
    },
  },
  {
    title: 'Status',
    dataIndex: 'status',
    width: 100,
    customRender: ({ record }: any) => h(
      'a-tag',
      { color: getStatusColor(record.status) },
      record.status.charAt(0).toUpperCase() + record.status.slice(1)
    ),
  },
  {
    title: 'Feedback',
    dataIndex: 'feedback',
    customRender: ({ record }: any) => h('span', { class: 'text-sm' }, record.feedback || '—'),
  },
]

const courseColumns = [
  { title: 'Course', dataIndex: 'courseName' },
  {
    title: 'Assignments Graded',
    dataIndex: 'gradedCount',
    customRender: ({ record }: any) => `${record.gradedCount}/${record.totalCount}`,
  },
  {
    title: 'Course Average',
    dataIndex: 'courseAverage',
    customRender: ({ record }: any) => h('span', { class: 'font-semibold' }, `${record.courseAverage}%`),
  },
  {
    title: 'Trend',
    dataIndex: 'trend',
    customRender: ({ record }: any) => h(
      'span',
      { class: record.trend >= 0 ? 'text-green-600' : 'text-red-600' },
      `${record.trend >= 0 ? '+' : ''}${record.trend}%`
    ),
  },
]

const metrics = computed(() => {
  const list = grades.value
  if (!list.length) return { gpa: null, average: null, submitted: 0, total: 0, pending: 0, semesterAverage: 0, lastSemesterAverage: 0 }

  const graded = list.filter(x => x.grade !== null)
  const avg = graded.length ? (graded.reduce((s, x) => s + (x.grade || 0), 0) / graded.length).toFixed(1) : null
  const gpa = avg ? (parseFloat(avg as string) / 100 * 4).toFixed(2) : null

  return {
    gpa,
    average: avg,
    submitted: graded.length,
    total: list.length,
    pending: list.filter(x => x.status === 'pending' || x.status === 'submitted').length,
    semesterAverage: avg ? parseFloat(avg as string) : 0,
    lastSemesterAverage: 82,
  }
})

const gradeDistribution = computed(() => {
  const dist: { [key: string]: number } = {}
  const ranges = ['A (90-100)', 'B (80-89)', 'C (70-79)', 'D (60-69)', 'F (<60)']

  ranges.forEach(range => dist[range] = 0)

  grades.value.forEach(g => {
    if (g.grade !== null) {
      if (g.grade >= 90) dist['A (90-100)']++
      else if (g.grade >= 80) dist['B (80-89)']++
      else if (g.grade >= 70) dist['C (70-79)']++
      else if (g.grade >= 60) dist['D (60-69)']++
      else dist['F (<60)']++
    }
  })

  return dist
})

const courseBreakdown = computed(() => {
  const courses: { [key: string]: any } = {}

  grades.value.forEach(g => {
    if (!courses[g.courseName]) {
      courses[g.courseName] = {
        id: g.courseId,
        courseName: g.courseName,
        grades: [],
      }
    }
    courses[g.courseName].grades.push(g.grade)
  })

  return Object.values(courses).map((course: any) => {
    const graded = course.grades.filter((g: any) => g !== null)
    const avg = graded.length ? (graded.reduce((s: number, g: number) => s + g, 0) / graded.length).toFixed(0) : 0

    return {
      ...course,
      gradedCount: graded.length,
      totalCount: course.grades.length,
      courseAverage: avg,
      trend: parseInt(avg as string) - 85,
    }
  })
})

const feedbackList = computed(() => {
  return grades.value
    .filter(g => g.feedback || g.status === 'graded')
    .map(g => ({
      id: g.id,
      assignmentId: g.assignmentId,
      assignmentName: g.assignmentName,
      grade: g.grade || 0,
      feedback: g.feedback,
      status: g.status,
      updatedAt: g.updatedAt,
    }))
})

function nav(p: string) {
  router.push(p)
}

function goBack() {
  router.back()
}

function toggleDarkMode() {
  isDark.value = !isDark.value
  if (isDark.value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
  localStorage.setItem('darkMode', isDark.value ? 'true' : 'false')
}

function formatDate(date: Date | string) {
  return dayjs(date).fromNow()
}

function getStatusColor(status: string): string {
  const colors: { [key: string]: string } = {
    graded: 'green',
    pending: 'orange',
    submitted: 'blue',
    draft: 'default',
  }
  return colors[status] || 'default'
}

function getGradeColor(grade: string): string {
  const colors: { [key: string]: string } = {
    'A (90-100)': '#52c41a',
    'B (80-89)': '#1890ff',
    'C (70-79)': '#faad14',
    'D (60-69)': '#ff7a45',
    'F (<60)': '#f5222d',
  }
  return colors[grade] || '#1890ff'
}

onMounted(() => {
  const savedDarkMode = localStorage.getItem('darkMode') === 'true'
  isDark.value = savedDarkMode
  if (savedDarkMode) {
    document.documentElement.classList.add('dark')
  }
})
</script> -->

<style scoped>
:deep(.ant-card) {
  @apply transition-all;
}

:deep(.ant-progress-text) {
  @apply font-semibold;
}
</style>
