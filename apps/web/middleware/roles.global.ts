// middleware/roles.global.ts
import { useUser } from '~/composables/useUser'
export default defineNuxtRouteMiddleware((to)=>{
  const { hasRole } = useUser() as any
  if (to.path.startsWith('/admin') && !hasRole('admin')) return navigateTo('/')
  if (to.path.startsWith('/faculty-admin') && !(hasRole('instructor') || hasRole('admin'))) return navigateTo('/teach')
})
