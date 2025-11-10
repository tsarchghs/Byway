const qadb:any = globalThis.__byway_qa || (globalThis.__byway_qa = {})
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const items = qadb[id] || []
  return { items }
})
