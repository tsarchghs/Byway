const store:any = globalThis.__byway_reviews || (globalThis.__byway_reviews = {})
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  const item = {
    id: id + '-u' + Date.now(),
    name: 'You',
    avatar: 'https://i.pravatar.cc/100?img=1',
    rating: Number(body?.rating||5),
    comment: String(body?.comment||''),
    title: String(body?.title||''),
    date: Date.now()
  }
  store[id] = [item, ...(store[id]||[])]
  setResponseStatus(event, 201)
  return { ok:true }
})
