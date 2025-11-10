export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  const map:any = {
    'cs-basics': { name:'Computer Science Basics', description:'Foundations of CS', courses:[{ id:'cs-1', title:'Algorithms 101', price:0 },{ id:'cs-2', title:'Data Structures', price:0 }] },
    'ai-track': { name:'Applied AI', description:'ML, DL, and LLMs', courses:[{ id:'ai-1', title:'Intro to ML', price:0 },{ id:'ai-2', title:'Neural Networks', price:0 }] }
  }
  const d = map[slug] || { name:'Program', description:'', courses:[] }
  return { slug, ...d }
})
