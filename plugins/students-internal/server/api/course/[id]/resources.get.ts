export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  return { items: [
    { id:'r1', title:'Syllabus PDF', kind:'pdf', url:`/plugins/students-internal/public/${id}-syllabus.pdf` },
    { id:'r2', title:'Starter repository', kind:'repo', url:'https://github.com/example/repo' },
    { id:'r3', title:'Slides', kind:'slides', url:'https://example.com/slides' }
  ]}
})
