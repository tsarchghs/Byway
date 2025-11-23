<template>
  <main class="institutions-role-portal">
    <header class="institutions-role-portal__intro">
      <p class="eyebrow">Institutions Portal</p>
      <h1>Role-aware campus cockpit</h1>
      <p>
        Toggle between student, teacher, and administration journeys to preview the shared UI
        experience that powers the institution portal. Each view carries its own metrics, focus
        areas, and recommended actions.
      </p>
      <a-menu mode="horizontal" :selectedKeys="['overview']" style="margin-top:12px">
        <a-menu-item key="overview"><a :href="navHref('overview')">Overview</a></a-menu-item>
        <a-menu-item v-if="activeRole==='administration'" key="departments"><a :href="navHref('departments')">Departments</a></a-menu-item>
        <a-menu-item key="classrooms"><a :href="navHref('classrooms')">Classrooms</a></a-menu-item>
        <a-menu-item key="people"><a :href="navHref('people')">People Directory</a></a-menu-item>
        <a-menu-item key="catalog"><a :href="navHref('catalog')">Catalog</a></a-menu-item>
        <a-menu-item key="calendar"><a :href="navHref('calendar')">Calendar</a></a-menu-item>
        <a-menu-item key="assignments"><a :href="navHref('assignments')">Assignments</a></a-menu-item>
      </a-menu>
    </header>

    <RolePortal :role="activeRole" @role-change="handleRoleChange" />
  </main>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue'
import { useRoute, useRouter, useRuntimeConfig } from 'nuxt/app'
import RolePortal from '../../../../../packages/shared-ui/src/components/role-portals/RolePortal.vue'
import type { PortalRole } from '../../../../../packages/shared-ui/src/components/role-portals/portalContent'

const allowedRoles: PortalRole[] = ['student', 'teacher', 'administration']
const fallbackRole: PortalRole = 'student'

const route = useRoute()
const router = useRouter()
const runtime = useRuntimeConfig()
const apiBase = runtime.public?.apiBase || runtime.public?.appBaseUrl || ''

const resolveRole = (value: unknown): PortalRole => {
  if (Array.isArray(value)) return resolveRole(value[0])
  if (typeof value === 'string' && allowedRoles.includes(value as PortalRole)) {
    return value as PortalRole
  }
  return fallbackRole
}

const syncRoleFromRoute = (value: unknown) => {
  const resolved = resolveRole(value)
  if (resolved !== activeRole.value) {
    activeRole.value = resolved
  }
}

const activeRole = ref<PortalRole>(resolveRole(route.query.role ?? route.params?.role))

watch(
  () => route.query.role,
  (value) => syncRoleFromRoute(value),
)

watch(
  () => (route.params?.role as unknown),
  (value) => syncRoleFromRoute(value),
)

const handleRoleChange = (next: PortalRole) => {
  if (next === activeRole.value) return
  activeRole.value = next

  if (import.meta.client) {
    router.replace({
      path: route.path,
      query: {
        ...route.query,
        role: next,
      },
    })
  }
}

const institutionId = computed(() => (route.query.institutionId as string) || 'inst_byway')
function navHref(key: string) {
  const qs = `?institutionId=${encodeURIComponent(institutionId.value)}`
  if (key==='overview') return `/institution/portal${qs}`
  if (key==='departments') return `/institution/departments/${qs}`
  if (key==='classrooms') return `/institution/classrooms/${qs}`
  if (key==='people') return `/institution/people${qs}`
  if (key==='catalog') return `/institution/catalog${qs}`
  if (key==='calendar') return `/institution/calendar${qs}`
  if (key==='assignments') return `/institution/assignments/teachers${qs}`
  return `/institution/portal${qs}`
}

const currentRole = ref<'student' | 'teacher' | 'admin' | 'none'>('none')
const meId = ref<string | null>(null)

function resolveAuthHeader(): string | null {
  if (typeof window === 'undefined') return null
  const rawToken = localStorage.getItem('token') || localStorage.getItem('access_token') || ''
  if (!rawToken) return null
  return rawToken.startsWith('Bearer') ? rawToken : `Bearer ${rawToken}`
}

async function resolveCurrentRole() {
  try {
    const auth = resolveAuthHeader()
    if (!auth) { currentRole.value = 'none'; return }
    const baseUrl = apiBase ? apiBase.replace(/\/$/, '') : ''
    const meResp = await fetch(`${baseUrl}/api/authentication/graphql`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', Authorization: auth },
      body: JSON.stringify({ query: `query Me { me { id } }` }),
    })
    const meJson = await meResp.json().catch(() => null)
    const uid = meJson?.data?.me?.id || null
    meId.value = uid
    if (!uid) { currentRole.value = 'none'; return }
    const resp = await fetch(`${baseUrl}/api/institutions/graphql`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', Authorization: auth },
      body: JSON.stringify({
        query: `query($institutionId:String!){ members(institutionId:$institutionId){ userId role } }`,
        variables: { institutionId: institutionId.value },
      }),
    })
    const json = await resp.json().catch(() => null)
    const arr = Array.isArray(json?.data?.members) ? json.data.members : []
    const mem = arr.find((m: any) => m.userId === uid)
    const role = String(mem?.role || '').toLowerCase()
    if (role.includes('admin')) currentRole.value = 'admin'
    else if (role.includes('teach')) currentRole.value = 'teacher'
    else if (role.includes('student')) currentRole.value = 'student'
    else currentRole.value = 'none'
  } catch {
    currentRole.value = 'none'
  }
}

watch(currentRole, (r) => {
  if (r === 'none') {
    router.replace({ path: '/institution/join' })
  } else if (r === 'student') {
    router.replace({ path: `/institution/student_mode/${institutionId.value}` })
  } else if (r === 'teacher' || r === 'admin') {
    router.replace({ path: '/institution/portal', query: { institutionId: institutionId.value } })
  }
})

onMounted(() => {
  resolveCurrentRole()
})
</script>

<style scoped>
.institutions-role-portal {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.institutions-role-portal__intro {
  background: #ffffff;
  border-radius: 1.5rem;
  border: 1px solid #e0e7ff;
  padding: 1.5rem;
  box-shadow: 0 20px 40px rgba(79, 70, 229, 0.08);
}

.institutions-role-portal__intro h1 {
  margin: 0.35rem 0;
  font-size: 2rem;
  color: #0f172a;
}

.institutions-role-portal__intro p {
  margin: 0.35rem 0 0;
  color: #475569;
}

.eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.35rem;
  font-size: 0.8rem;
  color: #818cf8;
  margin: 0;
}
</style>
