
// packages/shared-ui/nuxt/middleware/role.ts
export default defineNuxtRouteMiddleware((to) => {
  // Soft UI guard only: do not block, just hint and reroute politely for guests.
  if (process.server) return
  try {
    const role = ((null /* was null;
    const isGuest = !(null /* was null;
    const needsTeacher = to.path.startsWith('/teach') || to.path.startsWith('/institutions')
    if (isGuest && needsTeacher) {
      return navigateTo('/auth/login')
    }
    if (role === 'student' && to.path.startsWith('/teach')) {
      return navigateTo('/dashboard')
    }
  } catch {}
})
