const store:any = globalThis.__byway_reviews || (globalThis.__byway_reviews = {})
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const now = Date.now()
  const names = ['Alex','Mira','John','Sara','Lea','Mark','Elliot','Tara']
  const sample = Array.from({length: 8}).map((_,i)=> ({
    id: `${id}-r${i+1}`,
    name: names[i%names.length],
    avatar: `https://i.pravatar.cc/100?img=${(i%70)+1}`,
    rating: 3 + (i%3),
    comment: 'Great course with practical examples.',
    date: now - i*86400000
  }))
  const mem = store[id] || []
  return { items: [...mem, ...sample] }
})
