
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret'

export function createContext({ req }) {
  const auth = req.headers.authorization || ''
  const token = auth.replace('Bearer ', '').trim()
  let user = null
  if (token) {
    try { user = jwt.verify(token, JWT_SECRET) } catch {}
  }
  return { req, user }
}
