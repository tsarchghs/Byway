<template>

<!-- increment-3: analytics + controls (non-breaking) -->
<a-card class="uni-analytics-bar" :bordered="false" style="margin: 12px 0">
  <div class="flex flex-wrap items-center gap-3 justify-between">
    <div class="flex flex-wrap items-center gap-4">
      <a-statistic title="Students" :value="(roster && roster.length) || 0" />
      <a-statistic title="Avg Progress" :precision="0" :value="avgProgress" suffix="%" />
      <a-statistic title="At Risk" :value="riskSummaryTotal" />
      <a-space>
        <a-tag v-for="chip in riskSummary" :key="chip.label" :color="chip.color">{{ chip.label }}: {{ chip.count }}</a-tag>
      </a-space>
    </div>
    <div class="flex items-center gap-2">
      <a-auto-complete
        style="width: 220px"
        :options="searchOptions"
        v-model:value="searchValue"
        placeholder="Find student..."
        @select="openStudentByName"
      />
      <a-popover placement="bottomRight" title="Show / hide columns">
        <template #content>
          <div style="max-width:260px">
            <a-checkbox-group v-model:value="visibleColumnKeys">
              <div v-for="col in allColumns" :key="col.key" class="py-1">
                <a-checkbox :value="col.key">{{ col.title }}</a-checkbox>
              </div>
            </a-checkbox-group>
            <a-divider/>
            <a-space>
              <a-button size="small" @click="selectAllCols">Select all</a-button>
              <a-button size="small" @click="selectDefaultCols">Defaults</a-button>
            </a-space>
          </div>
        </template>
        <a-button>Columns</a-button>
      </a-popover>
      <a-switch v-model:checked="dense" checked-children="Dense" un-checked-children="Comfort"/>
      <a-button @click="refreshRoster" :loading="refreshing">Refresh</a-button>
    </div>
  </div>
</a-card>

<a-drawer v-model:open="drawerOpen" width="460" :title="selectedStudent?.name || 'Student'">
  <template #extra>
    <a-tag v-if="selectedStudent?.risk" :color="selectedStudent.risk === 'high' ? 'error' : (selectedStudent.risk === 'medium' ? 'warning' : 'success')">
      {{ (selectedStudent?.risk || 'ok').toUpperCase() }}
    </a-tag>
  </template>

  <a-descriptions size="small" layout="vertical" :column="1" v-if="selectedStudent">
    <a-descriptions-item label="Email">{{ selectedStudent.email || '–' }}</a-descriptions-item>
    <a-descriptions-item label="Cohort">{{ selectedStudent.cohort || '–' }}</a-descriptions-item>
    <a-descriptions-item label="Progress">{{ (selectedStudent.progress ?? 0) + '%' }}</a-descriptions-item>
    <a-descriptions-item label="Last Active">{{ selectedStudent.lastActive || '–' }}</a-descriptions-item>
  </a-descriptions>

  <a-empty v-else description="Pick a student from search to preview." />

  <a-divider />
  <a-typography-title :level="5">Recent activity</a-typography-title>
  <a-timeline>
    <a-timeline-item v-for="(evt, i) in (selectedStudent?.activities || [])" :key="i">
      <strong>{{ evt.title || evt.kind || 'Activity' }}</strong>
      <div style="opacity:.75">{{ evt.date || evt.when || '' }}</div>
    </a-timeline-item>
    <a-timeline-item v-if="!(selectedStudent?.activities?.length)">No recent activity</a-timeline-item>
  </a-timeline>
</a-drawer>
<!-- /increment-3 -->

</template>
<script setup lang="ts">
import { ref, reactive } from 'vue'

const tab = ref('overview')
const q = ref('')
const density = ref('Comfort')
const loading = ref(false)

