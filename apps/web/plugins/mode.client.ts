// plugins/mode.client.ts
import { useMode } from '~/composables/useMode'
export default defineNuxtPlugin(()=>{
  // Ensure mode loaded on client bootstrap
  useMode()
})
