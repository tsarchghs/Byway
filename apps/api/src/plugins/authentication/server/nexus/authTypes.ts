import { objectType, extendType, stringArg, nonNull } from "nexus"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { prisma } from "../db/client.js"

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret"


export const GqlUser = objectType({
  name: "AuthPayload",
  definition(t) {
    t.nonNull.string("token")
    t.nonNull.field("user", { type: "GqlUser" })
  },
})
import { objectType, list } from 'nexus'

export const User = objectType({
  name: 'GqlUser',
  definition(t) {
    t.nonNull.id('id')
    t.nonNull.string('email')
    t.string('firstName')
    t.string('displayName')
    t.string('token')
    t.nullable.string('teacherProfileId')
    t.string('lastName')
    t.string('role', {
      description: 'Primary role such as student, teacher, admin',
      resolve: (user) => (user as any).role || null,
    })
    t.nonNull.string('createdAt')
    t.nonNull.string('updatedAt')

    // 👇 Add roles field (array of strings)
    t.list.string('roles', {
      description: 'List of user roles such as student, teacher, admin, etc.',
      resolve: async (user, _args, ctx) => {
        // Try to resolve roles from your DB or context
        if (user.roles) return user.roles // already present on the user object
        const derivedRoles = []
        if ((user as any).role) derivedRoles.push((user as any).role)
        if ((user as any).teacherProfileId) derivedRoles.push('teacher')
        if (ctx.prisma?.userRole) {
          const roleRecords = await ctx.prisma.userRole.findMany({ where: { userId: user.id } })
          derivedRoles.push(...roleRecords.map((r) => r.name))
        }
        return Array.from(new Set(derivedRoles.filter(Boolean)))
      },
    })
  },
})


export const AuthQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("me", {
      type: "GqlUser",
      async resolve(_, __, ctx) {
        console.log({ctx},4)
      },
    })
  },
})

export const AuthMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.field("register", {
      type: "GqlUser",
      args: {
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
        firstName: stringArg(),
        lastName: stringArg(),
      },
      async resolve(_, args) {
        const existing = await prisma.user.findUnique({ where: { email: args.email } })
        if (existing) throw new Error("Email is already registered")

        const hashed = await bcrypt.hash(args.password, 10)
        const user = await prisma.user.create({
          data: {
            email: args.email,
            password: hashed,
            firstName: args.firstName,
            lastName: args.lastName,
          },
        })
        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" })
        return { ...user, token }
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

    t.field("updateUserTeacherProfile", {
      type: "GqlUser",
      args: {
        teacherProfileId: nonNull(stringArg()),
      },
      async resolve(_, { teacherProfileId }, ctx) {
        if (!ctx.userId) throw new Error("Not authenticated")
        return prisma.user.update({
          where: { id: ctx.userId },
          data: { teacherProfileId },
        })
      },
    })
  },
})
