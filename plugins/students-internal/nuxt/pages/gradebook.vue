<template>
  <a-layout class="p-6">
    <a-breadcrumb class="mb-4">
      <a-breadcrumb-item to="/">Home</a-breadcrumb-item>
      <a-breadcrumb-item>Students</a-breadcrumb-item>
      <a-breadcrumb-item>Gradebook</a-breadcrumb-item>
    </a-breadcrumb>

    <a-page-header title="Gradebook" sub-title="Overview across courses and modules">
      <template #extra>
        <a-space>
          <a-button @click="go('/plugins/teach/nuxt/pages/assignments')"><file-text-outlined/> Assignments</a-button>
          <a-button @click="go('/explore')"><compass-outlined/> Explore</a-button>
        </a-space>
      </template>
    </a-page-header>

    <a-card :loading="loading" :bordered="false" class="mb-4">
      <a-tabs v-model:activeKey="tab">
        <a-tab-pane key="courses" tab="By Course">
          <a-table :data-source="overview.courses" :columns="cols.courses" row-key="id" />
        </a-tab-pane>
        <a-tab-pane key="modules" tab="By Module">
          <a-table :data-source="overview.modules" :columns="cols.modules" row-key="id" />
        </a-tab-pane>
        <a-tab-pane key="assignments" tab="Assignments">
          <a-table :data-source="overview.assignments" :columns="cols.assignments" row-key="id" />
        </a-tab-pane>
        <a-tab-pane key="analytics" tab="Analytics">
          <div class="grid md:grid-cols-3 gap-3">
            <a-card size="small" title="Avg. Grade">{{ overview.metrics.avgGrade?.toFixed(1) ?? '—' }}</a-card>
            <a-card size="small" title="Completed">{{ overview.metrics.completed }}</a-card>
            <a-card size="small" title="Outstanding">{{ overview.metrics.outstanding }}</a-card>
          </div>
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </a-layout>
</template>

<script setup lang="ts">
import { h, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUiPrefs } from '~/composables/useUiPrefs'

const router = useRouter()
const { set: setPref, getSync } = useUiPrefs()
const tab = ref(getSync('gradebook.tab') || 'courses')
const loading = ref(true)
const overview = ref<any>({
  courses: [],
  modules: [],
  assignments: [],
  metrics: { avgGrade: null, completed: 0, outstanding: 0 }
})

function go(path: string){ router.push(path) }

const cols = {
  courses: [
    { title: 'Course', dataIndex: 'title' },
    { title: 'Progress', key: 'progress', customRender: ({record}:any)=> h('div', {}, [h('div', {}, `${record.completed}/${record.total}`), h('a-progress', { percent: Math.round((record.completed||0)/(record.total||1)*100) })]) },
    { title: 'Grade', dataIndex: 'grade' },
  ],
  modules: [
    { title: 'Module', dataIndex: 'title' },
    { title: 'Lessons', dataIndex: 'lessons' },
    { title: 'Grade', dataIndex: 'grade' },
  ],
  assignments: [
    { title: 'Assignment', dataIndex: 'title' },
    { title: 'Course', dataIndex: 'courseTitle' },
    { title: 'Score', dataIndex: 'score' },
    { title: 'Status', dataIndex: 'status' },
  ],
}

async function fetchOverview(){
  try {
    const resp = await fetch('/api/students-internal/graphql', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ query: `
        query{
          gradebookOverview{
            metrics { avgGrade completed outstanding }
            courses { id title total completed grade }
            modules { id title lessons grade }
            assignments { id title courseTitle score status }
          }
        }`})
    })
    const json = await resp.json()
    if (json?.data?.gradebookOverview) overview.value = json.data.gradebookOverview
  } finally {
    loading.value = false
  }
}

onMounted(async ()=>{
  await fetchOverview()
})

watch(tab, (v)=> setPref('gradebook.tab', v))
</script>
