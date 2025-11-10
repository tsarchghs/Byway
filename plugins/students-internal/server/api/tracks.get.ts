export default defineEventHandler(async (event) => {
  return { items: [
    { slug:'frontend', name:'Frontend Developer', description:'Master modern UI engineering', courses:[{ id:'fe-1', title:'HTML & CSS', price:0 },{ id:'fe-2', title:'Vue Fundamentals', price:0 }] },
    { slug:'backend', name:'Backend Developer', description:'APIs, databases, services', courses:[{ id:'be-1', title:'Node & Express', price:0 },{ id:'be-2', title:'Databases 101', price:0 }] },
    { slug:'data', name:'Data Analyst', description:'SQL, Python, visualization', courses:[{ id:'da-1', title:'SQL Basics', price:0 },{ id:'da-2', title:'Pandas & Charts', price:0 }] }
  ] }
})
