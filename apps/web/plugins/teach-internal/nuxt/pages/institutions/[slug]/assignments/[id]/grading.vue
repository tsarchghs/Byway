<template>
  <a-layout class="p-6 grade-page">
    <a-card :title="`Grade · ${route.params.id}`" :bordered="false">
      <!-- Toolbar -->
      <div class="toolbar flex justify-between mb-3 flex-wrap items-center gap-2">
        <a-space wrap>
          <a-button @click="openRubric">
            <template #icon><SettingOutlined /></template>
            Rubric
          </a-button>
          <a-switch v-model:checked="autoSave" /> <span class="muted">Auto-save</span>
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
          <a-button danger @click="resetMock">
            <template #icon><DeleteOutlined /></template>
            Reset
          </a-button>
        </a-space>
        <a-tag color="orange">Mock mode</a-tag>
      </div>

      <!-- Submissions table -->
      <a-table
        :data-source="rows"
        :columns="cols"
        row-key="id"
        bordered
        size="middle"
        :pagination="{ pageSize: 8 }"
      />
    </a-card>
  </a-layout>

  <!-- Rubric drawer -->
  <a-drawer v-model:open="rubricOpen" title="Rubric editor" placement="right" width="440">
    <a-alert
      type="info"
      show-icon
      message="Provide JSON rubric — e.g. [{label:'Code',weight:0.6},{label:'Report',weight:0.4}]"
      class="mb-2"
    />
    <a-textarea v-model:value="rubricJson" :rows="10" />
    <div class="mt-2 flex gap-2 items-center">
      <a-button type="primary" @click="saveRubric">Save</a-button>
      <a-button @click="normalizeWeights">Normalize weights</a-button>
      <a-tag v-if="Math.abs(rubricWeightSum-1)<1e-6" color="green">Sum: 1.00</a-tag>
      <a-tag v-else color="red">Sum: {{ rubricWeightSum.toFixed(2) }}</a-tag>
    </div>
    <a-divider />
    <a-list
      size="small"
      :data-source="rubric"
      :renderItem="(r:any)=> h('div',{},`${r.label} · ${r.weight}`)"
    />
  </a-drawer>

  <!-- Comments drawer -->
  <a-drawer v-model:open="commentsOpen" title="Comments" placement="right" width="420">
    <a-list
      :data-source="comments"
      :renderItem="(c:any)=> h('div',{class:'comment-item'},`${c.at} – ${c.authorId||'anon'}: ${c.text}`)"
    />
    <a-textarea v-model:value="newComment" :rows="3" class="mt-2" placeholder="Add a comment..." />
    <div class="mt-2">
      <a-button type="primary" @click="postComment">Post</a-button>
    </div>
  </a-drawer>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch, h } from 'vue'
import { useRoute, definePageMeta } from '#imports'
import { message } from 'ant-design-vue'
import {
  SettingOutlined, UploadOutlined, DownloadOutlined, DeleteOutlined
} from '@ant-design/icons-vue'

/* ---------------- Types ---------------- */
type RubricItem = { label: string; weight: number }
type Criteria = Record<string, number>
type Row = {
  id: string
  attempt: number
  studentId: string
  fileUrl: string
  grade?: number
  feedback?: string
  criteria: Criteria
  _grade?: number
  _feedback?: string
}
type Comment = { id: string; text: string; at: string; authorId?: string }

/* ---------------- Setup ---------------- */
const route = useRoute()
const rows = ref<Row[]>([])
const rubric = ref<RubricItem[]>([
  { label: 'Code', weight: 0.6 },
  { label: 'Report', weight: 0.4 }
])
const rubricOpen = ref(false)
const rubricJson = ref(JSON.stringify(rubric.value, null, 2))
const rubricWeightSum = computed(() => rubric.value.reduce((s, r) => s + (r.weight || 0), 0))