const kpis = reactive([
  { key:'lessons', label:'Lessons', value: 12, hint:'Videos & readings' },
  { key:'assign', label:'Assignments', value: 5, hint:'Due this term' },
  { key:'cohorts', label:'Cohorts', value: 3, hint:'Active' },
  { key:'progress', label:'Avg Progress', value: '42%', hint:'Across roster' },
])

const timeline = reactive([
  { title:'Kickoff lecture', type:'Lecture', when:'Mon 09:00' },
  { title:'Lab 1 published', type:'Lab', when:'Wed 09:00' },
  { title:'Quiz 1 opens', type:'Quiz', when:'Fri 12:00' },
])

const cohorts = reactive([
  { id:'c1', name:'Fall 2025 A', start:'2025-09-15', end:'2025-12-15', students: 35 },
  { id:'c2', name:'Fall 2025 B', start:'2025-09-16', end:'2025-12-16', students: 28 },
])
const cohortCols = [
  { title:'Name', dataIndex:'name', key:'name' },
  { title:'Start', dataIndex:'start', key:'start' },
  { title:'End', dataIndex:'end', key:'end' },
  { title:'Students', dataIndex:'students', key:'students', align:'right' },
]
const showCreateCohort = ref(false)
const cohortDraft = reactive({ name:'', start:null as any, end:null as any })
function createCohort(){ showCreateCohort.value=false }

function exportCohorts(){ /* placeholder */ }

const inviteEmail = ref('')
const roster = reactive([
  { id:'s1', name:'A. Student', email:'a@student.edu', role:'Student' },
  { id:'s2', name:'B. Student', email:'b@student.edu', role:'Student' },
])
const rosterCols = [
  { title:'Name', dataIndex:'name', key:'name' },
  { title:'Email', dataIndex:'email', key:'email' },
  { title:'Role', dataIndex:'role', key:'role' },
]
function invite(){ /* placeholder */ }

const assignmentFilter = ref('All')
const assignments = reactive([
  { id:'a1', title:'Homework 1', due:'2025-11-18', status:'Pending' },
  { id:'a2', title:'Project Proposal', due:'2025-11-25', status:'Submitted' },
])
const assignmentCols = [
  { title:'Title', dataIndex:'title', key:'title' },
  { title:'Due', dataIndex:'due', key:'due' },
  { title:'Status', dataIndex:'status', key:'status' },
]
const showCreateAssignment = ref(false)
const assignmentDraft = reactive({ title:'', due:null as any, points:100 })
function createAssignment(){ showCreateAssignment.value=false }

const gradeCols = [
  { title:'Student', dataIndex:'student', key:'student' },
  { title:'Item', dataIndex:'item', key:'item' },
  { title:'Score', dataIndex:'score', key:'score', align:'right' },
]
const grades = reactive([
  { id:'g1', student:'A. Student', item:'Quiz 1', score:8 },
  { id:'g2', student:'B. Student', item:'Homework 1', score:12 },
])

const discussions = reactive([
  { id:'d1', title:'Clarification on Lab 1', author:'A. Student', body:'How do we set the seed?' },
])

const draft = reactive({ title:'', body:'' })
function postDiscussion(){ /* placeholder */ }

const resources = reactive([
  { id:'r1', name:'Syllabus.pdf', type:'PDF' },
  { id:'r2', name:'Slides-Week1.pptx', type:'Slides' },
])
const resourceCols = [
  { title:'Name', dataIndex:'name', key:'name' },
  { title:'Type', dataIndex:'type', key:'type' },
]

function refresh(){ loading.value = true; setTimeout(()=> loading.value=false, 500) }
// ——— Surgical utilities increment ———
import { onMounted, onBeforeUnmount, watch, computed, nextTick } from 'vue'

const dateRange = ref<any | null>(null)
const exporting = ref(false)

