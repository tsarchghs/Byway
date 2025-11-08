// plugins/students-internal/server/context.ts
import jwt from 'jsonwebtoken'
import { PrismaClient } from '../../students-internal/server/db/generated/client/index.js'

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret'

export async function createContext({ req }: any) {
  const auth = req.headers.authorization || ''
  const token = auth.replace('Bearer ', '').trim()

  let user = null
  if (token) {
    try {
      user = jwt.verify(token, JWT_SECRET)
    } catch {
      console.warn('[students-internal] invalid JWT')
    }
  }

  return { req, prisma, user, token }
}

export type Context = Awaited<ReturnType<typeof createContext>>
