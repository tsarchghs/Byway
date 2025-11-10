const enrollMem:any = globalThis.__byway_enrollments || (globalThis.__byway_enrollments = [])
export default defineEventHandler(async (event) => {
  // Merge demo with memory
  const demo = [{ id:'demo-1', title:'Demo Course 1', progress:20 }, { id:'demo-2', title:'Demo Course 2', progress:80 }]
  const ids = new Set(enrollMem.map((x:any)=> String(x.id)))
  const merged = [...enrollMem, ...demo.filter(d=> !ids.has(String(d.id)))]
  return { items: merged }
})
