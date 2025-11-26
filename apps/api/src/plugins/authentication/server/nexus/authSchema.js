
// Auto-generated minimal Nexus schema for Authentication plugin
import { makeSchema, objectType, stringArg, nonNull, enumType, extendType } from 'nexus'
import jwt from 'jsonwebtoken'
import { prisma } from '../db/client.js'
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret'

const InstitutionUser = objectType({
  name: 'InstitutionUser',
  definition(t) {
    t.nonNull.string('id')
    t.nonNull.string('institutionId')
    t.nonNull.string('userId')
    t.string('role')
  }
})

const User = objectType({
  name: 'User',
  definition(t) {
    t.nonNull.string('id')
    t.string('email')
    t.string('firstName')
    t.string('lastName')
    t.list.field('institutionUsers', {
      type: InstitutionUser,
      async resolve(parent) {
        return prisma.institutionUser.findMany({ where: { userId: parent.id } })
      }
    })
  }
})

const AuthPayload = objectType({
  name: 'AuthPayload',
  definition(t) {
    t.string('token')
    t.field('user', { type: User })
  }
})

const Query = extendType({
  type: 'Query',
  definition(t) {
    t.field('me', {
      type: User,
      async resolve(_root, _args, ctx) {
        const auth = ctx?.req?.headers?.authorization || ''
        const token = auth.replace('Bearer ', '').trim()
        if (!token) return null
        try {
          const decoded = jwt.verify(token, JWT_SECRET)
          const uid = decoded?.id || decoded?.sub
          if (!uid) return null
          return prisma.user.findUnique({ where: { id: uid } })
        } catch {
          return null
        }
      }
    })
  }
})

const Mutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('register', {
      type: 'GqlUser',
      args: {
        email: stringArg(),
        password: stringArg(),
        firstName: stringArg(),
        lastName: stringArg(),
      },
      async resolve(_, args) {
        const existing = await prisma.user.findUnique({ where: { email: args.email } })
        if (existing) throw new Error('User already exists')

        const created = await prisma.user.create({
          data: {
            email: args.email,
            password: args.password, // TODO: hash this
            firstName: args.firstName,
            lastName: args.lastName,
          },
        })
        return created
      },
    })
  },
  definition(t) {
    t.field('loginWithEmail', {
      type: AuthPayload,
      args: {
        email: nonNull(stringArg()),
        password: nonNull(stringArg())
      },
      async resolve(_root, args) {
        const user = await prisma.user.findUnique({ where: { email: args.email } })
        // NOTE: dev-only password compare; replace with real hash compare
        if (!user || (user.password && user.password !== args.password)) {
          throw new Error('Invalid credentials')
        }
        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' })
        return { token, user }
      }
    })
  }
})

export const schema = makeSchema({
  types: [User, InstitutionUser, AuthPayload, Query, Mutation],
  outputs: false
})
