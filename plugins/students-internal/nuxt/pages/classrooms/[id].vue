<template>
  <a-layout class="p-6">
    <a-card :title="`My Classroom · ${classroomId}`" :bordered="false">
      <div class="mb-4 flex items-center gap-2">
        <a-input v-model:value="studentId" placeholder="Your studentId" style="max-width:280px" />
        <a-button @click="refresh">Refresh</a-button>
      </div>

      <a-table :data-source="rows" :columns="cols" row-key="id" />

      <a-divider />
      <h3>Submit work</h3>
      <div class="mb-4 flex items-center gap-2">
        <a-select v-model:value="assignmentId" style="min-width:300px" placeholder="Select assignment">
          <a-select-option v-for="a in rows" :key="a.id" :value="a.id">
            {{ a.title }} — due {{ a.dueDate }}
          </a-select-option>
        </a-select>
        <a-input v-model:value="fileUrl" placeholder="File URL" style="max-width:420px" />
        <a-button type="primary" @click="submit">Submit</a-button>
      </div>

      <a-table :data-source="mySubs" :columns="sCols" row-key="id" />
    </a-card>
  </a-layout>
</template>

<script setup lang="ts">
const route = useRoute()
const config = useRuntimeConfig()
const baseUrl = config.public?.apiBase || 'http://localhost:4000'
const classroomId = computed(() => String(route.params.id))

const studentId = ref('')
const rows = ref<any[]>([])
const cols = [
          { title: 'Attempts Left', key: 'attempts', customRender: ({ record }: any)=> attemptsLeft(record) },
          { title: 'Status', key: 'st', customRender: ({ record }: any) => statusLabel(record) },
  { title: 'Title', dataIndex: 'title', key: 'title' },
  { title: 'Due', dataIndex: 'dueDate', key: 'dueDate' },
  { title: 'Description', dataIndex: 'description', key: 'description' },
  { title: 'Grade (mine)', key: 'grade', customRender: ({ record }: any) => {
    const sub = mySubs.value.find((s:any)=> s.assignmentId === record.id)
    return sub?.grade ?? '-'
  }},
]

const mySubs = ref<any[]>([])


function statusLabel(a:any){
  const now = dayjs(); const due = a.dueDate ? dayjs(a.dueDate) : null; const accept = a.acceptUntil ? dayjs(a.acceptUntil) : due
  if (accept && now.isAfter(accept)) return h('a-tag', { color:'red' }, 'Closed')
  if (due && now.isAfter(due)) return h('a-tag', { color:'orange' }, 'Late window')
  return h('a-tag', { color:'green' }, 'Open')
}

function attemptsLeft(a:any){
  const maxA = Number(a.maxAttempts ?? 1)
  const used = mySubs.value.filter((s:any)=> s.assignmentId === a.id).length
  return Math.max(0, maxA - used)
}

        const sCols = [
  { title: 'Assignment', dataIndex: 'assignmentId', key: 'assignmentId' },
  { title: 'File', dataIndex: 'fileUrl', key: 'fileUrl' },
  { title: 'Grade', dataIndex: 'grade', key: 'grade' },
  { title: 'Feedback', dataIndex: 'feedback', key: 'feedback' },
]

const assignmentId = ref('')
const fileUrl = ref('')

async function loadAssignments() {
  const q = 'query($classroomId:String!){ assignmentsByClassroom(classroomId:$classroomId){ id title description dueDate acceptUntil maxAttempts } }'
  const r = await $fetch(`${baseUrl}/api/teach-internal/graphql`, { method: 'POST', body: { query: q, variables: { classroomId: classroomId.value }}}) as any
  rows.value = r.data?.assignmentsByClassroom ?? []
}
async function loadMySubs() {
  if (!studentId.value) { mySubs.value = []; return }
  const q = 'query($studentId:String!){ mySubmissions(studentId:$studentId){ id assignmentId fileUrl grade feedback } }'
  const r = await $fetch(`${baseUrl}/api/teach-internal/graphql`, { method: 'POST', body: { query: q, variables: { studentId: studentId.value }}}) as any
  mySubs.value = r.data?.mySubmissions ?? []
}
async function submit() {
  if (!assignmentId.value || !studentId.value) return
  const q = 'mutation($assignmentId:String!,$studentId:String!,$fileUrl:String){ createSubmission(assignmentId:$assignmentId,studentId:$studentId,fileUrl:$fileUrl){ id } }'
  await $fetch(`${baseUrl}/api/teach-internal/graphql`, { method: 'POST', body: { query: q, variables: { assignmentId: assignmentId.value, studentId: studentId.value, fileUrl: fileUrl.value || null }}})
  fileUrl.value = ''
  await loadMySubs()
}
async function refresh() {
  await Promise.all([loadAssignments(), loadMySubs()])
}
onMounted(refresh)
watch(studentId, loadMySubs)


definePageMeta({ layout: 'student' })
</script>
