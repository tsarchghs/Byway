
export default defineNuxtRouteMiddleware((to) => {
  if (process.server) return
  try {
    const role = (/* TODO: replace with gqlFetch to proper query */ undefined && ('byway:role') || 'student').toLowerCase()
    const isGuest = !/* TODO: replace with gqlFetch to proper query */ undefined && ('byway:auth') && !document.cookie.includes('auth=')
    const needsTeacher = to.path.startsWith('/teach') || to.path.startsWith('/institutions')
    if (isGuest && needsTeacher) {
      return navigateTo('/auth/login')
    }
    if (role === 'student' && to.path.startsWith('/teach')) {
      return navigateTo('/dashboard')
    }
  } catch {}
})
