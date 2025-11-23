<template>
  <a-layout class="p-6">
    <StudentsNav subtitle="My Courses" />

    <a-card :loading="loading" :bordered="false">
      <template #title>
        <div class="flex-between">
          <span>Enrolled courses</span>
          <a-button type="primary" @click="$router.push('/categories')">Browse more</a-button>
        </div>
      </template>

      <a-empty v-if="!loading && courses.length === 0" description="No enrollments yet." />

      <a-row v-else :gutter="[16,16]">
        <a-col v-for="c in courses" :key="c.courseId" :xs="24" :sm="12" :md="8" :lg="6">
          <a-card :hoverable="true" class="course-card">
            <div class="cover" :style="coverStyle(c)">
              <div class="badge" v-if="c.course?.category">{{ c.course.category }}</div>
            </div>
            <div class="meta">
              <div class="title">{{ c.course?.title || c.courseId }}</div>
              <div class="muted">{{ c.course?.difficulty || '—' }}</div>
            </div>
            <a-space style="margin-top: 8px">
              <a-button block @click="openCourse(c)">View</a-button>
              <a-button type="primary" block @click="startCourse(c)" :loading="startingId===c.courseId">
                Continue
              </a-button>
            </a-space>
          </a-card>
        </a-col>
      </a-row>
    </a-card>
  </a-layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRuntimeConfig } from '#imports'
import { message } from 'ant-design-vue'
import StudentsNav from '../components/StudentsNav.vue'
import { useAuth } from '../../../../packages/shared-ui/src/composables/useAuth'

const router = useRouter()
const { user, token, isLoggedIn } = useAuth()
const config = useRuntimeConfig()
const apiBase = config.public?.apiBase || 'http://localhost:4000'

const loading = ref(false)
const courses = ref<any[]>([])
const studentId = ref<string | null>(null)
const startingId = ref<string | null>(null)

async function fetchCourseDetails(courseId: string) {
  try {
    const resp = await fetch(`${apiBase}/api/teach-internal/graphql`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        query: `
          query ($id:String!) {
            course(id:$id) {
              id title category difficulty coverUrl
              modules { id title lessons { id duration } }
            }
          }
        `,
        variables: { id: courseId },
      }),
    })
    const json = await resp.json()
    return json?.data?.course || null
  } catch {
    return null
  }
}

function coverStyle(c:any){
  const url = c.course?.coverUrl
  if (url) return { backgroundImage: `url('${url}')` }
  return { backgroundImage: 'linear-gradient(135deg,#1e3a8a,#2563eb)' }
}

async function gqlStudents(query:string, variables:any){
  const res = await fetch(`${apiBase}/api/students-internal/graphql`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...(token.value ? { Authorization: `Bearer ${token.value}` } : {}),
    },
    body: JSON.stringify({ query, variables })
  })
  const json = await res.json()
  if (json.errors?.length) throw new Error(json.errors[0].message)
  return json.data
}

async function resolveStudentId(){
  if (studentId.value) return studentId.value
  if (!user.value?.id) throw new Error('Not authenticated')
  // Try to find, otherwise create, the student profile
  let sid: string | undefined
  const authId = (user.value as any).userId || user.value.id
  try {
    const data = await gqlStudents(`query($uid:String!){ studentByUserId(userId:$uid){ id } }`, { uid: authId })
    sid = data?.studentByUserId?.id
  } catch {}
  if (!sid) {
    const created = await gqlStudents(
      `mutation($uid:String!,$name:String){ createStudent(userId:$uid, displayName:$name){ id } }`,
      { uid: authId, name: user.value.email || user.value.displayName || 'Student' }
    )
    sid = created?.createStudent?.id
  }
  if (!sid) throw new Error('Student profile not found')
  studentId.value = sid
  return sid
}

async function loadCourses(){
  loading.value = true
  try {
    const sid = await resolveStudentId()
    const data = await gqlStudents(`
      query($sid:String!){
        myCourses(studentId:$sid){
          courseId
          enrolledAt
          course { id title category difficulty coverUrl modules { id title lessons { id duration } } }
        }
      }
    `, { sid })
    const baseCourses = data?.myCourses || []

    // Enrich course details if stubbed/null
    const enriched = await Promise.all(
      baseCourses.map(async (c:any) => {
        if (!c.course || c.course.title === 'Course' || !c.course.category || !c.course.modules) {
          const details = await fetchCourseDetails(c.courseId)
          if (details) {
            c.course = { ...details }
          }
        }
        return c
      })
    )
    courses.value = enriched
  } catch (e:any) {
    message.error(e?.message || 'Unable to load courses')
  } finally {
    loading.value = false
  }
}

function openCourse(c:any){
  const sid = studentId.value || 'student'
  const cid = c.courseId
  const mid = 'mod-1' // placeholder module id until real module is selected
  router.push(`/student/${encodeURIComponent(sid)}/course/${encodeURIComponent(cid)}/module/${encodeURIComponent(mid)}`)
}

async function startCourse(c:any){
  startingId.value = c.courseId
  try {
    const sid = await resolveStudentId()
    const moduleId = c.course?.modules?.[0]?.id
    if (moduleId) {
      router.push(`/student/${encodeURIComponent(sid)}/course/${encodeURIComponent(c.courseId)}/module/${encodeURIComponent(moduleId)}`)
    } else {
      router.push(`/course/${encodeURIComponent(c.courseId)}`)
    }
  } catch (e:any) {
    message.error(e?.message || 'Unable to open modules')
  } finally {
    startingId.value = null
  }
}

onMounted(()=>{
  if (!isLoggedIn.value) {
    message.warning('Please sign in to see your courses')
    router.push('/login')
    return
  }
  loadCourses()
})
</script>

<style scoped>
.flex-between { display: flex; justify-content: space-between; align-items: center; }
.course-card { min-height: 240px; display:flex; flex-direction:column; }
.cover {
  height: 110px;
  background-size: cover;
  background-position: center;
  border-radius: 8px;
  position: relative;
}
.badge { position:absolute; left:10px; top:10px; background:#fff; padding:4px 8px; border-radius:6px; font-weight:600; }
.meta { margin: 10px 0 6px; }
.title { font-weight: 700; font-size: 15px; }
.muted { color:#94a3b8; }
</style>
