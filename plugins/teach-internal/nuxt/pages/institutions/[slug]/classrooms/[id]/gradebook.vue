
<template>
  <a-page-header :title="`Gradebook · ${route.params.id}`" sub-title="Classroom analytics and export">
    <template #extra>
      <a-button @click="downloadCsv">Export CSV</a-button>
      <a-button @click="printPdf">Print PDF</a-button>
    </template>
  </a-page-header>
  <a-card class="mt-3">
    <div class="flex gap-2 mb-3">
      <a-input v-model:value="q" placeholder="Filter by student ID..." style="max-width: 260px" />
      <a-select v-model:value="late" allow-clear placeholder="Late status" style="width: 180px">
        <a-select-option :value="true">Late only</a-select-option>
        <a-select-option :value="false">On-time only</a-select-option>
      </a-select>
    </div>
    <a-table :data-source="filtered" :columns="cols" row-key="id" :pagination="{ pageSize: 20 }" />
  </a-card>
</template>

<script setup lang="ts">
const route = useRoute()
const baseUrl = useRuntimeConfig().public?.baseURL || ''
const rows = ref<any[]>([])
const q = ref('')
const late = ref<boolean | undefined>(undefined)

const cols = [
  { title: 'Student', dataIndex: 'studentId', key: 'studentId' },
  { title: 'Assignment', dataIndex: 'assignmentId', key: 'assignmentId' },
  { title: 'Grade', dataIndex: 'grade', key: 'grade' },
  { title: 'Attempt', dataIndex: 'attempt', key: 'attempt' },
  { title: 'Late', dataIndex: 'isLate', key: 'isLate', customRender: ({text}:any)=> text ? 'Yes' : 'No' },
  { title: 'Graded At', dataIndex: 'gradedAt', key: 'gradedAt' },
]

const filtered = computed(()=> {
  return (rows.value || []).filter((r:any)=> {
    const okQ = q.value ? String(r.studentId).includes(q.value) : true
    const okLate = typeof late.value === 'boolean' ? r.isLate === late.value : true
    return okQ && okLate
  })
})

async function load(){
  const qy = 'query($classroomId:String!){ gradebookCsv(classroomId:$classroomId) }'
  const r = await $fetch(`${baseUrl}/api/teach-internal/graphql`, { method: 'POST', body: { query: qy, variables: { classroomId: String(route.params.id) }}}) as any
  const csv = r?.data?.gradebookCsv || ''
  rows.value = parseCsv(csv)
}

function parseCsv(csv:string){
  const lines = csv.split(/\r?\n/).filter(Boolean)
  if (!lines.length) return []
  const head = lines[0].split(',')
  return lines.slice(1).map(l=> {
    const vals = l.split(',')
    const o:any = {}
    head.forEach((h,i)=> o[h] = vals[i])
    o.isLate = o.isLate === '1' || o.isLate === 'true'
    return o
  })
}

async function downloadCsv(){
  const qy = 'query($classroomId:String!){ gradebookCsv(classroomId:$classroomId) }'
  const r = await $fetch(`${baseUrl}/api/teach-internal/graphql`, { method: 'POST', body: { query: qy, variables: { classroomId: String(route.params.id) }}}) as any
  const csv = r?.data?.gradebookCsv || ''
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a'); a.href = url; a.download = `gradebook-${route.params.id}.csv`; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url)
}

function printPdf(){ window.print() }

onMounted(load)
definePageMeta({ layout: 'institution' })
</script>
