export default defineEventHandler(async (event) => {
  return { ok:true, prisma:true, graphql:true, rest:true, time: Date.now() }
})
