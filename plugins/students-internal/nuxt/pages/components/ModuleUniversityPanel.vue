<template>
  <div class="byway-module-university space-y-6">
    <!-- Header -->
    <a-card :bordered="false">
      <template #title>
        <div class="flex items-center justify-between gap-3 flex-wrap">
          <div class="flex items-center gap-3">
            <a-avatar :size="48">{{ initials }}</a-avatar>
            <div>
              <div class="text-xl font-semibold">{{ moduleData?.title || 'Module' }}</div>
              <div class="text-xs opacity-70">
                {{ moduleData?.course?.title || 'Course' }} ·
                {{ moduleData?.classroom?.name || 'Classroom' }} ·
                Week {{ weekOfTerm }}
              </div>
            </div>
          </div>
          <div class="flex gap-2">
            <a-select v-model:value="activeView" style="width: 160px">
              <a-select-option value="overview">Overview</a-select-option>
              <a-select-option value="schedule">Schedule</a-select-option>
              <a-select-option value="assignments">Assignments</a-select-option>
              <a-select-option value="discussions">Discussions</a-select-option>
              <a-select-option value="resources">Resources</a-select-option>
              <a-select-option value="grades">Grades</a-select-option>
            </a-select>
            <a-button @click="refresh" :loading="loading">Refresh</a-button>
          </div>
        </div>
      </template>
      <template #extra>
        <div class="flex gap-2">
          <a-switch v-model:checked="compact" /> <span class="ml-2">Compact</span>
          <a-button type="primary" @click="openChecklist = true">Checklist</a-button>
        </div>
      </template>

      <!-- KPI strip -->
      <div class="grid gap-3" :class="gridCols">
        <a-card size="small"><div class="text-xs opacity-60">Lessons</div><div class="text-2xl">{{ kpi.lessons }}</div></a-card>
        <a-card size="small"><div class="text-xs opacity-60">Assignments</div><div class="text-2xl">{{ kpi.assignments }}</div></a-card>
        <a-card size="small"><div class="text-xs opacity-60">Videos (mins)</div><div class="text-2xl">{{ kpi.videoMinutes }}</div></a-card>
        <a-card size="small"><div class="text-xs opacity-60">Progress</div><div class="text-2xl">{{ kpi.progress }}%</div></a-card>
      </div>
    </a-card>

    <!-- Views -->
    <component :is="currentView" />

    <!-- Checklist Drawer -->
    <a-drawer v-model:open="openChecklist" title="Module Checklist" placement="right" width="420">
      <a-list :data-source="checklist" bordered>
        <template #renderItem="{ item, index }">
          <a-list-item>
            <a-checkbox :checked="item.done" @change="toggleChecklist(index)">{{ item.text }}</a-checkbox>
          </a-list-item>
        </template>
      </a-list>
      <div class="mt-4 flex gap-2">
        <a-input v-model:value="newChecklistText" placeholder="Add item..." @pressEnter="addChecklist" />
        <a-button type="primary" @click="addChecklist">Add</a-button>
      </div>
    </a-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from '#imports'
// Apollo is assumed to be installed; queries are guarded so page won't break if not wired yet.
let apolloAvailable = false
try { /* @ts-ignore */ apolloAvailable = !!useAsyncQuery } catch {}

const route = useRoute()
const moduleId = computed(() => route.params.id as string)

const activeView = ref<'overview'|'schedule'|'assignments'|'discussions'|'resources'|'grades'>('overview')
const compact = ref(false)
const loading = ref(false)
const openChecklist = ref(false)
const newChecklistText = ref('')

const kpi = ref({ lessons: 0, assignments: 0, videoMinutes: 0, progress: 0 })
const moduleData = ref<any>(null)

const initials = computed(() => (moduleData.value?.title || 'M').split(' ').map((w:string)=>w[0]).slice(0,2).join('').toUpperCase())

const checklist = ref<{text:string, done:boolean}[]>([
  { text: 'Read module overview', done: false },
  { text: 'Watch intro video', done: false },
  { text: 'Complete quiz', done: false },
])

