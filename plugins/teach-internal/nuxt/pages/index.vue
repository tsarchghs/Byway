
<template>
  <a-config-provider :theme="{ algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm }">
    <a-layout :class="['teach-dash', isDark ? 'is-dark' : '']">
      <a-page-header class="page-header" title="Teacher Dashboard" sub-title="Overview & quick links">
        <template #extra>
          <a-space>
            <a-button href="/teach/courses">Courses</a-button>
            <a-button href="/teach/assignments">Assignments</a-button>
            <a-button href="/institutions">Institutions</a-button>
          </a-space>
        </template>
      </a-page-header>
      <div class="p-4">
        <a-row :gutter="[12,12]">
          <a-col :xs="24" :md="12">
            <a-card title="Courses" :loading="loading">
              <a-list :data-source="courses" :renderItem="(c:any)=> h('div', {class:'row'},[ h('div', {class:'title'}, c.title), h(resolveComponent('a-button'), { type:'link', href:`/plugins/teach-internal/nuxt/pages/modules/${c.firstModuleId || 'mock'}/admin` }, { default:()=> 'Open' }) ])" />
            </a-card>
          </a-col>
          <a-col :xs="24" :md="12">
            <a-card title="Assignments to grade" :loading="loading">
              <a-list :data-source="toGrade" :renderItem="(a:any)=> h('div', {class:'row'},[ h('div', {class:'title'}, a.title), h(resolveComponent('a-button'), { type:'link', href:`/institutions/mock/assignments/${a.id}/grading` }, { default:()=> 'Grade' }) ])" />
            </a-card>
          </a-col>
        </a-row>
      </div>
    </a-layout>
  </a-config-provider>
</template>

<script setup lang="ts">
import { ref, onMounted, h, resolveComponent } from 'vue'
import { useGql } from '../../../packages/shared-ui/src/composables/useGql'
import { theme } from 'ant-design-vue'
definePageMeta({ layout:'teacher', alias:['/teach'] })
const isDark = ref(false)
const loading = ref(true)
const courses = ref<any[]>([])
const toGrade = ref<any[]>([])
onMounted(async () => {
  const { call, endpoints } = useGql();
  // mock - progressive enhancement later
  try { const q = `query { teacherCourses { id title firstModuleId } }`; const d:any = await call(endpoints.teachInternal, q); courses.value = d?.teacherCourses || [] } catch { courses.value = [ { id:'c1', title:'Intro to JS', firstModuleId:'m1' }, { id:'c2', title:'Python for Data', firstModuleId:'m2' } ] }
  try { const q = `query { gradingQueue { id title courseId } }`; const d:any = await call(endpoints.teachInternal, q); toGrade.value = d?.gradingQueue || [] } catch { toGrade.value = [ { id:'a1', title:'Essay Draft' }, { id:'a2', title:'Lab 1' } ] }
  loading.value = false
})
</script>

<style scoped>
.page-header { background: var(--ant-color-bg-container); margin: 8px 8px 0; border-radius: 12px; }
.p-4 { padding: 16px; }
.row { display:flex; align-items:center; justify-content:space-between; padding: 6px 0; }
.title{ font-weight:600; }
</style>
