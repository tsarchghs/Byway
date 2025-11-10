export default defineEventHandler(async (event) => {
  return { items: [
    { slug:'programming', name:'Programming', description:'Web, mobile, game dev' },
    { slug:'design', name:'Design', description:'UX, UI, product' },
    { slug:'data', name:'Data', description:'Analytics, ML, viz' },
    { slug:'business', name:'Business', description:'Marketing, ops, strategy' }
  ] }
})
