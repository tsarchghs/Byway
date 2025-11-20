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
    </header>

    <RolePortal :role="activeRole" @role-change="handleRoleChange" />
  </main>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'nuxt/app'
import RolePortal from '../../../../../packages/shared-ui/src/components/role-portals/RolePortal.vue'
import type { PortalRole } from '../../../../../packages/shared-ui/src/components/role-portals/portalContent'

const allowedRoles: PortalRole[] = ['student', 'teacher', 'administration']
const fallbackRole: PortalRole = 'student'

const route = useRoute()
const router = useRouter()

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
