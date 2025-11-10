export default defineEventHandler(async (event) => {
  const now = Date.now()
  return { items: [
    { id: 'ORD-1001', date: now - 5*86400000, itemsCount: 2, total: 59.98, status: 'Paid' },
    { id: 'ORD-1002', date: now - 15*86400000, itemsCount: 1, total: 29.99, status: 'Paid' }
  ] }
})
