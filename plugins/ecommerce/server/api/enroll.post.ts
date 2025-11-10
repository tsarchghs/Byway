const enrollMem:any = globalThis.__byway_enrollments || (globalThis.__byway_enrollments = [])
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const items = Array.isArray(body?.items) ? body.items : []
  for (const it of items){
    const id = String(it.courseId || it.id)
    if (!enrollMem.find((e:any)=> String(e.id)===id)) enrollMem.push({ id, title: it.title || ('Course '+id), progress: 0 })
  }
  return { ok:true, count: items.length }
})
