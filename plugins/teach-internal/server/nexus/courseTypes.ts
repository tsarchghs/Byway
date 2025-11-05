import { objectType, extendType, stringArg, floatArg, nonNull } from 'nexus'

export const Course = objectType({
  name: 'Course',
  definition(t) {
t.field('course', {
  type: 'Course',
  args: { id: nonNull(stringArg()) },
  async resolve(_, { id }, ctx) {
    const course = await ctx.prisma.course.findUnique({
      where: { id },
      include: {
        modules: {
          include: {
            lessons: true, // ✅ always populate lessons array
          },
        },
      },
    })

    return course
  },
})

    t.string('id')
    t.string('teacherId')
    t.string('title')
    t.string('category')
    t.string('difficulty')
    t.string('description')
    t.float('price')
    t.float('discount')
    t.nullable.string('coverUrl') 
   t.list.field('modules', { type: 'Module' })   
    t.field('createdAt', { type: 'DateTime' })
    t.field('updatedAt', { type: 'DateTime' })
  },
})

export const CourseQuery = extendType({
  type: 'Query',
  definition(t) {
    t.list.field('courses', {
      type: 'Course',
      resolve: (_, __, ctx) => ctx.prisma.course.findMany({ include: { modules: true } }),
    })

    t.field('course', {
      type: 'Course',
      args: { id: nonNull(stringArg()) },
async resolve(_, { id }, ctx) {
        return await ctx.prisma.course.findUnique({
          where: { id },
          include: {
            modules: true, // Module resolver will handle lessons
          },
        })
      }
    })
  },
})

export const CourseMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createCourse', {
      type: 'Course',
      args: {
        teacherId: nonNull(stringArg()),
        title: nonNull(stringArg()),
        category: stringArg(),
        difficulty: stringArg(),
        description: stringArg(),
        price: floatArg(),
        discount: floatArg(),
        coverUrl: stringArg(),
      },
      resolve: (_, args, ctx) => ctx.prisma.course.create({ data: args }),
    })

    t.field('updateCourse', {
      type: 'Course',
      args: {
        id: nonNull(stringArg()),
        title: stringArg(),
        category: stringArg(),
        difficulty: stringArg(),
        description: stringArg(),
        price: floatArg(),
        discount: floatArg(),
        coverUrl: stringArg(),
      },
      resolve: (_, { id, ...data }, ctx) =>
        ctx.prisma.course.update({ where: { id }, data }),
    })

    t.field('deleteCourse', {
      type: 'Course',
      args: { id: nonNull(stringArg()) },
      resolve: (_, { id }, ctx) =>
        ctx.prisma.course.delete({ where: { id } }),
    })
  },
})
