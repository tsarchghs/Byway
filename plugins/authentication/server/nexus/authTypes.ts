import { objectType, extendType, stringArg, nonNull } from "nexus"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { prisma } from "../db/client.js"

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret"


export const AuthPayload = objectType({
  name: "AuthPayload",
  definition(t) {
    t.nonNull.string("token")
    t.nonNull.field("user", { type: "User" })
  },
})

export const User = objectType({
  name: "User",
  definition(t) {
    t.nonNull.id("id")
    t.nonNull.string("email")
    t.string("firstName")
    t.string("lastName")
    t.nonNull.string("createdAt")
    t.nonNull.string("updatedAt")
  },
})

export const AuthQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("me", {
      type: "User",
      async resolve(_, __, ctx) {
        if (!ctx.userId) throw new Error("Not authenticated")
        return prisma.user.findUnique({ where: { id: ctx.userId } })
      },
    })
  },
})

export const AuthMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("register", {
      type: "User",
      args: {
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
        firstName: stringArg(),
        lastName: stringArg(),
      },
      async resolve(_, args) {
        // ✅ check if email already exists
        const existing = await prisma.user.findUnique({ where: { email: args.email } })
        if (existing) {
          throw new Error("Email is already registered")
        }

        const hashed = await bcrypt.hash(args.password, 10)
        return prisma.user.create({
          data: {
            email: args.email,
            password: hashed,
            firstName: args.firstName,
            lastName: args.lastName,
          },
        })
      },
    })

    t.field("login", {
      type: "AuthPayload",
      args: {
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      async resolve(_, { email, password }) {
        const user = await prisma.user.findUnique({ where: { email } })
        if (!user) throw new Error("User not found")

        const valid = await bcrypt.compare(password, user.password)
        if (!valid) throw new Error("Invalid password")

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" })

        return { token, user }
      },
    })
  },
})
