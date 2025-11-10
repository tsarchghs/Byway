const qadb:any = globalThis.__byway_qa || (globalThis.__byway_qa = {})
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  const item = { id: 'q' + Date.now(), author:'You', text: String(body?.text||''), date: Date.now() }
  qadb[id] = [...(qadb[id]||[]), item]
  setResponseStatus(event, 201)
  return { ok:true }
})
