<template>
  <a-layout class="p-6">
    <a-card :title="`Module · ${mod?.title || route.params.id}`" :bordered="false">
      <div class="mb-4 grid md:grid-cols-3 gap-3">
        <a-card size="small" title="Course ID">
          <div class="text-lg">{{ mod?.courseId || '-' }}</div>
        </a-card>
        <a-card size="small" title="Lessons">
          <div class="text-lg">{{ lessons.length }}</div>
        </a-card>
        <a-card size="small" title="Progress">
          <div class="text-lg">{{ progressPct }}%</div>
          <a-progress :percent="progressPct" />
        </a-card>
      </div>

      <a-collapse accordion>
        <a-collapse-panel key="stats" header="Module Stats">
          <div class="grid grid-cols-2 gap-3">
            <a-card size="small" title="Lessons">{{ lessons.length }}</a-card>
            <a-card size="small" title="Assignments">{{ assignments.length }}</a-card>
            <a-card size="small" title="Completed">{{ completedCount }}</a-card>
            <a-card size="small" title="Progress Avg">{{ progressPct }}%</a-card>
          </div>
        </a-collapse-panel>

        <a-collapse-panel key="timeline" header="Deadlines Timeline">
          <a-list :data-source="timeline" :renderItem="renderTimelineItem" />
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
          <a-list
            :data-source="resources"
            :renderItem="(item:any)=> h('a', { href: item.url, target: '_blank' }, item.name)"
          />
        </a-collapse-panel>

        <a-collapse-panel key="discussion" header="Discussion (local)">
          <div class="mb-2">
            <a-textarea v-model:value="message" :rows="3" placeholder="Message (local demo)" />
            <a-button class="mt-2" @click="post">Post</a-button>
          </div>
          <a-list :data-source="messages" :renderItem="(m:any)=> h('div', {}, `${m.ts}: ${m.text}`)" />
        </a-collapse-panel>

        <a-collapse-panel key="check" header="Module Checklist">
          <a-list
            :data-source="checklist"
            :renderItem="(i:any)=> h('div', {}, [
              h('input', { type: 'checkbox', checked: i.done, onChange:()=> i.done=!i.done }),
              h('span', ' ' + i.title)
            ])"
          />
        </a-collapse-panel>
      </a-collapse>
    </a-card>
  </a-layout>

  <!-- University Panel (incremental, append-only; stubbed if real component missing) -->
  <ModuleUniversityPanel />
</template>

<script setup lang="ts">
import { ref, computed, h, onMounted, defineComponent } from 'vue'
import { useRoute, useRuntimeConfig } from '#imports'

// Try to load real component; fall back to a safe stub so page never breaks
let ModuleUniversityPanel: any = defineComponent({
  name: 'ModuleUniversityPanelStub',
  template: `<div class="mt-6"><a-alert type="info" show-icon message="ModuleUniversityPanel (stub)" /></div>`
})
try {
  // top-level await is supported in <script setup>
  ModuleUniversityPanel = (await import('@/components/ModuleUniversityPanel.vue')).default
} catch (e) {
  console.warn('[students-internal] Using stub ModuleUniversityPanel:', (e as any)?.message || e)
}

const route = useRoute()
const config = useRuntimeConfig()
const baseUrl = config.public?.apiBase || 'http://localhost:4000'

// Flip to false to hit real APIs
const MOCK_MODE = true
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))

const mod = ref<any>(null)
const lessons = ref<any[]>([])
const completedIds = ref<string[]>([])

const classroomId = ref('')
const assignments = ref<any[]>([])
const timeline = ref<any[]>([])
const checklist = ref<any[]>([
  { title: 'Watch intro video', done: false },
  { title: 'Read slides', done: false },
  { title: 'Submit Assignment 1', done: false }
])

const aCols = [
  { title: 'Title', dataIndex: 'title', key: 'title' },
  { title: 'Due', dataIndex: 'dueDate', key: 'dueDate' },
  {
    title: 'Actions',
    key: 'act',
    customRender: ({ record }: any) =>
      h('a', { href: `/institutions/_/assignments/${record.id}/grading` }, 'View')
  }
]

const resources = ref<any[]>([
  { name: 'Syllabus PDF', url: '#' },
  { name: 'Lab template', url: '#' },
  { name: 'Office hours link', url: '#' }
])

const message = ref('')
const messages = ref<any[]>([])
const reading = ref('')

// Optional; required only if MOCK_MODE=false and you want remote progress updates
const studentId = ref('')

