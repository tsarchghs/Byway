const enrollMem:any = globalThis.__byway_enrollments || (globalThis.__byway_enrollments = [])
export default defineEventHandler(async (event) => {
  const courseId = getRouterParam(event, 'courseId')
  const enrolled = !!enrollMem.find((e:any)=> String(e.id)===String(courseId))
  return { enrolled }
})
