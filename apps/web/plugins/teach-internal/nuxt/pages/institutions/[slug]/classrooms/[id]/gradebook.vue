<template>
  <a-layout class="p-6">
    <a-card :title="`Grade · ${route.params.id}`" :bordered="false">
      <!-- Toolbar -->
      <div class="mb-3 flex gap-2 items-center flex-wrap">
        <a-space wrap>
          <a-button @click="openRubric" type="default">
            <template #icon><SettingOutlined /></template>
            Rubric
          </a-button>
          <a-switch v-model:checked="autoSave" /> <span class="muted">Auto-save on change</span>
          <a-divider type="vertical" />
          <a-button @click="exportJSON">
            <template #icon><DownloadOutlined /></template>
            Export JSON
          </a-button>
          <a-upload :before-upload="onImportJSON" accept=".json">
            <a-button>
              <template #icon><UploadOutlined /></template>
              Import JSON
            </a-button>
          </a-upload>
          <a-button @click="exportCSV">
            <template #icon><FileExcelOutlined /></template>
            Export CSV
          </a-button>
          <a-divider type="vertical" />
          <a-button danger @click="resetMocks">
            <template #icon><DeleteOutlined /></template>
            Reset mocks
          </a-button>
        </a-space>
        <a-space class="ml-auto" wrap>
          <a-badge :status="usingMocks ? 'warning' : 'success'" :text="usingMocks ? 'Mock mode' : 'Live (mocked)'" />
        </a-space>
      </div>

      <!-- Table -->
      <a-table
        :data-source="rows"
        :columns="cols"
        row-key="id"
        :pagination="{ pageSize: 8 }"
      />
    </a-card>
  </a-layout>

  <!-- Rubric drawer -->
  <a-drawer v-model:open="rubricOpen" title="Rubric" placement="right" width="420">
    <a-alert
      type="info"
      message="Provide a JSON rubric, e.g., [{label:'Code',weight:0.6},{label:'Report',weight:0.4}]"
      show-icon
      class="mb-2"
    />
    <a-textarea v-model:value="rubricJson" :rows="10" />
    <div class="mt-2 flex items-center gap-2">
      <a-button type="primary" @click="saveRubric">Save</a-button>
      <a-button @click="normalizeWeights">Normalize weights</a-button>
      <a-tag v-if="Math.abs(rubricWeightSum - 1) < 1e-6" color="green">Sum: 1.00</a-tag>
      <a-tag v-else color="orange">Sum: {{ rubricWeightSum.toFixed(2) }}</a-tag>
    </div>
    <a-divider />
    <a-list
      size="small"
      :data-source="rubric"
      :renderItem="(r:any) => h('div', {}, `${r.label} · ${r.weight}`)"
    />
  </a-drawer>

  <!-- Comments drawer -->
  <a-drawer v-model:open="commentsOpen" title="Comments" placement="right" width="420">
    <a-list
      :data-source="comments"
      :renderItem="(c:any)=> h('div', { class:'comment-item' }, `${c.at} – ${c.authorId || 'anon'}: ${c.text}`)"
      class="mb-2"
    />
    <a-textarea v-model:value="newComment" :rows="3" class="mt-2" placeholder="Add a comment..." />
    <div class="mt-2"><a-button type="primary" @click="postComment">Post</a-button></div>
  </a-drawer>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch, h } from 'vue'
import { useRoute, useRuntimeConfig, definePageMeta } from '#imports'
import { message } from 'ant-design-vue'
import {
  SettingOutlined, UploadOutlined, DownloadOutlined, FileExcelOutlined, DeleteOutlined
} from '@ant-design/icons-vue'

/** ---------- Types ---------- */
type RubricItem = { label: string; weight: number }
type CommentItem = { id: string; submissionId: string; text: string; authorId?: string; at: string }
type Criteria = Record<string, number> // label -> 0..100
type Row = {
  id: string
  attempt: number
  studentId: string
  fileUrl: string
  grade?: number
  feedback?: string
  criteria: Criteria
  // staging fields for editing (not persisted unless saved/auto-saved)
  _grade?: number
  _feedback?: string
}

