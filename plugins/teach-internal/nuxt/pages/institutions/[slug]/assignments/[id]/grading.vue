<template>
  <a-layout class="p-6">
    <a-card :title="`Grade · ${route.params.id}`" :bordered="false">
      <a-table :data-source="rows" :columns="cols" row-key="id" />
    </a-card>
  </a-layout>
</template>

<script setup lang="ts">
const route = useRoute()
const config = useRuntimeConfig()
const baseUrl = config.public?.apiBase || 'http://localhost:4000'
const rows = ref<any[]>([])
const cols = [
  { title: 'Student', dataIndex: 'studentId', key: 'studentId' },
  { title: 'File', dataIndex: 'fileUrl', key: 'fileUrl' },
  { title: 'Grade', key: 'grade', customRender: ({ record }: any) => {
    return h('div', {}, [
      h('a-input-number', {
        value: record.grade,
        min: 0, max: 100,
        onChange: (v:any)=> record._grade = v
      }),
      h('a-button', { style: 'margin-left:8px', onClick: ()=> grade(record) }, 'Save')
    ])
  }},
  { title: 'Feedback', key: 'feedback', customRender: ({ record }: any) => {
    return h('div', {}, [
      h('a-input', { value: record._feedback ?? record.feedback, onChange: (e:any)=> record._feedback = e?.target?.value, style: 'min-width:220px' }),
    ])
  }},
]

async function load() {
  const q = 'query($assignmentId:String!){ submissionsByAssignment(assignmentId:$assignmentId){ id studentId fileUrl grade feedback } }'
  const r = await $fetch(`${baseUrl}/api/teach-internal/graphql`, { method: 'POST', body: { query: q, variables: { assignmentId: String(route.params.id) }}}) as any
  rows.value = r.data?.submissionsByAssignment ?? []
}
async function grade(rec:any) {
  const q = 'mutation($id:String!,$grade:Float!,$feedback:String){ gradeSubmission(id:$id, grade:$grade, feedback:$feedback){ id grade feedback } }'
  await $fetch(`${baseUrl}/api/teach-internal/graphql`, {
    method: 'POST',
    body: { query: q, variables: { id: rec.id, grade: Number(rec._grade ?? rec.grade ?? 0), feedback: rec._feedback ?? rec.feedback ?? null } }
  })
  await load()
}
onMounted(load)
</script>
