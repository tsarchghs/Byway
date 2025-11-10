export default defineEventHandler(async (event) => {
  return { items: [
    { id:'e1', student:'Demo Student', course:'Vue Fundamentals', progress: 45 },
    { id:'e2', student:'Alex M', course:'Node & Express', progress: 70 }
  ] }
})
