<template>
  <a-layout class="p-6">
    <a-card :title="`Admin · ${route.params.slug}`" :bordered="false">
      <a-tabs>
        <a-tab-pane key="classrooms" tab="Classrooms">
      <p class="mb-4">Create course classrooms bound to this institution.</p>
      <div class="mb-4 flex gap-2">
        <a-input v-model:value="courseId" placeholder="Course ID" style="max-width: 260px" />
        <a-input v-model:value="name" placeholder="Classroom name" style="max-width: 220px" />
        <a-date-picker v-model:value="start" placeholder="Start date" />
        <a-date-picker v-model:value="end" placeholder="End date" />
        <a-button type="primary" @click="create">Create classroom</a-button>
      </div>
      <a-table :data-source="rows" :columns="cols" row-key="id" />
            </a-tab-pane>
        <a-tab-pane key="assignments" tab="Assignments">
          <div class="mb-4">
            <a-select v-model:value="selectedClassroomId" style="min-width:260px" placeholder="Select classroom">
              <a-select-option v-for="c in rows" :key="c.id" :value="c.id">{{ c.name }}</a-select-option>
            </a-select>
            <a-input v-model:value="aTitle" placeholder="Assignment title" style="max-width:220px; margin-left:8px" />
            <a-input v-model:value="aDesc" placeholder="Description" style="max-width:260px; margin-left:8px" />
            <a-date-picker v-model:value="aDue" placeholder="Due date" style="margin-left:8px" />
            <a-button type="primary" @click="createAssignment" style="margin-left:8px">Create</a-button>
          </div>
          <a-table :data-source="assignments" :columns="aCols" row-key="id" />
        </a-tab-pane>
              <a-tab-pane key="enrollments" tab="Enrollments (CSV)">
          <p class="mb-2">Paste rows: <code>studentId,courseId[,classroomId]</code></p>
          <a-textarea v-model:value="csvText" :rows="6" placeholder="s123,c101,clA\ns124,c101,clA" />
          <div class="mt-2 flex items-center gap-2">
            <a-upload :before-upload="beforeUpload" :show-upload-list="false">
              <a-button>Upload CSV</a-button>
            </a-upload>
            <a-button type="primary" @click="bulkEnroll">Import</a-button>
          </div>
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </a-layout>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
const route = useRoute()
const config = useRuntimeConfig()
const baseUrl = config.public?.apiBase || 'http://localhost:4000'

const courseId = ref('')
const name = ref('')
const start = ref<any>(null)
const end = ref<any>(null)
const rows = ref<any[]>([])
const cols = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Start', dataIndex: 'startDate', key: 'startDate' },
  { title: 'End', dataIndex: 'endDate', key: 'endDate' },
]

async function list() {
  if (!courseId.value) { rows.value = []; return }
  const q = 'query($courseId:String!){ classroomsByCourse(courseId:$courseId){ id name startDate endDate } }'
  const r = await $fetch(`${baseUrl}/api/teach-internal/graphql`, { method: 'POST', body: { query: q, variables: { courseId: courseId.value } } }) as any
  rows.value = r.data?.classroomsByCourse ?? []
}

async function create() {
  if (!courseId.value || !name.value || !start.value || !end.value) return
  const q = 'mutation($courseId:String!,$name:String!,$startDate:String!,$endDate:String!){ createClassroom(courseId:$courseId,name:$name,startDate:$startDate,endDate:$endDate){ id } }'
  await $fetch(`${baseUrl}/api/teach-internal/graphql`, {
    method: 'POST',
    body: { query: q, variables: { courseId: courseId.value, name: name.value, startDate: dayjs(start.value).toISOString(), endDate: dayjs(end.value).toISOString() } }
  })
  await list()
}

watch(courseId, list)


const selectedClassroomId = ref<string>('')
const assignments = ref<any[]>([])
const aTitle = ref('')
const aDesc = ref('')
const aDue = ref<any>(null)
const aCols = [
          { title: 'Actions', key: 'a', customRender: ({ record }: any) => h('a', { href: `/institutions/${route.params.slug}/assignments/${record.id}/grading` }, 'Grade') },
  { title: 'Title', dataIndex: 'title', key: 'title' },
  { title: 'Due', dataIndex: 'dueDate', key: 'dueDate' },
]

async function loadAssignments() {
  if (!selectedClassroomId.value) { assignments.value = []; return }
  const q = 'query($classroomId:String!){ assignmentsByClassroom(classroomId:$classroomId){ id title description dueDate } }'
  const r = await $fetch(`${baseUrl}/api/teach-internal/graphql`, { method: 'POST', body: { query: q, variables: { classroomId: selectedClassroomId.value } } }) as any
  assignments.value = r.data?.assignmentsByClassroom ?? []
}

async function createAssignment() {
  if (!selectedClassroomId.value || !aTitle.value || !aDesc.value || !aDue.value) return
  const q = 'mutation($classroomId:String!,$title:String!,$description:String!,$dueDate:String!){ createAssignment(classroomId:$classroomId,title:$title,description:$description,dueDate:$dueDate){ id } }'
  await $fetch(`${baseUrl}/api/teach-internal/graphql`, {
    method: 'POST',
    body: { query: q, variables: { classroomId: selectedClassroomId.value, title: aTitle.value, description: aDesc.value, dueDate: dayjs(aDue.value).toISOString() } }
  })
  aTitle.value=''; aDesc.value=''; aDue.value=null
  await loadAssignments()
}

watch(selectedClassroomId, loadAssignments)


function beforeUpload(file: any){
  const reader = new FileReader()
  reader.onload = (e:any)=> { csvText.value = String(e.target?.result || '') }
  reader.readAsText(file)
  return false
}



const csvText = ref('')
async function bulkEnroll() {
  if (!csvText.value) return
  const q = 'mutation($csv:String!){ bulkEnrollCsv(csv:$csv) }'
  await $fetch(`${baseUrl}/api/students-internal/graphql`, {
    method: 'POST',
    body: { query: q, variables: { csv: csvText.value } }
  })
  csvText.value = ''
}


</script>