/** ---------- Routing + config (kept for signature parity; unused in mock) ---------- */
const route = useRoute()
const config = useRuntimeConfig()
const baseUrl = config.public?.apiBase || 'http://localhost:4000' // not used (mock)

/** ---------- Mock state ---------- */
const usingMocks = ref(true)
const autoSave = ref(true)

// rows + rubric + comments storage keys
const LS_KEY = computed(() => `byway.gradebook.${String(route.params.id || 'assignment')}`)
const rows = ref<Row[]>([])
const rubric = ref<RubricItem[]>([
  { label: 'Code', weight: 0.6 },
  { label: 'Report', weight: 0.4 },
])
const commentsBySubmission = reactive<Record<string, CommentItem[]>>({})

// UI drawers
const rubricOpen = ref(false)
const rubricJson = ref(JSON.stringify(rubric.value, null, 2))

const commentsOpen = ref(false)
const currentRowId = ref<string | null>(null)
const comments = computed(() => (currentRowId.value ? (commentsBySubmission[currentRowId.value] || []) : []))
const newComment = ref('')

// mock user
const userId = ref('teacher-1')

/** ---------- Columns (dynamic by rubric) ---------- */
const baseCols = [
  { title: 'Attempt', dataIndex: 'attempt', key: 'attempt', sorter: (a: Row, b: Row) => a.attempt - b.attempt },
  { title: 'Student', dataIndex: 'studentId', key: 'studentId' },
  {
    title: 'File',
    key: 'fileUrl',
    customRender: ({ record }: { record: Row }) =>
      h('a', { href: record.fileUrl, target: '_blank' }, 'Open')
  },
]

const rubricCols = computed(() => {
  return rubric.value.map(r => ({
    title: `${r.label} (${(r.weight * 100).toFixed(0)}%)`,
    key: `crit-${r.label}`,
    customRender: ({ record }: { record: Row }) => {
      const val = record.criteria[r.label] ?? 0
      return h('a-input-number', {
        min: 0, max: 100, value: val,
        'onUpdate:value': (v: number) => {
          record.criteria[r.label] = v
          if (autoSave.value) saveRow(record, { silent: true })
        }
      })
    }
  }))
})

const weightedCol = {
  title: 'Weighted',
  key: 'weighted',
  customRender: ({ record }: { record: Row }) => {
    const val = computeWeighted(record)
    return h('div', { class: 'flex items-center gap-2' }, [
      h('span', {}, `${val.toFixed(1)}`),
      h('a', { onClick: () => applyWeighted(record) }, 'Apply')
    ])
  }
}

const gradeCol = {
  title: 'Grade',
  key: 'grade',
  customRender: ({ record }: { record: Row }) => {
    return h('div', {}, [
      h('a-input-number', {
        value: record._grade ?? record.grade ?? 0,
        min: 0, max: 100,
        'onUpdate:value': (v: number) => { record._grade = v },
      }),
      h('a-button', { style: 'margin-left:8px', onClick: () => grade(record) }, 'Save')
    ])
  }
}

const feedbackCol = {
  title: 'Feedback',
  key: 'feedback',
  customRender: ({ record }: { record: Row }) => {
    return h('a-input', {
      value: record._feedback ?? record.feedback,
      style: 'min-width:220px',
      'onUpdate:value': (v: string) => { record._feedback = v },
      onBlur: () => { if (autoSave.value) grade(record, { silent: true }) },
    })
  }
}

const commentsCol = {
  title: 'Comments',
  key: 'comments',
  customRender: ({ record }: { record: Row }) =>
    h('a', { onClick: () => loadComments(record.id) }, 'Open')
}

const cols = computed(() => [
  ...baseCols,
  ...rubricCols.value,
  weightedCol,
  gradeCol,
  feedbackCol,
  commentsCol,
])

/** ---------- Core actions ---------- */
function computeWeighted(rec: Row): number {
  let total = 0
  for (const r of rubric.value) {
    const part = (rec.criteria[r.label] ?? 0) * r.weight
    total += part
  }
  return total
}

