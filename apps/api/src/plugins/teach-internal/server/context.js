import jwt from "jsonwebtoken"
import prisma from "./db/generated/client/index.js"
import { resolveUser } from "./permissions.mjs"

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret"

export async function createContext({ req }) {
  const auth = req.headers.authorization || ""
  const token = auth.replace("Bearer ", "").trim()
  let user = null

  try {
    user = jwt.verify(token, JWT_SECRET)
  } catch {
    // skip invalid
  }

  if (!user) {
    try { user = await resolveUser(req) } catch {}
  }

  return {
    req,
    prisma,
    user,
    token, // 👈 very important
  }
}
