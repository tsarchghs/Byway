<template>
  <a-layout class="p-6">
    <StudentsNav subtitle="My Enrollments" />
    <a-card :loading="loading" :bordered="false">
      <a-table :data-source="rows" :columns="cols" row-key="id" />
      <div v-if="!loading && !rows.length" class="muted mt-2">No enrollments yet.</div>
    </a-card>
  </a-layout>
</template>

<script setup lang="ts">
import StudentsNav from "../components/StudentsNav.vue"
import { useGql } from '#shared/composables/useGql.ts'
import { useAuth } from '../../../../packages/shared-ui/src/composables/useAuth'
const { gql } = useGql()
const route = useRoute()
const router = useRouter()
const { user, token, isLoggedIn } = useAuth()

const loading = ref(true)
const rows = ref<any[]>([])
const cols = [
  { title: 'Course', dataIndex: 'courseTitle', key: 'courseTitle' },
  { title: 'Progress', key: 'progress', customRender: ({record}: any)=> (record.progressPct || 0) + '%' },
  { title: 'Updated', dataIndex: 'updatedAt' },
  {
    title: 'Actions',
    key: 'actions',
    customRender: ({record}: any)=> h('a', { onClick: ()=> goToCourse(record) }, 'Open')
  },
]

onMounted(async ()=>{
  try {
    if (!isLoggedIn.value || !user.value?.id) {
      message.warning('Please sign in to see enrollments')
      router.push('/login')
      return
    }
    await ensureStudentProfile()
    const q = `query { myEnrollments { id courseId progressPct updatedAt course { id title modules { id } } } }`
    const d = await gql<{myEnrollments:any[]}>(q)
    rows.value = (d.myEnrollments || []).map((r:any)=> ({
      ...r,
      courseTitle: r.course?.title || r.courseId,
      firstModuleId: r.course?.modules?.[0]?.id || null,
    }))
  } finally {
    loading.value = false
  }
})

function goToCourse(row:any){
  if (row.firstModuleId) {
    router.push(`/student/_/course/${encodeURIComponent(row.courseId)}/module/${encodeURIComponent(row.firstModuleId)}`)
  } else {
    router.push(`/course/${encodeURIComponent(row.courseId)}`)
  }
}

async function ensureStudentProfile(){
  const authId = (user.value as any)?.userId || user.value.id
  try {
    const q = `query($uid:String!){ studentByUserId(userId:$uid){ id } }`
    const data = await gql<any>(q, { uid: authId })
    if (data?.studentByUserId?.id) return data.studentByUserId.id
  } catch {}
  const create = await gql<any>(
    `mutation($uid:String!,$name:String){ createStudent(userId:$uid, displayName:$name){ id } }`,
    { uid: authId, name: user.value.email || user.value.displayName || 'Student' }
  )
  return create?.createStudent?.id
}
</script>

<style scoped>
.muted { color: #94a3b8; }
.mt-2 { margin-top: 12px; }
</style>