function applyWeighted(rec: Row) {
  rec._grade = Math.round(computeWeighted(rec) * 10) / 10
  if (autoSave.value) grade(rec, { silent: true })
}

function grade(rec: Row, opts?: { silent?: boolean }) {
  // apply staged fields
  if (typeof rec._grade === 'number') rec.grade = Number(rec._grade)
  if (typeof rec._feedback !== 'undefined') rec.feedback = rec._feedback
  // persist
  saveRow(rec)
  if (!opts?.silent) message.success('Saved')
}

/** ---------- Rubric ---------- */
function openRubric() {
  rubricJson.value = JSON.stringify(rubric.value, null, 2)
  rubricOpen.value = true
}
const rubricWeightSum = computed(() => rubric.value.reduce((s, r) => s + (Number(r.weight) || 0), 0))
function saveRubric() {
  try {
    const parsed = JSON.parse(rubricJson.value)
    if (!Array.isArray(parsed)) throw new Error('Rubric must be an array')
    parsed.forEach((it: any, i: number) => {
      if (!it || typeof it.label !== 'string') throw new Error(`Invalid label at #${i + 1}`)
      if (typeof it.weight !== 'number' || it.weight < 0) throw new Error(`Invalid weight at #${i + 1}`)
    })
    rubric.value = parsed
    // ensure each row has criteria entries
    for (const row of rows.value) {
      for (const r of rubric.value) {
        if (typeof row.criteria[r.label] !== 'number') row.criteria[r.label] = 0
      }
    }
    persistAll()
    rubricOpen.value = false
    message.success('Rubric saved')
  } catch (e: any) {
    message.error(e?.message || 'Invalid JSON')
  }
}
function normalizeWeights() {
  const sum = rubric.value.reduce((s, r) => s + (Number(r.weight) || 0), 0) || 1
  rubric.value = rubric.value.map(r => ({ ...r, weight: +(r.weight / sum).toFixed(4) }))
  rubricJson.value = JSON.stringify(rubric.value, null, 2)
}

/** ---------- Comments ---------- */
function loadComments(submissionId: string) {
  currentRowId.value = submissionId
  if (!commentsBySubmission[submissionId]) commentsBySubmission[submissionId] = []
  commentsOpen.value = true
}
function postComment() {
  const target = currentRowId.value
  const text = newComment.value.trim()
  if (!target || !text) return
  const item: CommentItem = {
    id: randId(),
    submissionId: target,
    text,
    authorId: userId.value,
    at: new Date().toLocaleString()
  }
  if (!commentsBySubmission[target]) commentsBySubmission[target] = []
  commentsBySubmission[target].unshift(item)
  newComment.value = ''
  persistAll()
}

/** ---------- Persistence ---------- */
function persistAll() {
  try {
    const payload = {
      rows: rows.value,
      rubric: rubric.value,
      comments: commentsBySubmission,
      autoSave: autoSave.value,
    }
    /* TODO: replace with mutation via gqlFetch */ console.debug("setItem replaced"); (LS_KEY.value, JSON.stringify(payload))
  } catch {}
}
function restoreAll() {
  try {
    const raw = /* TODO: replace with gqlFetch to proper query */ undefined && (LS_KEY.value)
    if (!raw) return false
    const data = JSON.parse(raw)
    if (Array.isArray(data.rows)) rows.value = data.rows
    if (Array.isArray(data.rubric)) rubric.value = data.rubric
    Object.assign(commentsBySubmission, data.comments || {})
    if (typeof data.autoSave === 'boolean') autoSave.value = data.autoSave
    return true
  } catch { return false }
}
function saveRow(rec: Row, opts?: { silent?: boolean }) {
  const idx = rows.value.findIndex(r => r.id === rec.id)
  if (idx >= 0) rows.value[idx] = { ...rec }
  persistAll()
  if (!opts?.silent) message.success('Saved')
}

