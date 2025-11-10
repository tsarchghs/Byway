// composables/useLessons.ts
import { ref, computed } from 'vue'
export function useLessons(courseId: string){
  const lessons = ref<any[]>([])
  const activeIndex = ref<number>(0)
  function initFromCourse(course:any){
    const flat:any[] = []
    for (const sec of (course?.sections || [])){
      for (const it of (sec.items || [])){
        flat.push({ id: it.id || `${sec.title}-${it.title}`, title: it.title, description: it.description, videoUrl: it.videoUrl })
      }
    }
    if (flat.length===0) flat.push({ id:'l1', title:'Welcome', description:'', videoUrl:'' })
    lessons.value = flat; activeIndex.value = 0
  }
  function setActive(i:number){ if (i>=0 && i<lessons.value.length) activeIndex.value = i }
  const current = computed(()=> lessons.value[activeIndex.value])
  const prev = computed(()=> activeIndex.value>0 ? activeIndex.value-1 : null)
  const next = computed(()=> activeIndex.value<lessons.value.length-1 ? activeIndex.value+1 : null)
  const progress = computed(()=> Math.round(((activeIndex.value+1)/Math.max(lessons.value.length,1))*100))
  return { lessons, activeIndex, current, prev, next, initFromCourse, setActive, progress }
}
