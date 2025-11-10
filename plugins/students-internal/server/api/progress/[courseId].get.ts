const mem:any = globalThis.__byway_progress || (globalThis.__byway_progress = {})
export default defineEventHandler(async (event) => {
  const courseId = getRouterParam(event, 'courseId')
  return mem[courseId] || { completed: [], percent: 0 }
})
