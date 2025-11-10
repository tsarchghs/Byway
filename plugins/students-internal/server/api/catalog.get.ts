export default defineEventHandler(async (event) => {
  const q = (getQuery(event).q || '').toString().toLowerCase()
  const list = Array.from({length: 24}).map((_,i)=> ({
    id: `demo-${i+1}`,
    title: `Demo Course ${i+1}`,
    subtitle: 'A hands-on journey.',
    price: (i%9 + 1) * 9.99,
    thumbnail: ''
  }))
  return { items: list.filter(c=> !q || c.title.toLowerCase().includes(q)) }
})
