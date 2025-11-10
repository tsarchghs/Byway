// composables/useMode.ts
import { ref, computed } from 'vue'

type Mode = 'coursera' | 'lms'
const _mode = ref<Mode>('coursera')

function load(){
  if (process.client){
    const saved = localStorage.getItem('byway_mode') as Mode | null
    if (saved === 'coursera' || saved === 'lms') _mode.value = saved
  }
}
load()

export function useMode(){
  function setMode(m: Mode){
    _mode.value = m
    if (process.client) localStorage.setItem('byway_mode', m)
  }
  const isCoursera = computed(()=> _mode.value === 'coursera')
  const isLms = computed(()=> _mode.value === 'lms')
  return { mode: _mode, setMode, isCoursera, isLms }
}
