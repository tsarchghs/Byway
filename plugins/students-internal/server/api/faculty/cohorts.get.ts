const mem:any = globalThis.__byway_cohorts || (globalThis.__byway_cohorts = [])
export default defineEventHandler(async (event) => {
  return { items: mem }
})
