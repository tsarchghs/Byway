
import { prisma } from '../db/client.js'

export const resolvers = {
  Query: {
    async kvGet(_root, { key, session }, ctx) {
      const userId = ctx.user?.id || null
      const where = userId ? { userId, key } : { sessionId: session || null, key }
      const row = await prisma.userKV.findFirst({ where })
      return row?.value || null
    },
  },
  Mutation: {
    async kvSet(_root, { key, value, session }, ctx) {
      const userId = ctx.user?.id || null
      if (userId) {
        await prisma.userKV.upsert({
          where: { userId_key: { userId, key } } as any,
          update: { value },
          create: { userId, key, value },
        })
      } else {
        const sid = session || null
        const existing = await prisma.userKV.findFirst({ where: { sessionId: sid, key } })
        if (existing) await prisma.userKV.update({ where: { id: existing.id }, data: { value } })
        else await prisma.userKV.create({ data: { sessionId: sid, key, value } })
      }
      return true
    },
    async kvDelete(_root, { key, session }, ctx) {
      const userId = ctx.user?.id || null
      if (userId) {
        await prisma.userKV.deleteMany({ where: { userId, key } })
      } else {
        await prisma.userKV.deleteMany({ where: { sessionId: session || null, key } })
      }
      return true
    },
    async kvClear(_root, { session }, ctx) {
      const userId = ctx.user?.id || null
      if (userId) {
        await prisma.userKV.deleteMany({ where: { userId } })
      } else {
        await prisma.userKV.deleteMany({ where: { sessionId: session || null } })
      }
      return true
    }
  }
}
