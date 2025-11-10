import { getStore } from '../../_store'
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  const { courses } = getStore()
  courses[id] = { ...courses[id], ...body, id }
  return { ok: true }
})
