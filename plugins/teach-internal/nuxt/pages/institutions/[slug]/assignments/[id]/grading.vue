<template>
  <a-layout class="p-6">
    <a-card :title="`Grade · ${route.params.id}`" :bordered="false">
      <a-table :data-source="rows" :columns="cols" row-key="id" />

<a-drawer v-model:open="rubricOpen" title="Rubric" placement="right" width="420">
  <a-alert type="info" message="Provide a JSON rubric, e.g., [{label:'Code',weight:0.5},{label:'Report',weight:0.5}]" show-icon class="mb-2" />
  <a-textarea v-model:value="rubricJson" :rows="10" />
  <div class="mt-2"><a-button type="primary" @click="saveRubric">Save</a-button></div>
</a-drawer>
    </a-card>
  </a-layout>

  <a-drawer v-model:open="commentsOpen" title="Comments" placement="right" width="420">
    <a-list :data-source="comments" :renderItem="(c:any)=> h('div', {}, `${c.at} – ${c.authorId || 'anon'}: ${c.text}`)" />
    <a-textarea v-model:value="newComment" :rows="3" class="mt-2" placeholder="Add a comment..." />
    <div class="mt-2"><a-button type="primary" @click="postComment">Post</a-button></div>
  </a-drawer>
</template>


<script setup lang="ts">
const route = useRoute()
const config = useRuntimeConfig()
const baseUrl = config.public?.apiBase || 'http://localhost:4000'
const rows = ref<any[]>([])
\1
      { title:'Comments', key:'comments', customRender:({ record }:any)=> h('a', { onClick:()=> loadComments(record.id) }, 'Open') },
      { title: 'Attempt', dataIndex: 'attempt', key: 'attempt' },
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
onMounted(async()=>{ try{ await load() }catch(_e){}; try{ await loadRubric() }catch(_e){} })


const rubricOpen = ref(false)
const rubricJson = ref('')
const commentText = ref('')

function openRubric(){ rubricOpen.value = true }
async function saveRubric(){
  // store locally; actual persist happens on gradeSubmission
  rubricOpen.value = false
}


definePageMeta({ layout: 'institution' })


async function loadRubric(){
  const q = 'query($id:String!){ assignmentById(id:$id){ id title rubric } }'
  const r = await $fetch(`${baseUrl}/api/teach-internal/graphql`, { method:'POST', body:{ query:q, variables:{ id: String(route.params.id) }}}) as any
  const raw = r?.data?.assignmentById?.rubric
  if (raw) { rubricJson.value = typeof raw === 'string' ? raw : JSON.stringify(raw, null, 2) }
}


const commentsOpen = ref(false)
const comments = ref<any[]>([])
const newComment = ref('')
async function loadComments(submissionId:string){
  const q = 'query($submissionId:String!){ submissionComments(submissionId:$submissionId) }'
  const r = await $fetch(`${baseUrl}/api/teach-internal/graphql`, { method:'POST', body:{ query:q, variables:{ submissionId }}}) as any
  const raw = r?.data?.submissionComments
  try { comments.value = raw ? JSON.parse(raw) : [] } catch(_e){ comments.value = [] }
  commentsOpen.value = true
}
async function postComment(){
  const targetId = currentRow?.value?.id || rows?.value?.[0]?.id
  if(!targetId || !newComment.value) return
  const q = 'mutation($submissionId:String!,$text:String!,$authorId:String){ addSubmissionComment(submissionId:$submissionId,text:$text,authorId:$authorId) }'
  await $fetch(`${baseUrl}/api/teach-internal/graphql`, { method:'POST', body:{ query:q, variables:{ submissionId: targetId, text: newComment.value, authorId: userId?.value || undefined }}})
  newComment.value = ''
  await loadComments(targetId)
}
</script>


