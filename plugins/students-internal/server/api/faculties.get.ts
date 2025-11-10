export default defineEventHandler(async (event) => {
  return { items: [
    { slug:'engineering', name:'Engineering Faculty', description:'Software, data, systems' },
    { slug:'design', name:'Design Faculty', description:'UX, UI, product' },
    { slug:'business', name:'Business Faculty', description:'Marketing, strategy, ops' }
  ] }
})