const progressPct = computed(() =>
  lessons.value.length
    ? Math.round((completedIds.value.length / lessons.value.length) * 100)
    : 0
)
const completedCount = computed(() => completedIds.value.length)

function post() {
  if (message.value) {
    messages.value.unshift({ ts: new Date().toISOString(), text: message.value })
    message.value = ''
  }
}

function renderTimelineItem(i: any) {
  return h('div', {}, `${i.title} · ${i.when}`)
}

function renderLesson({ item }: any) {
  const checked = completedIds.value.includes(item.id)
  return h('a-list-item', {}, [
    h('div', { class: 'font-medium' }, item.title),
    h('div', { class: 'ml-auto' }, [
      h('a-switch', {
        checked,
        onChange: async (val: any) => {
          // Always works locally; attempts remote update only if MOCK_MODE=false
          if (MOCK_MODE) {
            if (val)
              completedIds.value = Array.from(new Set([...completedIds.value, item.id]))
            else completedIds.value = completedIds.value.filter(x => x !== item.id)
            return
          }
          if (!studentId.value) return
          const q =
            'mutation($studentId:String!,$lessonId:String!,$completed:Boolean){ updateProgress(studentId:$studentId,lessonId:$lessonId,completed:$completed){ id status } }'
          try {
            await $fetch(`${baseUrl}/api/students-internal/graphql`, {
              method: 'POST',
              body: {
                query: q,
                variables: {
                  studentId: studentId.value,
                  lessonId: item.id,
                  completed: !!val
                }
              }
            })
            if (val)
              completedIds.value = Array.from(new Set([...completedIds.value, item.id]))
            else completedIds.value = completedIds.value.filter(x => x !== item.id)
          } catch (e) {
            console.warn('[updateProgress] failed, falling back to local state', e)
            if (val)
              completedIds.value = Array.from(new Set([...completedIds.value, item.id]))
            else completedIds.value = completedIds.value.filter(x => x !== item.id)
          }
        }
      })
    ])
  ])
}

async function loadModule() {
  if (MOCK_MODE) {
    mod.value = { id: String(route.params.id), title: 'Mocked Module', courseId: 'COURSE-123' }
    return
  }
  const q = 'query($id:String!){ moduleById(id:$id){ id title courseId } }'
  const r = (await $fetch(`${baseUrl}/api/teach-internal/graphql`, {
    method: 'POST',
    body: { query: q, variables: { id: String(route.params.id) } }
  })) as any
  mod.value = r.data?.moduleById ?? null
}

async function loadLessons() {
  if (!mod.value) return
  if (MOCK_MODE) {
    lessons.value = Array.from({ length: 6 }).map((_, i) => ({
      id: `L${i + 1}`,
      title: `Lesson ${i + 1}`
    }))
    completedIds.value = ['L1', 'L3']
    return
  }
  const q = 'query($moduleId:String!){ lessonsByModule(moduleId:$moduleId){ id title } }'
  const r = (await $fetch(`${baseUrl}/api/teach-internal/graphql`, {
    method: 'POST',
    body: { query: q, variables: { moduleId: mod.value.id } }
  })) as any
  lessons.value = r.data?.lessonsByModule ?? []
}

async function loadAssignments() {
  assignments.value = []
  if (!classroomId.value) {
    // Provide a default timeline even without a classroom
    timeline.value = [
      { title: 'Orientation', when: '2025-09-15' },
      { title: 'Assignment 1', when: '2025-09-22' }
    ]
    return
  }
  if (MOCK_MODE) {
    assignments.value = [
      { id: 'A1', title: 'Assignment 1', dueDate: '2025-10-01' },
      { id: 'A2', title: 'Assignment 2', dueDate: '2025-10-15' }
    ]
    timeline.value = assignments.value.map((a: any) => ({
      title: a.title,
      when: a.dueDate || '-'
    }))
    return
  }
  const q =
    'query($classroomId:String!){ assignmentsByClassroom(classroomId:$classroomId){ id title dueDate } }'
  const r = (await $fetch(`${baseUrl}/api/teach-internal/graphql`, {
    method: 'POST',
    body: { query: q, variables: { classroomId: classroomId.value } }
  })) as any
  assignments.value = r.data?.assignmentsByClassroom ?? []
  timeline.value = assignments.value.map((a: any) => ({
    title: a.title,
    when: a.dueDate || '-'
  }))
}

async function init() {
  await loadModule()
  await loadLessons()
  await sleep(50)
  await loadAssignments()
}
onMounted(init)
</script>

<style scoped>
/* tiny helper so the template-runner always has a grid available */
.grid { display: grid; }
</style>
