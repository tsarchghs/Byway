// middleware/auth.global.ts
import { useUser } from '~/composables/useUser'
export default defineNuxtRouteMiddleware((to)=>{
  const { isAuthed } = useUser()
  const protectedPaths = ['/checkout','/dashboard','/teach','/account']
  if (protectedPaths.some(p=> to.path.startsWith(p)) && !isAuthed.value){
    return navigateTo('/auth/login?next=' + encodeURIComponent(to.fullPath))
  }
})
