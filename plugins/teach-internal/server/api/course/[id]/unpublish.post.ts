import { getStore } from '../../_store'
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const { courses } = getStore()
  if (!courses[id]) courses[id] = { id, title:'Untitled', sections: [], price:0 }
  courses[id].published = false
  return { ok:true, published: false }
})
