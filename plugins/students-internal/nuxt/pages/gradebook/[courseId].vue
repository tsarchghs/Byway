<template>
  <a-layout class="gradebook-wrap p-6">
    <AppNav/>

    <!-- HEADER -->
    <a-page-header
      class="gradebook-header"
      :title="`Gradebook · ${courseTitle || route.params.courseId}`"
      sub-title="Manage grades and analytics"
      @back="goBack"
    >
      <template #extra>
        <a-space>
          <a-tag
            v-for="r in me?.roles || []"
            :key="r"
            color="blue"
          >
            {{ r }}
          </a-tag>

          <a-button v-if="!me" type="primary" @click="goLogin">
            Login
          </a-button>
        </a-space>
      </template>
    </a-page-header>

    <!-- BREADCRUMB -->
    <a-breadcrumb class="mb-3">
      <a-breadcrumb-item @click="nav('/explore')">Explore</a-breadcrumb-item>
      <a-breadcrumb-item @click="nav('/courses')">Courses</a-breadcrumb-item>
      <a-breadcrumb-item>Gradebook</a-breadcrumb-item>
    </a-breadcrumb>

    <!-- MAIN CARD -->
    <a-card class="shadow-sm">
      <a-tabs v-model:activeKey="tab">
        
        <!-- GRADES TAB -->
        <a-tab-pane key="grades" tab="Grades">
          <a-alert
            type="info"
            message="Click a grade or feedback cell to edit; changes save instantly via GraphQL."
            class="mb-3"
            show-icon
          />

          <a-table
            :data-source="rows"
            :columns="cols"
            row-key="id"
            :loading="loading"
            size="middle"
            bordered
          />
        </a-tab-pane>

        <!-- ANALYTICS TAB -->
        <a-tab-pane key="analytics" tab="Analytics">
          <div class="grid md:grid-cols-3 gap-3 mb-4">
            <a-card size="small" title="Average Grade">
              <h2 class="stat">{{ metrics.avg ?? '—' }}</h2>
            </a-card>

            <a-card size="small" title="Submitted">
              <h2 class="stat">{{ metrics.submitted }}</h2>
            </a-card>

            <a-card size="small" title="Ungraded">
              <h2 class="stat">{{ metrics.ungraded }}</h2>
            </a-card>
          </div>
        </a-tab-pane>

      </a-tabs>
    </a-card>
  </a-layout>
</template>
<script setup lang="ts">
import AppNav from '../../components/AppNav.vue'
import { computed, h, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

/* ----------------------------------
   Route + Router
---------------------------------- */
const route = useRoute()
const router = useRouter()
const tab = ref('grades')

function nav(p: string) { router.push(p) }
function goBack() { router.back() }
function goLogin() { router.push('/login') }

/* ----------------------------------
   MOCK: Auth (Me)
---------------------------------- */
const me = ref({
  id: 'u123',
  email: 'test@example.com',
  displayName: 'Demo Teacher',
  roles: ['TEACHER'],
})

/* ----------------------------------
   MOCK: Gradebook Data
---------------------------------- */
const loading = ref(true)

const mockGradebook = ref<any[]>([])

onMounted(() => {
  // Fake latency
  setTimeout(() => {
    mockGradebook.value = [
      {
        id: 'g1',
        assignmentId: 'ass1',
        studentId: 'stu1',
        courseId: route.params.courseId || 'course-demo',
        grade: 92,
        feedback: 'Excellent work!',
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'g2',
        assignmentId: 'ass1',
        studentId: 'stu2',
        courseId: route.params.courseId || 'course-demo',
        grade: null,
        feedback: '',
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'g3',
        assignmentId: 'ass2',
        studentId: 'stu1',
        courseId: route.params.courseId || 'course-demo',
        grade: 80,
        feedback: 'Solid job.',
        updatedAt: new Date().toISOString(),
      },
    ]
    loading.value = false
  }, 400)
})

const rows = computed(() =>
  mockGradebook.value.map(e => ({ ...e, key: e.id }))
)

const courseTitle = ref<string>('Demo Course Title')

/* ----------------------------------
   MOCK: UPSERT GRADE
---------------------------------- */
async function upsertGradeMock(input: any) {
  const row = mockGradebook.value.find(
    x =>
      x.assignmentId === input.assignmentId &&
      x.studentId === input.studentId &&
      x.courseId === input.courseId
  )

  if (row) {
    if (input.grade != null) row.grade = input.grade
    if (input.feedback != null) row.feedback = input.feedback
    row.updatedAt = new Date().toISOString()
  }
}

/* ----------------------------------
   METRICS
---------------------------------- */
const metrics = computed(() => {
  const list = rows.value
  if (!list.length) return { avg: null, submitted: 0, ungraded: 0 }

  const graded = list.filter(x => typeof x.grade === 'number')
  const avg = graded.length
    ? (graded.reduce((s, x) => s + (x.grade || 0), 0) / graded.length).toFixed(2)
    : null

  return {
    avg,
    submitted: graded.length,
    ungraded: list.length - graded.length,
  }
})

/* ----------------------------------
   TABLE COLUMNS (Mock Same UI)
---------------------------------- */
const cols = [
  { title: 'Student', dataIndex: 'studentId' },
  { title: 'Assignment', dataIndex: 'assignmentId' },

  {
    title: 'Grade',
    dataIndex: 'grade',
    customRender: ({ record }: any) =>
      h('a-input-number', {
        modelValue: record.grade,
        min: 0,
        max: 100,
        step: 1,
        style: 'width:80px',
        async onChange(val: number) {
          await upsertGradeMock({
            assignmentId: record.assignmentId,
            studentId: record.studentId,
            courseId: record.courseId,
            grade: Number(val),
          })
        },
      }),
  },

  {
    title: 'Feedback',
    dataIndex: 'feedback',
    customRender: ({ record }: any) =>
      h('a-input', {
        modelValue: record.feedback || '',
        placeholder: 'Enter feedback…',
        style: 'min-width:180px',
        async onChange(e: any) {
          await upsertGradeMock({
            assignmentId: record.assignmentId,
            studentId: record.studentId,
            courseId: record.courseId,
            feedback: String(e?.target?.value || ''),
          })
        },
      }),
  },

  { title: 'Updated', dataIndex: 'updatedAt' },
]
</script>

<style scoped>
.gradebook-wrap {
  min-height: 100vh;
  background: var(--ant-color-bg-layout, #f5f5f5);
}

.gradebook-header {
  margin-bottom: 16px;
  border-radius: 12px;
  background: var(--ant-color-bg-container, #fff);
  box-shadow: 0 2px 4px rgba(15, 23, 42, 0.08);
}

.stat {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
}
</style>
