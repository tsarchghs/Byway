import { PrismaClient } from "./generated/index.js"

const url = process.env.AUTH_DATABASE_URL || process.env.DATABASE_URL || "mysql://root:gjergji21@localhost:3306/bloggrs_authentication"
export const prisma = new PrismaClient({ datasources: { db: { url } } })
