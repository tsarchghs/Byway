// middleware/home-redirect.global.ts
import { useMode } from '~/composables/useMode'
export default defineNuxtRouteMiddleware((to) => {
  if (to.path !== '/') return
  const { isCoursera, isLms } = useMode()
  if (isCoursera.value) return navigateTo('/explore')
  if (isLms.value) return navigateTo('/faculties')
})
