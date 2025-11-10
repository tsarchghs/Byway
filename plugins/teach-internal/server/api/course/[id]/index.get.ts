import { getStore } from '../../_store'
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const { courses } = getStore()
  return courses[id] || { id, title:'', subtitle:'', category:'', price:0, sections: [] }
})