const commentsOpen = ref(false)
const commentsMap = reactive<Record<string, Comment[]>>({})
const comments = computed(() => commentsMap[currentId.value] || [])
const currentId = ref('')
const newComment = ref('')
const autoSave = ref(true)
const userId = ref('teacher-01')

const STORAGE_KEY = computed(() => `byway.mock.grade.${route.params.id}`)

/* ---------------- Table Columns ---------------- */
const baseCols = [
  { title: 'Attempt', dataIndex: 'attempt', key: 'attempt', sorter: (a: Row,b: Row)=>a.attempt-b.attempt },
  { title: 'Student', dataIndex: 'studentId', key: 'studentId' },
  { title: 'File', key:'file', customRender:({record}:any)=> h('a',{href:record.fileUrl,target:'_blank'},'Open') }
]

const rubricCols = computed(()=> rubric.value.map(r=>({
  title:`${r.label} (${(r.weight*100).toFixed(0)}%)`,
  key:`crit-${r.label}`,
  customRender:({record}:{record:Row})=> h('a-input-number',{
    min:0,max:100,value:record.criteria[r.label]??0,
    'onUpdate:value':(v:number)=>{record.criteria[r.label]=v;if(autoSave.value)persist()}
  })
})))

const weightedCol = {
  title:'Weighted',
  key:'weighted',
  customRender:({record}:{record:Row})=>{
    const val=computeWeighted(record).toFixed(1)
    return h('div',{},[
      h('span',{},val),
      h('a',{style:'margin-left:8px',onClick:()=>applyWeighted(record)},'Apply')
    ])
  }
}

const gradeCol = {
  title:'Grade',
  key:'grade',
  customRender:({record}:{record:Row})=> h('div',{},[
    h('a-input-number',{
      min:0,max:100,value:record._grade??record.grade??0,
      'onUpdate:value':(v:number)=> record._grade=v
    }),
    h('a-button',{style:'margin-left:8px',onClick:()=>grade(record)},'Save')
  ])
}

const feedbackCol = {
  title:'Feedback',
  key:'feedback',
  customRender:({record}:{record:Row})=>
    h('a-input',{
      style:'min-width:220px',
      value:record._feedback??record.feedback,
      'onUpdate:value':(v:string)=> record._feedback=v,
      onBlur:()=>{if(autoSave.value)grade(record,{silent:true})}
    })
}

const commentCol = {
  title:'Comments',
  key:'comments',
  customRender:({record}:{record:Row})=>
    h('a',{onClick:()=>openComments(record.id)},'Open')
}

const cols = computed(()=>[
  ...baseCols,
  ...rubricCols.value,
  weightedCol,
  gradeCol,
  feedbackCol,
  commentCol
])

/* ---------------- Core Logic ---------------- */
function computeWeighted(r:Row){
  return rubric.value.reduce((s,it)=> s + (r.criteria[it.label]||0)*it.weight,0)
}
function applyWeighted(r:Row){
  r._grade = Math.round(computeWeighted(r)*10)/10
  if(autoSave.value) grade(r,{silent:true})
}
function grade(r:Row,opts?:{silent?:boolean}){
  if(typeof r._grade==='number') r.grade=r._grade
  if(typeof r._feedback!=='undefined') r.feedback=r._feedback
  persist()
  if(!opts?.silent) message.success('Saved')
}

/* ---------------- Rubric ---------------- */
function openRubric(){ rubricJson.value=JSON.stringify(rubric.value,null,2);rubricOpen.value=true }
function saveRubric(){
  try{
    const parsed=JSON.parse(rubricJson.value)
    if(!Array.isArray(parsed)) throw new Error('Must be an array')
    parsed.forEach((it:any,i:number)=>{
      if(typeof it.label!=='string'||typeof it.weight!=='number') throw new Error(`Invalid item #${i}`)
    })
    rubric.value=parsed
    rows.value.forEach(r=>{
      for(const c of rubric.value) if(typeof r.criteria[c.label]!=='number') r.criteria[c.label]=0
    })
    persist()
    rubricOpen.value=false
    message.success('Rubric saved')
  }catch(e:any){ message.error(e?.message||'Invalid JSON') }
}
function normalizeWeights(){
  const sum=rubric.value.reduce((s,r)=>s+(r.weight||0),0)||1
  rubric.value=rubric.value.map(r=>({...r,weight:+(r.weight/sum).toFixed(4)}))
  rubricJson.value=JSON.stringify(rubric.value,null,2)
}

