
<template>
  <a-config-provider :theme="{ algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm }">
    <a-layout :class="['classrooms-wrap', isDark ? 'is-dark' : '']">
      <a-page-header class="page-header" title="Classrooms" sub-title="Your groups & cohorts">
        <template #extra>
          <a-button href="/courses" type="default">My Courses</a-button>
        </template>
      </a-page-header>
      <div class="p-4">
        <a-table :data-source="rows" :columns="cols" row-key="id" />
      </div>
    </a-layout>
  </a-config-provider>
</template>

<script setup lang="ts">
import { ref, resolveComponent } from 'vue'
import { useGql } from '../../../packages/shared-ui/src/composables/useGql'
import { theme } from 'ant-design-vue'
definePageMeta({ layout: 'student', title: 'Classrooms' })
const isDark = ref(false)
const rows = ref<any[]>([])
;(async ()=>{
  try{
    const { call, endpoints } = useGql()
    const q = `query($studentId:String){ classroomsByStudent(studentId:$studentId){ id name course members } }`
    const d:any = await call(endpoints.students, q, { studentId: undefined })
    rows.value = Array.isArray(d?.classroomsByStudent) ? d.classroomsByStudent : []
  } catch{ rows.value = [{ id:'c101', name:'Cohort A', course:'JS Essentials', members:24 }, { id:'c102', name:'Data 2025', course:'Python for Data', members:18 }] }
})()
const cols = [
  { title:'Name', dataIndex:'name', key:'name' },
  { title:'Course', dataIndex:'course', key:'course' },
  { title:'Members', dataIndex:'members', key:'members' },
  { title:'Actions', key:'actions', customRender: ({record}:any) => h(resolveComponent('a-button'), { type:'link', href:`/classrooms/${record.id}` }, { default:()=>'Open' }) },
]
</script>

<style scoped>
.classrooms-wrap { min-height: 100vh; }
.page-header { background: var(--ant-color-bg-container); margin: 8px 8px 0; border-radius: 12px; }
.p-4 { padding: 16px; }
</style>
