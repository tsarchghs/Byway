export default defineEventHandler(async (event) => {
  const ids = (getQuery(event).ids || '').toString().split(',').map((s:any)=> s.trim()).filter(Boolean)
  const mk = (id:string, i:number)=> ({ id, title:`Course ${id}`, category:['Programming','Design','Data','Business'][i%4], price:(i%4+1)*19.99, lessons: 10 + i*2, level: ['Beginner','Intermediate','Advanced'][i%3], rating: (3.5 + (i%15)/10).toFixed(1) })
  return { items: ids.map((id, i)=> mk(id, i)) }
})