// Persist a few UI bits
const LS_KEY = 'byway.uni.panel.v1'
onMounted(() => {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (raw) {
      const saved = JSON.parse(raw)
      if (saved.tab) tab.value = saved.tab
      if (typeof saved.q === 'string') q.value = saved.q
      if (typeof saved.density === 'string') density.value = saved.density
      if (saved.dateRange) dateRange.value = saved.dateRange
    }
  } catch {}
  // keyboard shortcuts
  window.addEventListener('keydown', handleKeys)
})

onBeforeUnmount(() => window.removeEventListener('keydown', handleKeys))

watch([tab, q, density, dateRange], () => {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify({
      tab: tab.value,
      q: q.value,
      density: density.value,
      dateRange: dateRange.value
    }))
  } catch {}
})

// Quick keyboard shortcuts
function handleKeys(e: KeyboardEvent){
  if (e.key === '/') {
    e.preventDefault()
    // try to focus search input
    const el = document.querySelector('.panel-toolbar input')
    if (el instanceof HTMLInputElement) el.focus()
  } else if (e.key.toLowerCase() === 'g') {
    tab.value = 'grading'
  } else if (e.key.toLowerCase() === 'c') {
    tab.value = 'cohorts'
  } else if (e.key.toLowerCase() === 'o') {
    tab.value = 'overview'
  } else if (e.key.toLowerCase() === 'e') {
    exportActive()
  }
}

