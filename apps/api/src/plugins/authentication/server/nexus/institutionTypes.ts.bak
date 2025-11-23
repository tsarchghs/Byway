import { objectType, extendType, nonNull, stringArg } from 'nexus'

export const GqlInstitution = objectType({
  name: 'GqlInstitution',
  definition(t) {
    t.string('id')
    t.string('name')
    t.nullable.string('domain')
    t.nullable.string('logoUrl')
    t.field('createdAt', { type: 'DateTime' })
    t.field('updatedAt', { type: 'DateTime' })
  },
})

export const GqlInstitutionUser = objectType({
  name: 'GqlInstitutionUser',
  definition(t) {
    t.string('id')
    t.string('userId')
    t.string('institutionId')
    t.string('role')
    t.field('createdAt', { type: 'DateTime' })
    t.field('updatedAt', { type: 'DateTime' })
  },
})

export const InstitutionQuery = extendType({
  type: 'Query',
  definition(t) {
    t.list.field('institutions', {
      type: 'GqlInstitution',
      resolve: (_root, _args, ctx) => ctx.prisma.institution.findMany({
        orderBy: { name: 'asc' },
      }),
    })
  },
})

export const InstitutionMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createInstitution', {
      type: 'GqlInstitution',
      args: {
        name: nonNull(stringArg()),
        domain: stringArg(),
        logoUrl: stringArg(),
      },
      resolve: (_root, args, ctx) => ctx.prisma.institution.create({
        data: { name: args.name, domain: args.domain ?? null, logoUrl: args.logoUrl ?? null } as any,
      }),
    })
    t.field('linkInstitutionUser', {
      type: 'GqlInstitutionUser',
      args: {
        userId: nonNull(stringArg()),
        institutionId: nonNull(stringArg()),
        role: nonNull(stringArg()),
      },
      resolve: (_root, args, ctx) => ctx.prisma.institutionUser.create({
        data: { userId: args.userId, institutionId: args.institutionId, role: args.role } as any,
      }),
    })
  },
})

export const InstitutionRolesQuery = extendType({
  type: 'Query',
  definition(t) {
    t.list.field('institutionRoles', {
      type: 'GqlInstitutionUser',
      args: { userId: nonNull(stringArg()) },
      resolve: (_root, args, ctx) => ctx.prisma.institutionUser.findMany({ where: { userId: args.userId } })
    })
    t.field('hasRole', {
      type: 'Boolean',
      args: { userId: nonNull(stringArg()), institutionId: nonNull(stringArg()), role: nonNull(stringArg()) },
      async resolve(_root, args, ctx) {
        const hit = await ctx.prisma.institutionUser.findFirst({ where: { userId: args.userId, institutionId: args.institutionId, role: args.role } })
        return !!hit
      }
    })
  }
})

export const InstitutionBySlugQuery = extendType({
  type: 'Query',
  definition(t) {
    t.field('institutionBySlug', {
      type: 'GqlInstitution',
      args: { slug: nonNull(stringArg()) },
      resolve: (_root, args, ctx) => ctx.prisma.institution.findFirst({ where: { domain: args.slug } })
    })
  }
})