const gridCols = computed(() => compact.value ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4')

function toggleChecklist(i:number){ checklist.value[i].done = !checklist.value[i].done }
function addChecklist(){ if(!newChecklistText.value.trim()) return; checklist.value.push({text:newChecklistText.value.trim(), done:false}); newChecklistText.value='' }

function refresh(){ loadData() }

const weekOfTerm = computed(() => {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 1)
  const diff = Math.floor((now.getTime()-start.getTime())/(7*24*3600*1000))
  return diff
})

// Dummy composables to avoid hard dependency during incremental adoption.
async function loadData(){
  loading.value = true
  try{
    // In a real integration, call GraphQL via Apollo here.
    // We'll leave placeholders and safe defaults to avoid breaking the page.
    moduleData.value = moduleData.value || { title: 'Module '+moduleId.value, course: { title: 'Course' }, classroom: { name: 'Cohort A' } }
    kpi.value = { lessons: 8, assignments: 2, videoMinutes: 75, progress: 42 }
  }finally{
    loading.value = false
  }
}
onMounted(loadData)

/** Sub-views as inline components (keeps changes local to this panel) */
const Overview = {
  name: 'OverviewView',
  setup(){
    const outline = ref([
      { type: 'video', title: 'Intro (6m)' },
      { type: 'reading', title: 'Syllabus & Expectations' },
      { type: 'lab', title: 'Lab 1: Setup' },
      { type: 'quiz', title: 'Checkpoint 1' },
    ])
    return { outline }
  },
  template: `
  <div class="space-y-4">
    <a-card title="Overview">
      <p class="opacity-80">This module focuses on foundational concepts. Use the checklist to stay on track.</p>
    </a-card>
    <a-card title="Outline">
      <a-timeline>
        <a-timeline-item v-for="(item, idx) in outline" :key="idx">
          <a-tag>{{ item.type }}</a-tag> {{ item.title }}
        </a-timeline-item>
      </a-timeline>
    </a-card>
  </div>`
}

const Schedule = {
  name: 'ScheduleView',
  setup(){
    const events = ref([
      { when: 'Mon 10:00', what: 'Live Lecture', where: 'Room 201' },
      { when: 'Wed 12:00', what: 'Lab Session', where: 'Lab A' },
      { when: 'Fri 17:00', what: 'Assignment 1 Due', where: 'LMS' },
    ])
    return { events }
  },
  template: `
  <a-card title="Weekly Schedule">
    <a-table :data-source="events" :pagination="false" :columns="[
        { title:'When', dataIndex:'when' },
        { title:'What', dataIndex:'what' },
        { title:'Where', dataIndex:'where' }
      ]" row-key="when" />
  </a-card>`
}

const Assignments = {
  name: 'AssignmentsView',
  setup(){
    const rows = ref([
      { key: 'A1', title:'Problem Set 1', due:'2025-11-14', status:'Due', points:100 },
      { key: 'A2', title:'Lab Report', due:'2025-11-21', status:'Draft', points:50 },
    ])
    const selected = ref<any[]>([])
    function onSelectChange(keys:any[], recs:any[]){ selected.value = recs }
    return { rows, selected, onSelectChange }
  },
  template: `
  <a-card title="Assignments">
    <a-table
      :data-source="rows"
      row-key="key"
      :row-selection="{ onChange: onSelectChange }"
      :columns="[
        { title:'Title', dataIndex:'title' },
        { title:'Due', dataIndex:'due' },
        { title:'Status', dataIndex:'status' },
        { title:'Points', dataIndex:'points' }
      ]"/>
    <div class="mt-3 flex gap-2">
      <a-button :disabled="!selected.length">Mark Complete</a-button>
      <a-button :disabled="!selected.length">Download</a-button>
    </div>
  </a-card>`
}

