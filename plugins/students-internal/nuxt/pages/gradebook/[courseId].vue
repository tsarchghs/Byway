<template>
  <a-layout class="p-6">
    <AppNav/>
        <a-page-header
      :title="`Gradebook · ${courseTitle || route.params.courseId}`"
      sub-title="Manage grades and analytics"
      @back="goBack"
    >
      <template #extra>
        <a-space>
          <a-tag v-for="r in me?.roles || []" :key="r" color="blue">{{ r }}</a-tag>
          <a-button v-if="!me" type="primary" @click="goLogin">Login</a-button>
        </a-space>
      </template>
    </a-page-header>

    <a-breadcrumb class="mb-3">
      <a-breadcrumb-item @click="nav('/explore')">Explore</a-breadcrumb-item>
      <a-breadcrumb-item @click="nav('/courses')">Courses</a-breadcrumb-item>
      <a-breadcrumb-item>Gradebook</a-breadcrumb-item>
    </a-breadcrumb>

    <a-card>
      <a-tabs v-model:activeKey="tab">
        <a-tab-pane key="grades" tab="Grades">
          <a-alert type="info" message="Click a cell to edit grade; saved via GraphQL." class="mb-3" />
          <a-table :data-source="rows" :columns="cols" row-key="id" :loading="loading"/>
        </a-tab-pane>
        <a-tab-pane key="analytics" tab="Analytics">
          <div class="grid md:grid-cols-3 gap-3 mb-4">
            <a-card size="small" title="Average">{{ metrics.avg ?? '—' }}</a-card>
            <a-card size="small" title="Submitted">{{ metrics.submitted }}</a-card>
            <a-card size="small" title="Ungraded">{{ metrics.ungraded }}</a-card>
          </div>
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </a-layout>
</template>

\1
import AppNav from '~/plugins/students-internal/nuxt/components/AppNav.vue'

import { computed, h, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuery, useMutation, gql } from '@vue/apollo-composable'

const route = useRoute()
const router = useRouter()
const tab = ref('grades')

const Q_ME = gql`query Me { me { id email displayName roles } }`
const { result: meRes } = useQuery(Q_ME)
const me = computed(() => meRes.value?.me || null)

function nav(p: string){ router.push(p) }
function goBack(){ router.back() }
function goLogin(){ router.push('/login') }

const Q_GB = gql`query($courseId: ID!){ gradebook(courseId:$courseId){ id assignmentId studentId courseId grade feedback updatedAt } }`
const { result, loading, refetch } = useQuery(Q_GB, { courseId: route.params.courseId as string })
const rows = computed(() => (result.value?.gradebook || []).map(e => ({ ...e, key: e.id })))

const courseTitle = ref<string|undefined>(undefined)

const M_UPSERT = gql`mutation($input: GradebookInput!){ upsertGrade(input:$input){ id grade feedback updatedAt } }`
const { mutate: upsertGrade } = useMutation(M_UPSERT)

const metrics = computed(() => {
  const list = rows.value
  if (!list.length) return { avg: null, submitted: 0, ungraded: 0 }
  const have = list.filter(x => typeof x.grade === 'number')
  const avg = have.length ? (have.reduce((s, x) => s + (x.grade||0), 0) / have.length).toFixed(2) : null
  const submitted = have.length
  const ungraded = list.length - submitted
  return { avg, submitted, ungraded }
})

const cols = [
  { title: 'Student', dataIndex: 'studentId' },
  { title: 'Assignment', dataIndex: 'assignmentId' },
  {
    title: 'Grade',
    dataIndex: 'grade',
    customRender: ({ record }: any) => h('a-input-number', {
      modelValue: record.grade, min: 0, max: 100, step: 1,
      onChange: async (val: number) => {
        await upsertGrade({ input: { assignmentId: record.assignmentId, studentId: record.studentId, courseId: record.courseId, grade: Number(val) }})
        await refetch()
      }
    })
  },
  {
    title: 'Feedback',
    dataIndex: 'feedback',
    customRender: ({ record }: any) => h('a-input', {
      modelValue: record.feedback || '',
      onChange: async (e: any) => {
        await upsertGrade({ input: { assignmentId: record.assignmentId, studentId: record.studentId, courseId: record.courseId, feedback: String(e?.target?.value || '') }})
        await refetch()
      }
    })
  },
  { title: 'Updated', dataIndex: 'updatedAt' },
]
</script>