/** ---------- Import / Export ---------- */
async function onImportJSON(file: File) {
  try {
    const text = await file.text()
    const data = JSON.parse(text)
    if (!Array.isArray(data.rows)) throw new Error('Missing rows[]')
    if (!Array.isArray(data.rubric)) throw new Error('Missing rubric[]')
    // basic validation
    data.rows.forEach((r: any, i: number) => {
      if (!r.id) throw new Error(`Row #${i + 1} missing id`)
      if (typeof r.criteria !== 'object') r.criteria = {}
    })
    rows.value = data.rows
    rubric.value = data.rubric
    for (const row of rows.value) {
      for (const r of rubric.value) {
        if (typeof row.criteria[r.label] !== 'number') row.criteria[r.label] = 0
      }
    }
    // comments optional
    for (const k of Object.keys(commentsBySubmission)) delete commentsBySubmission[k]
    Object.assign(commentsBySubmission, data.comments || {})
    autoSave.value = !!data.autoSave
    persistAll()
    message.success('Imported')
  } catch (e: any) {
    message.error(e?.message || 'Import failed')
  }
  return false // prevent upload
}

function exportJSON() {
  const payload = {
    assignmentId: String(route.params.id || ''),
    exportedAt: new Date().toISOString(),
    rows: rows.value,
    rubric: rubric.value,
    comments: commentsBySubmission,
    autoSave: autoSave.value,
  }
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `gradebook-${route.params.id || 'assignment'}.json`
  a.click()
  URL.revokeObjectURL(url)
}

function exportCSV() {
  const headers = [
    'id','attempt','studentId','fileUrl','grade','feedback',
    ...rubric.value.map(r => `crit:${r.label}`),
    'weighted'
  ]
  const lines = [headers.join(',')]
  for (const r of rows.value) {
    const weighted = computeWeighted(r).toFixed(1)
    const crits = rubric.value.map(rb => String(r.criteria[rb.label] ?? 0))
    lines.push([
      csv(r.id), csv(r.attempt), csv(r.studentId), csv(r.fileUrl),
      csv(r.grade ?? ''), csv(r.feedback ?? ''),
      ...crits.map(csv), csv(weighted)
    ].join(','))
  }
  const blob = new Blob([lines.join('\n')], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `gradebook-${route.params.id || 'assignment'}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

function csv(v: any){ const s = String(v ?? ''); return /[,"\n]/.test(s) ? `"${s.replace(/"/g,'""')}"` : s }

/** ---------- Mocks ---------- */
function generateMockRows(n = 12): Row[] {
  const students = Array.from({ length: n }, (_, i) => ({
    id: `sub-${i+1}`,
    attempt: (i % 2) + 1,
    studentId: `student-${String(i+1).padStart(2,'0')}`,
    fileUrl: 'https://example.com/file.pdf',
    grade: undefined,
    feedback: '',
    criteria: rubric.value.reduce((acc, r) => { acc[r.label] = Math.round(Math.random()*40 + 60); return acc }, {} as Criteria)
  }))
  return students
}

function resetMocks() {
  rows.value = generateMockRows(12)
  rubric.value = [
    { label: 'Code', weight: 0.6 },
    { label: 'Report', weight: 0.4 },
  ]
  for (const k of Object.keys(commentsBySubmission)) delete (commentsBySubmission as any)[k]
  persistAll()
  message.success('Mocks reset')
}

/** ---------- Utils ---------- */
function randId(){ return 'id-' + Math.random().toString(36).slice(2, 10) }

/** ---------- Lifecycle ---------- */
onMounted(() => {
  if (!restoreAll()) {
    rows.value = generateMockRows(12)
    persistAll()
  }
})

watch([rows, rubric], () => { if (autoSave.value) persistAll() }, { deep: true })

definePageMeta({ layout: 'institution' })
</script>

<style scoped>
.muted { color: #64748b; }
.mb-2 { margin-bottom: 8px; }
.mb-3 { margin-bottom: 12px; }
.flex { display: flex; }
.gap-2 { gap: 8px; }
.items-center { align-items: center; }
.flex-wrap { flex-wrap: wrap; }
.ml-auto { margin-left: auto; }

.comment-item { padding: 6px 0; border-bottom: 1px solid #f0f0f0; }
</style>
