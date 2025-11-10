export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  return {
    id,
    title: `Demo Course ${id}`,
    subtitle: 'Hands-on demo course',
    price: 49.99,
    category: 'Programming',
    thumbnail: '',
    bullets: ['Build real projects','Master fundamentals','Get job-ready skills'],
    sections: [
      { title:'Introduction', items:[{ id:'l1', title:'Welcome', duration:'3m', preview:true }, { id:'l2', title:'Setup', duration:'8m' }]},
      { title:'Core Concepts', items:[{ id:'l3', title:'State management', duration:'14m' }, { id:'l4', title:'Routing', duration:'10m' }]}
    ]
  }
})
