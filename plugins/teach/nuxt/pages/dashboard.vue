<template>
  <a-layout class="p-6">
    <a-page-header title="Teacher Dashboard" sub-title="Courses, assignments, analytics">
      <template #extra>
        <a-space>
          <a-button type="primary" @click="$router.push('/teach/courses/create')">
            <template #icon><PlusOutlined/></template>
            New Course
          </a-button>
          <a-button @click="refresh"><ReloadOutlined/></a-button>
        </a-space>
      </template>
    </a-page-header>

    <a-row :gutter="[16,16]" class="mt-4">
      <a-col :span="8">
        <a-card title="Courses" :loading="loading">
          <a-list :data-source="overview.courses" :renderItem="rCourse" />
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card title="Assignments" :loading="loading">
          <a-list :data-source="overview.assignments" :renderItem="rAssignment" />
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card title="Signals" :loading="loading">
          <a-list :data-source="overview.signals" :renderItem="rSignal" />
        </a-card>
      </a-col>
    </a-row>
  </a-layout>
</template>

<script setup lang="ts">
import { h, ref, onMounted } from 'vue'
import { useApolloClient } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons-vue'

const Q_OVERVIEW = gql`query TeacherOverview {
  teacherOverview { 
    courses { id title students }
    assignments { id title courseTitle submissions }
    signals { at message }
  }
}`

const { client } = useApolloClient()
const loading = ref(true)
const overview = ref<any>({ courses: [], assignments: [], signals: [] })

function rCourse(it:any){ return h('a-list-item', {}, `${it.title} — ${it.students} students`) }
function rAssignment(it:any){ return h('a-list-item', {}, `${it.title} · ${it.courseTitle} — ${it.submissions} submissions`) }
function rSignal(it:any){ return h('a-list-item', {}, `${it.at} — ${it.message}`) }

async function refresh() {
  loading.value = true
  const { data } = await client.query({ query: Q_OVERVIEW, fetchPolicy: 'network-only', context: { endpoint: '/api/teach/graphql' } as any })
  overview.value = data?.teacherOverview || { courses: [], assignments: [], signals: [] }
  loading.value = false
}
onMounted(refresh)
</script>
