<template>
  <a-space direction="vertical" size="large" style="width:100%">
    <a-page-header title="Faculty Admin">
      <template #extra><NuxtLink to="/teach/courses"><a-button type="primary">My courses</a-button></NuxtLink></template>
    </a-page-header>
    <a-tabs v-model:activeKey="tab">
      <a-tab-pane key="overview" tab="Overview">
        <a-row :gutter="[16,16]">
          <a-col :xs="24" :md="8"><a-card title="Students"><a-statistic :value="metrics.students" /></a-card></a-col>
          <a-col :xs="24" :md="8"><a-card title="Active cohorts"><a-statistic :value="metrics.cohorts" /></a-card></a-col>
          <a-col :xs="24" :md="8"><a-card title="Instructors"><a-statistic :value="metrics.instructors" /></a-card></a-col>
        </a-row>
      </a-tab-pane>
      <a-tab-pane key="cohorts" tab="Cohorts">
        <a-card>
          <template #title>Cohorts</template>
          <a-space style="margin-bottom:12px">
            <a-input v-model:value="newCohort" placeholder="New cohort name" style="width:260px" />
            <a-button type="primary" @click="createCohort" :disabled="!newCohort">Create</a-button>
          </a-space>
          <a-table :columns="cohortCols" :data-source="cohorts" row-key="id" />
        </a-card>
      </a-tab-pane>
      <a-tab-pane key="enrollments" tab="Enrollments">
        <a-table :columns="enCols" :data-source="enrollments" row-key="id" />
      </a-tab-pane>
      <a-tab-pane key="instructors" tab="Instructors">
        <a-table :columns="instCols" :data-source="instructors" row-key="id" />
      </a-tab-pane>
    </a-tabs>
  </a-space>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
const tab = ref('overview')
const metrics = ref<any>({ students:0, cohorts:0, instructors:0 })
const newCohort = ref('')
const cohorts = ref<any[]>([])
const enrollments = ref<any[]>([])
const instructors = ref<any[]>([])

const cohortCols = [
  { title:'Cohort', dataIndex:'name' },
  { title:'Students', dataIndex:'students' },
  { title:'Start', dataIndex:'start', customRender:({text}:any)=> text ? new Date(text).toLocaleDateString() : '' },
  { title:'Status', dataIndex:'status' }
]
const enCols = [
  { title:'Student', dataIndex:'student' },
  { title:'Course', dataIndex:'course' },
  { title:'Progress', dataIndex:'progress', customRender:({text}:any)=> `${text}%` }
]
const instCols = [
  { title:'Name', dataIndex:'name' },
  { title:'Email', dataIndex:'email' },
  { title:'Courses', dataIndex:'courses' }
]

onMounted(async()=>{
  try{ const m:any = await $fetch('/plugins/students-internal/api/faculty/metrics'); metrics.value = m }catch{}
  try{ const c:any = await $fetch('/plugins/students-internal/api/faculty/cohorts'); cohorts.value = c.items || [] }catch{}
  try{ const e:any = await $fetch('/plugins/students-internal/api/faculty/enrollments'); enrollments.value = e.items || [] }catch{}
  try{ const i:any = await $fetch('/plugins/teach-internal/api/instructors'); instructors.value = i.items || [] }catch{}
})

async function createCohort(){
  const res:any = await $fetch('/plugins/students-internal/api/faculty/cohorts', { method:'POST', body:{ name: newCohort.value } })
  if (res?.id){ cohorts.value.push({ id: res.id, name: newCohort.value, students:0, status:'Draft' }); newCohort.value='' }
}
</script>
