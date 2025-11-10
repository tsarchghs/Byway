const enrollMem:any = globalThis.__byway_enrollments || (globalThis.__byway_enrollments = [])
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const items = Array.isArray(body?.items) ? body.items : []
  const conflicts = items.filter((it:any)=> enrollMem.find((e:any)=> String(e.id)===String(it.courseId||it.id)))
  return { ok: conflicts.length===0, conflicts: conflicts.map((c:any)=> c.courseId||c.id) }
})
