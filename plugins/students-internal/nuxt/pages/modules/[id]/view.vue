<template>
  <a-layout class="p-6">
    <a-card :title="`Module · ${module?.title || route.params.id}`" :bordered="false">
      <div class="mb-4 grid md:grid-cols-3 gap-3">
        <a-card size="small" title="Course ID"><div class="text-lg">{{ module?.courseId || '-' }}</div></a-card>
        <a-card size="small" title="Lessons"><div class="text-lg">{{ lessons.length }}</div></a-card>
        <a-card size="small" title="Progress"><div class="text-lg">{{ progressPct }}%</div><a-progress :percent="progressPct" /></a-card>
      </div>

      <a-collapse accordion>
  <a-collapse-panel key="stats" header="Module Stats"><div class="grid grid-cols-2 gap-3"><a-card size="small" title="Lessons">{{ lessons.length }}</a-card><a-card size="small" title="Assignments">{{ assignments.length }}</a-card><a-card size="small" title="Completed">{{ completedCount }}</a-card><a-card size="small" title="Progress Avg">{{ (progressPct || 0).toFixed(0) }}%</a-card></div></a-collapse-panel>
            <a-collapse-panel key="timeline" header="Deadlines Timeline">
              <a-list :data-source="timeline" :renderItem="(i:any)=> h('div', {}, `${i.title} · ${i.when}`)" />
            </a-collapse-panel>
            <a-collapse-panel key="reading" header="Reading Pane">
              <a-textarea v-model:value="reading" :rows="6" placeholder="Notes / rendered content (demo)" />
            </a-collapse-panel>
        <a-collapse-panel key="lessons" header="Lessons">
          <a-list :data-source="lessons" :renderItem="renderLesson" />
        </a-collapse-panel>
        <a-collapse-panel key="assignments" header="Assignments (by classroom)">
          <div class="mb-2 flex gap-2 items-center">
            <a-input v-model:value="classroomId" placeholder="Classroom ID (optional)" style="max-width:280px" />
            <a-button @click="loadAssignments">Load</a-button>
          </div>
          <a-table :data-source="assignments" :columns="aCols" row-key="id" />
        </a-collapse-panel>
        <a-collapse-panel key="resources" header="Resources">
          <a-list :data-source="resources" :renderItem="(item:any)=> h('a', { href: item.url, target: '_blank' }, item.name)" />
        </a-collapse-panel>
        <a-collapse-panel key="discussion" header="Discussion (local)">
          <div class="mb-2">
            <a-input-text-area v-model:value="message" :rows="3" placeholder="Message (local demo)" />
            <a-button class="mt-2" @click="post">Post</a-button>
          </div>
          <a-list :data-source="messages" :renderItem="(m:any)=> h('div', {}, `${m.ts}: ${m.text}`)" />
        </a-collapse-panel>
      <a-collapse-panel key="check" header="Module Checklist"><a-list :data-source="checklist" :renderItem="(i:any)=> h('div', {}, [ h('input', { type: 'checkbox', checked: i.done, onChange:()=> i.done=!i.done }), h('span', ' ' + i.title) ])" /></a-collapse-panel></a-collapse>
    </a-card>
  </a-layout>
  
  <!-- University Panel (incremental, append-only) -->
  <ModuleUniversityPanel />
</template>

\1import ModuleUniversityPanel from '@/components/ModuleUniversityPanel.vue';
const route = useRoute()
const config = useRuntimeConfig()
const baseUrl = config.public?.apiBase || 'http://localhost:4000'

const module = ref<any>(null)
const lessons = ref<any[]>([])
const completedIds = ref<string[]>([])

const classroomId = ref('')
const assignments = ref<any[]>([])
    const timeline = ref<any[]>([])
const checklist = ref<any[]>([{ title:'Watch intro video', done:false }, { title:'Read slides', done:false }, { title:'Submit Assignment 1', done:false }])
const aCols = [
  { title: 'Title', dataIndex: 'title', key: 'title' },
  { title: 'Due', dataIndex: 'dueDate', key: 'dueDate' },
  { title: 'Actions', key: 'act', customRender: ({ record }: any) => h('a', { href: `/institutions/_/assignments/${record.id}/grading` }, 'View') },
]

const resources = ref<any[]>([
  { name: 'Syllabus PDF', url: '#' },
  { name: 'Lab template', url: '#' },
  { name: 'Office hours link', url: '#' },
])

const message = ref('')
const messages = ref<any[]>([])
    const reading = ref('')
function post(){ if(message.value){ messages.value.unshift({ ts: new Date().toISOString(), text: message.value }); message.value='' } }

const studentId = ref('') // optional; for updateProgress
const progressPct = computed(()=> lessons.value.length ? Math.round((completedIds.value.length/lessons.value.length)*100) : 0)

function renderLesson({ item }: any) {
  const checked = completedIds.value.includes(item.id)
  return h('a-list-item', {}, [
    h('div', {}, item.title),
    h('div', {}, [
      h('a-switch', {
        checked,
        onChange: async (val:any)=> {
          if (!studentId.value) return
          const q = 'mutation($studentId:String!,$lessonId:String!,$completed:Boolean){ updateProgress(studentId:$studentId,lessonId:$lessonId,completed:$completed){ id status } }'
          await $fetch(`${baseUrl}/api/students-internal/graphql`, { method: 'POST', body: { query: q, variables: { studentId: studentId.value, lessonId: item.id, completed: !!val }}})
          if (val) completedIds.value = Array.from(new Set([...completedIds.value, item.id]))
          else completedIds.value = completedIds.value.filter((x)=> x!==item.id)
        }
      })
    ])
  ])
}

async function loadModule() {
  const q = 'query($id:String!){ moduleById(id:$id){ id title courseId } }'
  const r = await $fetch(`${baseUrl}/api/teach-internal/graphql`, { method: 'POST', body: { query: q, variables: { id: String(route.params.id) }}}) as any
  module.value = r.data?.moduleById ?? null
}
async function loadLessons() {
  if (!module.value) return
  const q = 'query($moduleId:String!){ lessonsByModule(moduleId:$moduleId){ id title } }'
  const r = await $fetch(`${baseUrl}/api/teach-internal/graphql`, { method: 'POST', body: { query: q, variables: { moduleId: module.value.id }}}) as any
  lessons.value = r.data?.lessonsByModule ?? []
}
async function loadAssignments() {
  assignments.value = []
  if (!classroomId.value) return
  const q = 'query($classroomId:String!){ assignmentsByClassroom(classroomId:$classroomId){ id title dueDate } }'
  const r = await $fetch(`${baseUrl}/api/teach-internal/graphql`, { method: 'POST', body: { query: q, variables: { classroomId: classroomId.value }}}) as any
  assignments.value = r.data?.assignmentsByClassroom ?? []
      timeline.value = assignments.value.map((a:any)=> ({ title: a.title, when: a.dueDate || '-' }))
}

async function init(){ await loadModule(); await loadLessons() }
onMounted(init)
</script>
