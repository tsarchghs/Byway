// composables/useEnrollments.ts
import { ref } from 'vue'
const _items = ref<any[]>([])
if (process.client){
  try{ _items.value = JSON.parse(localStorage.getItem('byway_enrollments') || '[]') }catch{ _items.value=[] }
}
export function useEnrollments(){
  function isEnrolled(courseId: string){ return _items.value.some(e=> String(e.id) === String(courseId)) }
  function addLocal(course:any){
    if (!isEnrolled(course.id)){
      _items.value.push({ id: course.id, title: course.title, progress: 0 })
      if (process.client) localStorage.setItem('byway_enrollments', JSON.stringify(_items.value))
    }
  }
  return { items: _items, isEnrolled, addLocal }
}