// CSV export
function toCSV(rows: any[], cols?: string[]): string {
  if (!rows?.length) return ''
  const keys = cols?.length ? cols : Object.keys(rows[0])
  const escape = (v:any) => {
    const s = v == null ? '' : String(v)
    return /[",\n]/.test(s) ? '"' + s.replace(/"/g,'""') + '"' : s
  }
  const header = keys.map(escape).join(',')
  const body = rows.map(r => keys.map(k => escape(r[k])).join(',')).join('\n')
  return header + '\n' + body
}

function download(filename: string, text: string){
  const blob = new Blob([text], {type: 'text/csv;charset=utf-8;'})
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// Heuristic dataset exporter (doesn't change existing data flow)
function exportActive(){
  try {
    exporting.value = true
    // Try to infer data by tab id
    let rows: any[] = []
    let name = 'export'
    const t = String(tab.value || 'overview').toLowerCase()
    if (t.includes('cohort')) {
      // attempt to locate a cohorts array on the instance
      // @ts-ignore
      rows = (typeof cohorts !== 'undefined' && Array.isArray(cohorts)) ? cohorts : []
      name = 'cohorts'
    } else if (t.includes('assign') || t.includes('grade')) {
      // @ts-ignore
      rows = (typeof assignments !== 'undefined' && Array.isArray(assignments)) ? assignments : []
      if (!rows.length) {
        // @ts-ignore
        rows = (typeof roster !== 'undefined' && Array.isArray(roster)) ? roster : []
      }
      name = 'grading'
    } else {
      // fallback to timeline or kpis if available
      // @ts-ignore
      rows = (typeof timeline !== 'undefined' && Array.isArray(timeline)) ? timeline : []
      if (!rows.length) {
        // @ts-ignore
        rows = (typeof kpis !== 'undefined' && Array.isArray(kpis)) ? kpis : []
      }
      name = 'overview'
    }
    if (!rows.length) {
      // graceful no-op
      exporting.value = false
      return
    }
    const csv = toCSV(rows)
    download(`module-${name}.csv`, csv)
  } finally {
    exporting.value = false
  }
}
\n
// --- increment: bulk selection, export, messaging (surgical) ---
import { ref, computed } from 'vue'
import { message as $message } from 'ant-design-vue'

const selectedRowKeys = ref<string[]>([])
const onSelectChange = (keys: string[]) => { selectedRowKeys.value = keys }

const rowKeyFn = (r: any) => r?.id || r?.userId || r?.email || r?.username || r?.name

const selectedRows = computed(() => {
  const set = new Set(selectedRowKeys.value)
  return Array.isArray(roster) ? roster.filter((r:any) => set.has(rowKeyFn(r))) : []
})

const selectedEmails = computed(() => selectedRows.value
  .map((r:any) => r.email || r.contactEmail)
  .filter(Boolean))

const cohortAssign = ref<string | null>(null)
const composeOpen = ref(false)
const composeSubject = ref('')
const composeBody = ref('')

function copySelectedEmails(){
  if (!selectedEmails.value.length) return
  navigator.clipboard?.writeText(selectedEmails.value.join('; '))
  $message.success('Emails copied')
}

function exportSelectedCSV(){
  const rows = selectedRows.value
  if (!rows.length) return
  const keys = Object.keys(rows[0] || {})
  const csv = [keys.join(','), ...rows.map(r => keys.map(k => JSON.stringify(r[k] ?? '')).join(','))].join('\n')
  const blob = new Blob([csv], {type:'text/csv;charset=utf-8;'})
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = 'roster-selected.csv'; a.click()
  URL.revokeObjectURL(url)
}

async function assignCohortToSelected(){
  if (!cohortAssign.value || !selectedRows.value.length) return
  try {
    // SDK integration if available
    const sdk:any = (globalThis as any).$bywaySDK || null
    if (sdk?.classrooms?.assignToCohort){
      await sdk.classrooms.assignToCohort({ cohortId: cohortAssign.value, studentIds: selectedRows.value.map((r:any)=>rowKeyFn(r)) })
      $message.success('Assigned to cohort')
    } else {
      console.debug('SDK assignToCohort not found, noop')
      $message.info('Simulated cohort assignment (SDK not wired).')
    }
  } catch (e){
    console.error(e); $message.error('Failed to assign cohort')
  }
}

async function sendMessageToSelected(){
  try {
    const payload = {
      to: selectedEmails.value,
      subject: composeSubject.value,
      body: composeBody.value
    }
    const sdk:any = (globalThis as any).$bywaySDK || null
    if (sdk?.messaging?.bulkSend){
      await sdk.messaging.bulkSend(payload)
      $message.success('Message queued')
    } else {
      console.debug('SDK messaging not found, falling back to console', payload)
      $message.success('Simulated send (SDK not wired).')
    }
    composeOpen.value = false
    composeSubject.value = ''
    composeBody.value = ''
  } catch (e){
    console.error(e); $message.error('Failed to send message')
  }
}
// --- end increment ---




// --- increment: saved views ---
const viewsKey = 'byway.univ.roster.views'
const savedViews = ref<{name:string, search:string, filters:string[]}[]>([])

function loadSavedViews(){
  try { savedViews.value = JSON.parse(localStorage.getItem(viewsKey) || '[]') } catch {_=>{}}
}
function persistViews(){ localStorage.setItem(viewsKey, JSON.stringify(savedViews.value)) }
function saveCurrentView(){
  const name = prompt('Name this view')
  if (!name) return
  const filters = Array.from(activeFilters.value)
  const v = { name, search: searchText.value, filters }
  const existing = savedViews.value.filter(x=>x.name!==name)
  savedViews.value = [...existing, v]
  persistViews(); $message.success('View saved')
}
function applySavedView(v:any){
  searchText.value = v.search || ''
  activeFilters.value = new Set(v.filters || [])
  $message.success(`Applied view: ${v.name}`)
}
function clearSavedViews(){
  savedViews.value = []; persistViews(); $message.success('Cleared views')
}
loadSavedViews()
// --- end increment views ---
// --- increment: roster smart filters & search ---
import { watch } from 'vue'
const searchText = ref('')
const activeFilters = ref<Set<string>>(new Set())

function toggleFilter(key: string){
  const set = new Set(activeFilters.value)
  if (set.has(key)) set.delete(key); else set.add(key)
  activeFilters.value = set
}

const filteredRoster = computed(() => {
  let arr:any[] = Array.isArray(roster) ? roster.slice() : []
  if (searchText.value){
    const q = searchText.value.toLowerCase()
    arr = arr.filter(r => [r.name, r.email, r.username, r.studentId].some(v => String(v||'').toLowerCase().includes(q)))
  }
  if (activeFilters.value.has('atRisk')){
    arr = arr.filter(r => (r.grade ?? r.score ?? 0) <= 60 || (r.missingSubmissions ?? 0) > 0)
  }
  if (activeFilters.value.has('inactive14')){
    const now = Date.now()
    arr = arr.filter(r => {
      const t = new Date(r.lastActive || r.lastSeen || r.updatedAt || 0).getTime()
      return !t || (now - t) > 14*24*3600*1000
    })
  }
  if (activeFilters.value.has('top')){
    arr = arr.filter(r => (r.grade ?? r.score ?? 0) >= 85)
  }
  return arr
})
// --- end increment ---


// increment-3: reactive analytics + controls for university panel
import { computed, watch, onMounted } from 'vue'

const dense = ref(false)
const refreshing = ref(false)
const drawerOpen = ref(false)
const selectedStudent = ref(null)
const searchValue = ref('')

const allColumns = computed(() => {
  const item = (roster && roster[0]) || null
  if (!item) return []
  return Object.keys(item).filter(k => !['id','activities'].includes(k)).map(k => ({
    key: k,
    title: k.replace(/([A-Z])/g,' $1').replace(/^./, s => s.toUpperCase())
  }))
})

const storageKeyCols = 'byway:uni:columns'
const visibleColumnKeys = ref([])

onMounted(() => {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKeyCols) || '[]')
    if (Array.isArray(saved) && saved.length) visibleColumnKeys.value = saved
  } catch {}
})

