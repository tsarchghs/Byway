import { objectType, extendType, nonNull, stringArg, floatArg } from 'nexus'
import { canUser, resolveInstitutionRole } from '../permissions.mjs'

export const GqlAssignment = objectType({
  name: 'GqlAssignment',
  definition(t) {
    t.string('id')
    t.string('classroomId')
    t.string('title')
    t.string('description')
    t.field('dueDate', { type: 'DateTime' })
    t.field('createdAt', { type: 'DateTime' })
    t.field('updatedAt', { type: 'DateTime' })
  },
})

export const GqlSubmission = objectType({
  name: 'GqlSubmission',
  definition(t) {
    t.string('id')
    t.string('assignmentId')
    t.string('studentId')
    t.nullable.string('fileUrl')
    t.nullable.float('grade')
    t.nullable.string('feedback')
    t.field('createdAt', { type: 'DateTime' })
    t.field('updatedAt', { type: 'DateTime' })
  },
})

export const AssignmentQuery = extendType({
  type: 'Query',
  definition(t) {
    t.list.field('assignmentsByClassroom', {
      type: 'GqlAssignment',
      args: { classroomId: nonNull(stringArg()) },
      async resolve(_root, args, ctx) {
        const baseUrl = (ctx.req.protocol + '://' + ctx.req.get('host')).replace(/\/$/, '')
        const bindResp = await fetch(`${baseUrl}/api/institutions/classrooms/${encodeURIComponent(args.classroomId)}/course-binding`).catch(() => null)
        const bindJson = bindResp && (await bindResp.json().catch(() => null))
        const institutionId = bindJson?.institutionId || null
        const role = ctx.user?.id && institutionId ? await resolveInstitutionRole(ctx.user.id, institutionId, ctx.req) : null
        const allowed = await canUser('course.view', { user: ctx.user, role })
        if (!allowed) throw new Error('FORBIDDEN')
        return ctx.prisma.assignment.findMany({
          where: { classroomId: args.classroomId },
          orderBy: { dueDate: 'asc' },
        })
      },
    })
    t.list.field('submissionsByAssignment', {
      type: 'GqlSubmission',
      args: { assignmentId: nonNull(stringArg()) },
      async resolve(_root, args, ctx) {
        const role = Array.isArray(ctx.user?.roles) && ctx.user.roles.includes('admin') ? 'admin' : (Array.isArray(ctx.user?.roles) && ctx.user.roles.includes('teacher') ? 'teacher' : null)
        const allowed = await canUser('assignment.grade', { user: ctx.user, role })
        if (!allowed) throw new Error('FORBIDDEN')
        return ctx.prisma.submission.findMany({
          where: { assignmentId: args.assignmentId },
          orderBy: { createdAt: 'desc' },
        })
      },
    })
  },
})

export const AssignmentMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createAssignment', {
      type: 'GqlAssignment',
      args: {
        classroomId: nonNull(stringArg()),
        title: nonNull(stringArg()),
        description: nonNull(stringArg()),
        dueDate: nonNull(stringArg()),
      },
      async resolve(_root, args, ctx) {
        const baseUrl = (ctx.req.protocol + '://' + ctx.req.get('host')).replace(/\/$/, '')
        const bindResp = await fetch(`${baseUrl}/api/institutions/classrooms/${encodeURIComponent(args.classroomId)}/course-binding`).catch(() => null)
        const bindJson = bindResp && (await bindResp.json().catch(() => null))
        const institutionId = bindJson?.institutionId || null
        const role = ctx.user?.id && institutionId ? await resolveInstitutionRole(ctx.user.id, institutionId, ctx.req) : null
        const allowed = await canUser('assignment.grade', { user: ctx.user, role })
        if (!allowed) throw new Error('FORBIDDEN')
        return ctx.prisma.assignment.create({
          data: {
            classroomId: args.classroomId,
            title: args.title,
            description: args.description,
            dueDate: new Date(args.dueDate),
          } as any,
        })
      },
    })

    t.field('gradeSubmission', {
      type: 'GqlSubmission',
      args: {
        id: nonNull(stringArg()),
        grade: nonNull(floatArg()),
        feedback: stringArg(),
      },
      async resolve(_root, args, ctx) {
        const role = Array.isArray(ctx.user?.roles) && ctx.user.roles.includes('admin') ? 'admin' : (Array.isArray(ctx.user?.roles) && ctx.user.roles.includes('teacher') ? 'teacher' : null)
        const allowed = await canUser('assignment.grade', { user: ctx.user, role })
        if (!allowed) throw new Error('FORBIDDEN')
        return ctx.prisma.submission.update({
          where: { id: args.id },
          data: { grade: args.grade, feedback: args.feedback ?? null },
        })
      },
    })
  },
})

