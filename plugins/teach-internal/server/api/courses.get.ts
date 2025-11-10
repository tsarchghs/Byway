import { getStore } from './_store'
export default defineEventHandler(async (event) => {
  const { courses } = getStore()
  const items = Object.values(courses)
  return { items }
})