watch(visibleColumnKeys, v => {
  try { localStorage.setItem(storageKeyCols, JSON.stringify(v)) } catch {}
}, { deep: true })

const selectAllCols = () => visibleColumnKeys.value = allColumns.value.map(c => c.key)
const selectDefaultCols = () => {
  const defaults = ['name','email','cohort','progress','lastActive'].filter(k => allColumns.value.some(c => c.key === k))
  visibleColumnKeys.value = defaults
}

const searchOptions = computed(() => (roster || []).map(s => ({ value: s.name || s.email, id: s.id })))
const openStudentByName = (val, option) => {
  const id = option?.id
  const s = (roster || []).find(r => (r.name === val || r.email === val) || (id && r.id === id))
  if (s) {
    selectedStudent.value = s
    drawerOpen.value = true
  }
}

const refreshRoster = async () => {
  if (typeof fetch !== 'function') return
  try {
    refreshing.value = true
    // Try a best-effort refresh endpoint if it exists; falls back silently.
    const res = await fetch('/api/students-internal/university/roster', { method: 'POST' }).catch(()=>null)
    if (res && res.ok) {
      // if response returns JSON roster, merge it
      const data = await res.json().catch(()=>null)
      if (data && Array.isArray(data.roster)) {
        roster.splice(0, roster.length, ...data.roster)
      }
    }
  } finally {
    refreshing.value = false
  }
}

const avgProgress = computed(() => {
  const arr = (roster || []).map(r => Number(r.progress ?? 0)).filter(n => !Number.isNaN(n))
  if (!arr.length) return 0
  return Math.round(arr.reduce((a,b)=>a+b,0) / arr.length)
})

const riskSummary = computed(() => {
  const arr = (roster || [])
  const counters = { low:0, medium:0, high:0 }
  for (const r of arr) {
    const tag = (r.risk || 'low').toLowerCase()
    if (counters[tag] != null) counters[tag]++
  }
  return [
    { label: 'Low', color: 'success', count: counters.low },
    { label: 'Medium', color: 'warning', count: counters.medium },
    { label: 'High', color: 'error', count: counters.high },
  ]
})

const riskSummaryTotal = computed(() => riskSummary.value.reduce((a,b)=>a+b.count,0))

</script>