export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  const map:any = { engineering:'Engineering Faculty', design:'Design Faculty', business:'Business Faculty' }
  const name = map[slug] || 'Faculty'
  return {
    slug, name, description: 'Cohort-based instruction and curated tracks.',
    courses: Array.from({length: 6}).map((_,i)=> ({
      id: `${slug}-course-${i+1}`, title: `${name} Course ${i+1}`, subtitle:'Faculty course', price: (i%4+1)*19.99
    }))
  }
})
