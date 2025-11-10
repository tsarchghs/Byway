// middleware/mode.global.ts
import { useMode } from '~/composables/useMode'
export default defineNuxtRouteMiddleware((to)=>{
  const { setMode } = useMode()
  const m = String(to.query.mode || '')
  if (m === 'coursera' || m === 'lms'){
    setMode(m as any)
  }
})
