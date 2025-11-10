const mem:any = globalThis.__byway_progress || (globalThis.__byway_progress = {})
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { courseId, lessonId, total } = body || {}
  if (!courseId || !lessonId) return { ok:false }
  const existing = mem[courseId] || { completed: [], percent: 0 }
  if (!existing.completed.includes(lessonId)) existing.completed.push(lessonId)
  existing.percent = Math.min(100, Math.round((existing.completed.length / Math.max(total||existing.completed.length,1))*100))
  mem[courseId] = existing
  return { ok:true, ...existing }
})
