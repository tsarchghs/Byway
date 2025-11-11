<template>
  <a-layout class="p-6">
    <a-breadcrumb class="mb-4">
      <a-breadcrumb-item to="/">Home</a-breadcrumb-item>
      <a-breadcrumb-item>Teach</a-breadcrumb-item>
      <a-breadcrumb-item>Dashboard</a-breadcrumb-item>
    </a-breadcrumb>

    <a-page-header title="Teacher Dashboard" sub-title="Courses · Assignments · Analytics">
      <template #extra>
        <a-space>
          <a-button type="primary" @click="go('/plugins/teach/nuxt/pages/course-create')">
            <plus-outlined/> New Course
          </a-button>
          <a-button @click="go('/plugins/students-internal/nuxt/pages/gradebook')">
            <bar-chart-outlined/> Gradebook
          </a-button>
        </a-space>
      </template>
    </a-page-header>

    <a-card :loading="loading" :bordered="false">
      <a-tabs v-model:activeKey="tab">
        <a-tab-pane key="courses" tab="My Courses">
          <a-table :data-source="rows.courses" :columns="cols.courses" row-key="id" />
        </a-tab-pane>
        <a-tab-pane key="assignments" tab="Assignments">
          <a-table :data-source="rows.assignments" :columns="cols.assignments" row-key="id" />
        </a-tab-pane>
        <a-tab-pane key="analytics" tab="Analytics">
          <div class="grid md:grid-cols-3 gap-3">
            <a-card size="small" title="Total Students">{{ rows.metrics.students }}</a-card>
            <a-card size="small" title="Active Courses">{{ rows.metrics.courses }}</a-card>
            <a-card size="small" title="Pending Reviews">{{ rows.metrics.pending }}</a-card>
          </div>
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </a-layout>
</template>

<script setup lang="ts">
import { ref, h, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUiPrefs } from '~/composables/useUiPrefs'

const router = useRouter()
const { set: setPref, getSync } = useUiPrefs()
const tab = ref(getSync('teach.tab') || 'courses')
const loading = ref(true)

const rows = ref<any>({ courses: [], assignments: [], metrics: { students: 0, courses: 0, pending: 0 } })

const cols = {
  courses: [
    { title: 'Title', dataIndex: 'title' },
    { title: 'Published', dataIndex: 'published' },
    { title: 'Enrolled', dataIndex: 'enrolled' },
  ],
  assignments: [
    { title: 'Title', dataIndex: 'title' },
    { title: 'Course', dataIndex: 'courseTitle' },
    { title: 'Submissions', dataIndex: 'submissions' },
    { title: 'Pending', dataIndex: 'pending' },
  ],
}

function go(path:string){ router.push(path) }

async function fetchData(){
  try {
    const resp = await fetch('/api/teach/graphql', { 
      method: 'POST', headers: { 'content-type': 'application/json' }, credentials: 'include',
      body: JSON.stringify({ query: `query{
        teacherOverview{
          metrics { students courses pending }
          courses { id title published enrolled }
          assignments { id title courseTitle submissions pending }
        }
      }` })
    })
    const json = await resp.json()
    if (json?.data?.teacherOverview) rows.value = json.data.teacherOverview
  } finally {
    loading.value = false
  }
}

onMounted(fetchData)
watch(tab, (v)=> setPref('teach.tab', v))
</script>
