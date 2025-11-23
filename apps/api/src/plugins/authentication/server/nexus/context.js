import jwt from "jsonwebtoken"
import { prisma } from "../db/client.js"
import { resolveUser } from "../permissions.mjs"
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret"

export async function createContext({ req }) {
  const auth = req.headers.authorization || ""
  if (auth.startsWith("Bearer ")) {
    try {
      const decoded = jwt.verify(auth.replace("Bearer ", ""), JWT_SECRET)
      const user = await resolveUser(req).catch(() => null)
      return { userId: decoded.userId, req, user, prisma }
    } catch {
      // fallthrough to resolveUser below
    }
  }
  const user = await resolveUser(req).catch(() => null)
  const userId = user?.id || undefined
  return { userId, req, user, prisma }
}