const Discussions = {
  name: 'DiscussionsView',
  setup(){
    const posts = ref([
      { id:1, author:'Alex', text:'What is the difference between X and Y?', replies:2 },
      { id:2, author:'Mira', text:'Share your tips for the lab setup.', replies:5 },
    ])
    const newPost = ref('')
    function add(){ if(!newPost.value.trim()) return; posts.value.unshift({ id:Date.now(), author:'You', text:newPost.value.trim(), replies:0 }); newPost.value='' }
    return { posts, newPost, add }
  },
  template: `
  <a-card title="Discussions">
    <a-list :data-source="posts" item-layout="horizontal" bordered>
      <template #renderItem="{ item }">
        <a-list-item>
          <a-list-item-meta :title="item.author" :description="item.text" />
          <template #actions>
            <a-badge :count="item.replies" /><span class="ml-2">replies</span>
          </template>
        </a-list-item>
      </template>
    </a-list>
    <div class="mt-3 flex gap-2">
      <a-input v-model:value="newPost" placeholder="Start a thread…" @pressEnter="add" />
      <a-button type="primary" @click="add">Post</a-button>
    </div>
  </a-card>`
}

const Resources = {
  name: 'ResourcesView',
  setup(){
    const files = ref([
      { name:'Slides.pdf', size:'2.1 MB' },
      { name:'Reading-1.md', size:'34 KB' },
      { name:'Dataset.csv', size:'1.2 MB' },
    ])
    return { files }
  },
  template: `
  <a-card title="Resources">
    <a-list :data-source="files" bordered>
      <template #renderItem="{ item }">
        <a-list-item>
          <a-space>
            <a-tag>File</a-tag>
            <strong>{{ item.name }}</strong>
            <span class="opacity-60">({{ item.size }})</span>
            <a-button type="link">Preview</a-button>
            <a-button type="link">Download</a-button>
          </a-space>
        </a-list-item>
      </template>
    </a-list>
  </a-card>`
}

const Grades = {
  name: 'GradesView',
  setup(){
    const items = ref([
      { item:'Problem Set 1', score:88, weight:0.2 },
      { item:'Lab Report', score:92, weight:0.1 },
      { item:'Quiz 1', score:76, weight:0.1 },
    ])
    const total = computed(()=> Math.round(items.value.reduce((s,i)=> s + i.score*i.weight, 0)) )
    return { items, total }
  },
  template: `
  <a-card title="Grades">
    <a-table :data-source="items" :pagination="false" row-key="item"
      :columns="[
        { title:'Item', dataIndex:'item' },
        { title:'Score', dataIndex:'score' },
        { title:'Weight', dataIndex:'weight' }
      ]" />
    <div class="mt-3 text-right text-lg font-semibold">Weighted Total: {{ total }}%</div>
  </a-card>`
}

const currentView = computed(() => ({
  overview: Overview,
  schedule: Schedule,
  assignments: Assignments,
  discussions: Discussions,
  resources: Resources,
  grades: Grades
}[activeView.value]))
</script>

<style scoped>
.byway-module-university { padding: 8px; }
.grid { display: grid; }
.grid-cols-1 { grid-template-columns: repeat(1,minmax(0,1fr)); }
.grid-cols-2 { grid-template-columns: repeat(2,minmax(0,1fr)); }
.grid-cols-4 { grid-template-columns: repeat(4,minmax(0,1fr)); }
.space-y-6 > * + * { margin-top: 1.5rem; }
.mt-3 { margin-top: .75rem; }
.flex { display:flex; }
.items-center { align-items:center; }
.justify-between { justify-content: space-between; }
.gap-2 { gap:.5rem; }
.gap-3 { gap:.75rem; }
.flex-wrap { flex-wrap:wrap; }
.text-xl { font-size:1.25rem; }
.text-2xl { font-size:1.5rem; }
.font-semibold { font-weight:600; }
.opacity-70 { opacity:.7; }
.opacity-60 { opacity:.6; }
.text-right { text-align:right; }
.text-lg { font-size:1.125rem; }
.ml-2 { margin-left:.5rem; }
</style>