/* ---------------- Comments ---------------- */
function openComments(id:string){
  currentId.value=id
  if(!commentsMap[id]) commentsMap[id]=[]
  commentsOpen.value=true
}
function postComment(){
  const id=currentId.value
  const text=newComment.value.trim()
  if(!id||!text) return
  const c:Comment={id:rand(),text,at:new Date().toLocaleString(),authorId:userId.value}
  commentsMap[id].unshift(c)
  newComment.value=''
  persist()
}

/* ---------------- Persistence ---------------- */
function persist(){
  const payload={rows:rows.value,rubric:rubric.value,comments:commentsMap}
  /* TODO: replace with mutation via gqlFetch */ console.debug("setItem replaced"); (STORAGE_KEY.value,JSON.stringify(payload))
}
function restore(){
  const raw=/* TODO: replace with gqlFetch to proper query */ undefined && (STORAGE_KEY.value)
  if(!raw) return false
  try{
    const data=JSON.parse(raw)
    if(Array.isArray(data.rows)) rows.value=data.rows
    if(Array.isArray(data.rubric)) rubric.value=data.rubric
    Object.assign(commentsMap,data.comments||{})
    return true
  }catch{return false}
}

/* ---------------- Export / Import ---------------- */
async function onImportJSON(file:File){
  try{
    const text=await file.text()
    const data=JSON.parse(text)
    rows.value=data.rows||[]
    rubric.value=data.rubric||[]
    Object.assign(commentsMap,data.comments||{})
    persist()
    message.success('Imported')
  }catch(e:any){message.error(e?.message||'Import failed')}
  return false
}
function exportJSON(){
  const blob=new Blob([JSON.stringify({rows:rows.value,rubric:rubric.value,comments:commentsMap},null,2)],{type:'application/json'})
  const url=URL.createObjectURL(blob)
  const a=document.createElement('a')
  a.href=url;a.download=`grade-${route.params.id}.json`;a.click()
  URL.revokeObjectURL(url)
}

/* ---------------- Mock Data ---------------- */
function mockRows(n=10):Row[]{
  return Array.from({length:n},(_,i)=>({
    id:`sub-${i+1}`,
    attempt:(i%2)+1,
    studentId:`student-${String(i+1).padStart(2,'0')}`,
    fileUrl:'https://example.com/file.pdf',
    criteria:rubric.value.reduce((acc,c)=>{acc[c.label]=Math.round(60+Math.random()*40);return acc},{}) as Criteria,
    grade:undefined,feedback:''
  }))
}
function resetMock(){
  rows.value=mockRows(10)
  Object.keys(commentsMap).forEach(k=>delete commentsMap[k])
  persist()
  message.success('Mock reset')
}

/* ---------------- Utils ---------------- */
function rand(){return Math.random().toString(36).slice(2,9)}

/* ---------------- Lifecycle ---------------- */
onMounted(()=>{
  if(!restore()){ rows.value=mockRows(10);persist() }
})
watch([rows,rubric],()=>{ if(autoSave.value) persist() },{deep:true})
definePageMeta({ layout:'institution' })


</script>

<style scoped>
.grade-page{min-height:100vh;background:#fafafa;}
.toolbar{background:#fff;padding:8px 12px;border-radius:6px;}
.muted{color:#64748b;}
.comment-item{border-bottom:1px solid #f0f0f0;padding:6px 0;}
.flex{display:flex;}
.gap-2{gap:8px;}
.justify-between{justify-content:space-between;}
.mb-3{margin-bottom:12px;}
.items-center{align-items:center;}
</style>
