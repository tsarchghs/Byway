export default defineEventHandler(async (event) => {
  return { items: [
    { slug:'cs-basics', name:'Computer Science Basics', description:'Foundations of CS', courses:[{ id:'cs-1', title:'Algorithms 101', price:0 },{ id:'cs-2', title:'Data Structures', price:0 }] },
    { slug:'ai-track', name:'Applied AI', description:'ML, DL, and LLMs', courses:[{ id:'ai-1', title:'Intro to ML', price:0 },{ id:'ai-2', title:'Neural Networks', price:0 }] }
  ] }
})
