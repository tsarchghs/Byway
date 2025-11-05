import jwt from "jsonwebtoken"
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret"

export function createContext({ req }) {
  const auth = req.headers.authorization || ""
  if (auth.startsWith("Bearer ")) {
    try {
      const decoded = jwt.verify(auth.replace("Bearer ", ""), JWT_SECRET)
      return { userId: decoded.userId }
    } catch {
      return {}
    }
  }
  return {}
}
