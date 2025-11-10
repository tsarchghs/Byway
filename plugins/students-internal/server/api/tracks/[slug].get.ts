export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  const map:any = {
    frontend: { name:'Frontend Developer', description:'Master modern UI engineering', courses:[
      { id:'fe-1', title:'HTML & CSS', price:0 },
      { id:'fe-2', title:'Vue Fundamentals', price:0 },
      { id:'fe-3', title:'Advanced Components', price:0 }
    ]},
    backend: { name:'Backend Developer', description:'APIs, databases, services', courses:[
      { id:'be-1', title:'Node & Express', price:0 },
      { id:'be-2', title:'Databases 101', price:0 },
      { id:'be-3', title:'Authentication', price:0 }
    ]},
    data: { name:'Data Analyst', description:'SQL, Python, visualization', courses:[
      { id:'da-1', title:'SQL Basics', price:0 },
      { id:'da-2', title:'Pandas & Charts', price:0 },
      { id:'da-3', title:'Dashboards', price:0 }
    ]}
  }
  const d = map[slug] || { name:'Track', description:'', courses:[] }
  return { slug, ...d }
})
