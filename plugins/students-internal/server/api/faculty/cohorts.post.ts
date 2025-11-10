const mem:any = globalThis.__byway_cohorts || (globalThis.__byway_cohorts = [])
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const id = 'coh-' + Date.now()
  mem.push({ id, name: String(body?.name||'Cohort'), students:0, start: Date.now(), status:'Draft' })
  setResponseStatus(event, 201)
  return { id }
})
