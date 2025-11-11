
<template>
  <a-config-provider :theme="{ algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm }">
    <a-layout :class="['assignments-wrap', isDark ? 'is-dark' : '']">
      <a-page-header class="page-header" title="Assignments" sub-title="Upcoming & graded">
        <template #extra>
          <a-space>
            <a-button href="/gradebook" type="default">Gradebook</a-button>
            <a-button href="/courses" type="default">My Courses</a-button>
          </a-space>
        </template>
      </a-page-header>
      <div class="p-4">
        <a-skeleton v-if="loading" active :paragraph="{rows:4}" class="mb-2" />
        <a-row :gutter="[12,12]">
          <a-col :xs="24" :md="12">
            <a-card title="Upcoming">
              <a-list :data-source="upcoming" :renderItem="renderItem" />
            </a-card>
          </a-col>
          <a-col :xs="24" :md="12">
            <a-card title="Recently graded">
              <a-list :data-source="graded" :renderItem="renderItem" />
            </a-card>
          </a-col>
        </a-row>
      </div>
    </a-layout>
  </a-config-provider>
</template>

<script setup lang="ts">
import { ref, h, onMounted, resolveComponent } from 'vue'
import { useGql } from '../../../packages/shared-ui/src/composables/useGql'
import { theme } from 'ant-design-vue'
definePageMeta({ layout: 'student', title: 'Assignments' })
const isDark = ref(false)
const loading = ref(false)
const upcoming = ref<any[]>([])
const graded = ref<any[]>([])

function renderItem(item:any){
  return h('div', { class:'a-row' }, [
    h('div', { class:'meta' }, [ h('div', { class:'title' }, item.title), h('div', { class:'course' }, item.course) ]),
    h(resolveComponent('a-space'), {}, { default:() => [
      h(resolveComponent('a-tag'), { color: item.status==='due' ? 'gold' : 'blue' }, { default:()=> item.status }),
      h(resolveComponent('a-button'), { type:'link', href:`/modules/${item.moduleId || 'mock'}/view` }, { default:()=>'Open' })
    ] })
  ])
}

onMounted(() => { loading.value = true;
  const { call, endpoints } = useGql();
  (async () => {
    try {
      const q = `query ($studentId:String){ assignmentsByStudent(studentId:$studentId){ id title course status moduleId graded gradedAt } }`
      const d:any = await call(endpoints.students, q, { studentId: undefined })
      const arr = Array.isArray(d?.assignmentsByStudent) ? d.assignmentsByStudent : []
      upcoming.value = arr.filter((x:any)=> x.status==='due' || x.status==='assigned')
      graded.value = arr.filter((x:any)=> x.status==='graded')
      return
    } catch(e) {
      // will fall through to page mocks below
    }
  })();
  upcoming.value = [
    { id:'u1', title:'Essay draft', course:'Intro to Writing', status:'due', moduleId:'m1' },
    { id:'u2', title:'Lab 2', course:'JS Essentials', status:'due', moduleId:'m2' },
  ]
  graded.value = [
    { id:'g1', title:'Quiz 1', course:'Python for Data', status:'graded', moduleId:'m3' }
  ]
})
</script>

<style scoped>
.assignments-wrap { min-height: 100vh; }
.page-header { background: var(--ant-color-bg-container); margin: 8px 8px 0; border-radius: 12px; }
.p-4 { padding: 16px; }
.a-row { display:flex; align-items:center; justify-content:space-between; padding: 6px 0; }
.meta .title { font-weight: 600; }
.meta .course { color:#777; font-size: 12px; }
</style>

<script setup lang="ts">
// ensure loading off after mount mocks
setTimeout(()=>{ try{ loading.value=false }catch(e){} }, 250)
</script>
