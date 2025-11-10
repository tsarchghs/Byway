import { getStore } from './_store'
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const id = String(Date.now())
  const course = { id, title: body?.title || 'Untitled', subtitle: body?.subtitle || '', category: body?.category || '', price: Number(body?.price||0), sections: [], published: false }
  const { courses } = getStore()
  courses[id] = course
  setResponseStatus(event, 201)
  return { id }
})
