<template>
  <a-layout class="p-6">
    <a-card :title="`Dashboard · ${route.params.slug}`" :bordered="false">
      <div class="mb-4 flex flex-wrap gap-2 items-center">
            <a-input v-model:value="userId" placeholder="Your userId (for roles)" style="max-width:260px" />
            <a-button @click="checkRoles">Check Access</a-button>
        <a-input v-model:value="courseId" placeholder="Course ID filter (optional)" style="max-width:260px" />
        <a-button @click="load">Load</a-button>
      </div>

      <div class="grid md:grid-cols-4 gap-3 mb-4">
        <a-card size="small" title="Classrooms"><div class="text-2xl">{{ stats.classrooms }}</div></a-card>
        <a-card size="small" title="Assignments"><div class="text-2xl">{{ stats.assignments }}</div></a-card>
        <a-card size="small" title="Submissions"><div class="text-2xl">{{ stats.submissions }}</div></a-card>
        <a-card size="small" title="Enrollments (total)"><div class="text-2xl">{{ stats.enrollments }}</div></a-card>
      </div>

      <a-alert v-if="allowed===false" type="warning" message="Access denied: Admin role required" show-icon class="mb-3" />
          <a-table v-else :data-source="rows" :columns="cols" row-key="id" />

      <a-divider />
      <h3>Recent Submissions</h3>
      <a-table :data-source="recentSubs" :columns="sCols" row-key="id" />
    </a-card>
  </a-layout>
</template>

<script setup lang="ts">
const route = useRoute()
const config = useRuntimeConfig()
const baseUrl = config.public?.apiBase || 'http://localhost:4000'

const courseId = ref('')
const rows = ref<any[]>([])
const recentSubs = ref<any[]>([])
const stats = reactive({ classrooms: 0, assignments: 0, submissions: 0, enrollments: 0 })

const cols = [
  { title: 'Classroom', dataIndex: 'name', key: 'name' },
  { title: 'Assignments', dataIndex: 'assignmentsCount', key: 'assignmentsCount' },
  { title: 'Submissions', dataIndex: 'submissionsCount', key: 'submissionsCount' },
  { title: 'Enrollments', dataIndex: 'enrollments', key: 'enrollments' },
  { title: 'Actions', key: 'act', customRender: ({ record }: any)=> h('a', { href: `/institutions/${route.params.slug}/assignments/${record.latestAssignmentId}/grading` }, 'Grade latest') },
]
const sCols = [
  { title: 'Assignment', dataIndex: 'assignmentId', key: 'assignmentId' },
  { title: 'Student', dataIndex: 'studentId', key: 'studentId' },
  { title: 'File', dataIndex: 'fileUrl', key: 'fileUrl' },
  { title: 'Grade', dataIndex: 'grade', key: 'grade' },
]

async function load() {
  rows.value = []; recentSubs.value = []; stats.classrooms=stats.assignments=stats.submissions=stats.enrollments=0
  // 1) list classrooms
  const q1 = 'query($courseId:String,$institutionId:String){ classroomsByCourse(courseId:$courseId, institutionId:$institutionId){ id name } }'
  const cls = await $fetch(`${baseUrl}/api/teach-internal/graphql`, { method: 'POST', body: { query: q1, variables: { courseId: courseId.value || 'ANY', institutionId: String(route.params.slug) }}}).catch(()=>null) as any
  const classrooms = cls?.data?.classroomsByCourse ?? []

  for (const c of classrooms) {
    // 2) assignments per classroom
    const qA = 'query($classroomId:String!){ assignmentsByClassroom(classroomId:$classroomId){ id } }'
    const rA = await $fetch(`${baseUrl}/api/teach-internal/graphql`, { method: 'POST', body: { query: qA, variables: { classroomId: c.id }}}) as any
    const assignments = rA?.data?.assignmentsByClassroom ?? []
    const assignmentsCount = assignments.length

    // 3) total submissions for those assignments + sample latest
    let submissionsCount = 0
    let latestAssignmentId = assignments[0]?.id || ''
    for (const a of assignments) {
      const qS = 'query($assignmentId:String!){ submissionsByAssignment(assignmentId:$assignmentId){ id studentId fileUrl grade } }'
      const rS = await $fetch(`${baseUrl}/api/teach-internal/graphql`, { method: 'POST', body: { query: qS, variables: { assignmentId: a.id }}}) as any
      const subs = rS?.data?.submissionsByAssignment ?? []
      submissionsCount += subs.length
      if (subs.length > 0) {
        recentSubs.value.push(...subs.slice(0,3).map((s:any)=> ({ ...s, assignmentId: a.id })))
        latestAssignmentId = a.id
      }
    }

    // 4) enrollment count via students-internal
    const qE = 'query($classroomId:String!){ enrollmentCountByClassroom(classroomId:$classroomId) }'
    const rE = await $fetch(`${baseUrl}/api/students-internal/graphql`, { method: 'POST', body: { query: qE, variables: { classroomId: c.id }}}) as any
    const enrollments = rE?.data?.enrollmentCountByClassroom ?? 0

    rows.value.push({ id: c.id, name: c.name, assignmentsCount, submissionsCount, enrollments, latestAssignmentId })
    stats.classrooms++
    stats.assignments += assignmentsCount
    stats.submissions += submissionsCount
    stats.enrollments += enrollments
  }
}

onMounted(load)


const userId = ref('')
const allowed = ref<boolean | null>(null)

async function checkRoles(){
  if(!userId.value){ allowed.value = null; return }
  const q = 'query($userId:String!,$institutionId:String!,$role:String!){ hasRole(userId:$userId,institutionId:$institutionId,role:$role) }'
  const r = await $fetch(`${baseUrl}/api/authentication/graphql`, { method: 'POST', body: { query: q, variables: { userId: userId.value, institutionId: String(route.params.slug), role: 'Admin' }}}) as any
  allowed.value = !!r?.data?.hasRole
}

</script>
