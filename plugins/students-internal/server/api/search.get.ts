export default defineEventHandler(async (event) => {
  const q = (getQuery(event).q || '').toString().toLowerCase()
  // In a real setup, query DB or forward to GraphQL
  const items = Array.from({length:12}).map((_,i)=> ({ id:'sr-'+(i+1), title:`Search result ${(i+1)} ${q?'- '+q:''}`, price:(i%4+1)*14.99 }))
  return { items }
})