export const SubmissionQuery = extendType({
  type: 'Query',
  definition(t) {
    t.list.field('mySubmissions', {
      type: 'GqlSubmission',
      args: { studentId: nonNull(stringArg()) },
      async resolve(_root, args, ctx) {
        const allowed = await canUser('student-record.view', { user: ctx.user, role: null, studentId: args.studentId })
        if (!allowed) throw new Error('FORBIDDEN')
        return ctx.prisma.submission.findMany({
          where: { studentId: args.studentId },
          orderBy: { createdAt: 'desc' },
        })
      },
    })
  },
})

export const SubmissionMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createSubmission', {
      type: 'GqlSubmission',
      args: {
        assignmentId: nonNull(stringArg()),
        studentId: nonNull(stringArg()),
        fileUrl: stringArg(),
      },
      async resolve(_root, args, ctx) {
        const role = Array.isArray(ctx.user?.roles) && ctx.user.roles.includes('student') ? 'student' : null
        const allowed = await canUser('assignment.submit', { user: ctx.user, role })
        if (!allowed) throw new Error('FORBIDDEN')
        return ctx.prisma.submission.create({
          data: { attempt: attemptNo, isLate: isLate2, 
            assignmentId: args.assignmentId,
            studentId: args.studentId,
            fileUrl: args.fileUrl ?? null,
          } as any,
        })
      },
    })
  },
})

export const AssignmentGradebookQuery = extendType({
  type: 'Query',
  definition(t) {
    t.field('gradebookCsv', {
      type: 'String',
      args: { classroomId: nonNull(stringArg()) },
      async resolve(_root, args, ctx) {
        const role = Array.isArray(ctx.user?.roles) && ctx.user.roles.includes('teacher') ? 'teacher' : (Array.isArray(ctx.user?.roles) && ctx.user.roles.includes('admin') ? 'admin' : null)
        const allowed = await canUser('assignment.grade', { user: ctx.user, role })
        if (!allowed) throw new Error('FORBIDDEN')
        const assignments = await ctx.prisma.assignment.findMany({ where: { classroomId: args.classroomId } })
        const subs = await ctx.prisma.submission.findMany({ where: { assignmentId: { in: assignments.map(a=>a.id) } } })
        const header = ['studentId','assignmentId','grade','isLate','attempt','gradedAt']
        const rows = subs.map(s=>[s.studentId,s.assignmentId, s.grade ?? '', s.isLate ? '1':'0', s.attempt ?? 1, s.gradedAt ? new Date(s.gradedAt as any).toISOString() : ''])
        const csv = [header.join(','), ...rows.map(r=>r.join(','))].join('\n')
        return csv
      }
    })
  }
})


export const UpdateAssignmentRubricMutation = extendType({
  type: 'Mutation',
  definition(t){
    t.field('updateAssignmentRubric', {
      type: 'GqlAssignment',
      args: {
        assignmentId: nonNull(stringArg()),
        rubric: nonNull(stringArg())
      },
      async resolve(_root, args, ctx){
        const role = Array.isArray(ctx.user?.roles) && ctx.user.roles.includes('teacher') ? 'teacher' : (Array.isArray(ctx.user?.roles) && ctx.user.roles.includes('admin') ? 'admin' : null)
        const allowed = await canUser('assignment.grade', { user: ctx.user, role })
        if (!allowed) throw new Error('FORBIDDEN')
        let parsed:any = null
        try { parsed = JSON.parse(args.rubric) } catch(_e){}
        return ctx.prisma.assignment.update({
          where: { id: args.assignmentId },
          data: { rubric: parsed }
        })
      }
    })
  }
})


export const SubmissionComments = extendType({
  type: 'Query',
  definition(t){
    t.field('submissionComments', {
      type: 'String',
      args: { submissionId: nonNull(stringArg()) },
      async resolve(_root, args, ctx){
        const allowed = await canUser('student-record.view', { user: ctx.user, role: null })
        if (!allowed) throw new Error('FORBIDDEN')
        const s = await ctx.prisma.submission.findUnique({ where: { id: args.submissionId } })
        return JSON.stringify(s?.comments || [])
      }
    })
  }
})


export const AddSubmissionComment = extendType({
  type: 'Mutation',
  definition(t){
    t.field('addSubmissionComment', {
      type: 'Boolean',
      args: {
        submissionId: nonNull(stringArg()),
        text: nonNull(stringArg()),
        authorId: stringArg()
      },
      async resolve(_root, args, ctx){
        const role = Array.isArray(ctx.user?.roles) && ctx.user.roles.includes('teacher') ? 'teacher' : (Array.isArray(ctx.user?.roles) && ctx.user.roles.includes('admin') ? 'admin' : null)
        const allowed = await canUser('assignment.grade', { user: ctx.user, role })
        if (!allowed) throw new Error('FORBIDDEN')
        const s = await ctx.prisma.submission.findUnique({ where: { id: args.submissionId } })
        const now = new Date().toISOString()
        const items = Array.isArray(s?.comments) ? s.comments : []
        items.push({ at: now, authorId: args.authorId || null, text: args.text })
        await ctx.prisma.submission.update({ where:{ id: args.submissionId }, data:{ comments: items } })
        return true
      }
    })
  }
})
