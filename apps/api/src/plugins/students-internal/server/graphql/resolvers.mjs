import { PrismaClient } from '../db/generated/client/index.js';
import { resolveUser, resolveInstitutionRole, canUser } from '../permissions.mjs'
const prisma = new PrismaClient();

export const resolvers = {
  Query: {
    async isEnrolled(_, { studentId, courseId }, ctx) {
      const user = await resolveUser(ctx.req).catch(()=>null)
      let role = null
      if (courseId && user?.id) {
        const baseUrl = (ctx.req.protocol + '://' + ctx.req.get('host')).replace(/\/$/, '')
        const icResp = await fetch(`${baseUrl}/api/teach-internal/course/${encodeURIComponent(String(courseId))}/institution-context`).catch(() => null)
        const ic = icResp && (await icResp.json().catch(() => null))
        const institutionId = ic?.institutionId || null
        role = institutionId ? await resolveInstitutionRole(user.id, institutionId, ctx.req) : null
      }
      const allowed = await canUser('student-record.view', { user, role, studentId })
      if (!allowed) throw new Error('FORBIDDEN')
      const sc = await prisma.studentCourse.findFirst({ where: { studentId, courseId } });
      return !!sc;
    },
    async enrollments(_, { studentId }, ctx) {
      const user = await resolveUser(ctx.req).catch(()=>null)
      const allowed = await canUser('student-record.view', { user, role: null, studentId })
      if (!allowed) throw new Error('FORBIDDEN')
      const rows = await prisma.studentCourse.findMany({ where: { studentId } });
      return rows.map(r => ({
        id: r.id,
        studentId: r.studentId,
        courseId: r.courseId,
        status: r.status || 'ENROLLED',
        createdAt: r.createdAt,
      }));
    },
    async gradebook(_, { studentId, courseId }, ctx) {
      const user = await resolveUser(ctx.req).catch(()=>null)
      let role = null
      if (courseId && user?.id) {
        const baseUrl = (ctx.req.protocol + '://' + ctx.req.get('host')).replace(/\/$/, '')
        const icResp = await fetch(`${baseUrl}/api/teach-internal/course/${encodeURIComponent(String(courseId))}/institution-context`).catch(() => null)
        const ic = icResp && (await icResp.json().catch(() => null))
        const institutionId = ic?.institutionId || null
        role = institutionId ? await resolveInstitutionRole(user.id, institutionId, ctx.req) : null
      }
      const allowed = await canUser('student-record.view', { user, role, studentId })
      if (!allowed) throw new Error('FORBIDDEN')
      const where = { studentId, ...(courseId ? { courseId } : {}) };
      const rows = await prisma.gradebookEntry.findMany({
        where,
        orderBy: { updatedAt: 'desc' },
        include: { assignment: true, course: true },
      });
      return rows.map(r => ({
        id: r.id,
        studentId: r.studentId,
        courseId: r.courseId,
        assignmentId: r.assignmentId,
        label: r.label,
        points: r.points,
        maxPoints: r.maxPoints,
        percentage: r.maxPoints ? (r.points / r.maxPoints) * 100 : 0,
        updatedAt: r.updatedAt,
        assignment: r.assignment || null,
        course: r.course || null,
      }));
    },
    async gradebookOverview(_, { studentId }, ctx) {
      const user = await resolveUser(ctx.req).catch(()=>null)
      const allowed = await canUser('student-record.view', { user, role: null, studentId })
      if (!allowed) throw new Error('FORBIDDEN')
      const enrolls = await prisma.studentCourse.findMany({ where: { studentId } });
      const entries = await prisma.gradebookEntry.findMany({
        where: { studentId },
        include: { assignment: true, course: true },
      });

      const totalCourses = enrolls.length;
      const completed = enrolls.filter(e => (e.status || '').toUpperCase() == 'COMPLETED').length;
      const percentages = entries.map(e => (e.maxPoints ? (e.points / e.maxPoints) * 100 : 0));
      const avg = percentages.length ? percentages.reduce((a,b)=>a+b,0) / percentages.length : 0;

      const byCourseMap = new Map();
      for (const e of entries) {
        const cid = e.courseId || 'unknown';
        const name = e.course?.title || cid;
        const pct = e.maxPoints ? (e.points / e.maxPoints) * 100 : 0;
        const agg = byCourseMap.get(cid) || { id: cid, name, sum:0, count:0 };
        agg.sum += pct; agg.count += 1;
        byCourseMap.set(cid, agg);
      }
      const byCourse = Array.from(byCourseMap.values()).map(v => ({
        id: v.id, name: v.name, avg: v.count ? v.sum / v.count : 0, count: v.count
      }));

      const byAssMap = new Map();
      for (const e of entries) {
        const aid = e.assignmentId || e.label || 'unlabeled';
        const name = e.assignment?.title || e.label || String(aid);
        const pct = e.maxPoints ? (e.points / e.maxPoints) * 100 : 0;
        const agg = byAssMap.get(aid) || { id: String(aid), name, sum:0, count:0 };
        agg.sum += pct; agg.count += 1;
        byAssMap.set(aid, agg);
      }
      const byAssignment = Array.from(byAssMap.values()).map(v => ({
        id: v.id, name: v.name, avg: v.count ? v.sum / v.count : 0, count: v.count
      }));

      entries.sort((a,b)=> (b.updatedAt?.getTime?.()||0) - (a.updatedAt?.getTime?.()||0));
      const recent = entries.slice(0, 8).map(r => ({
        id: r.id,
        studentId: r.studentId,
        courseId: r.courseId,
        assignmentId: r.assignmentId,
        label: r.label,
        points: r.points,
        maxPoints: r.maxPoints,
        percentage: r.maxPoints ? (r.points / r.maxPoints) * 100 : 0,
        updatedAt: r.updatedAt,
        assignment: r.assignment || null,
        course: r.course || null,
      }));

      return {
        totalCourses,
        completed,
        avg,
        recentUpdates: recent,
        byCourse,
        byAssignment,
      };
    },
  },
  Mutation: {
    async enrollStudent(_, { studentId, courseId }, ctx) {
      const user = await resolveUser(ctx.req).catch(()=>null)
      let role = null
      if (courseId && user?.id) {
        const baseUrl = (ctx.req.protocol + '://' + ctx.req.get('host')).replace(/\/$/, '')
        const icResp = await fetch(`${baseUrl}/api/teach-internal/course/${encodeURIComponent(String(courseId))}/institution-context`).catch(() => null)
        const ic = icResp && (await icResp.json().catch(() => null))
        const institutionId = ic?.institutionId || null
        role = institutionId ? await resolveInstitutionRole(user.id, institutionId, ctx.req) : null
      }
      const allowed = await canUser('institution.teacher', { user, role })
      if (!allowed) throw new Error('FORBIDDEN')
      const rec = await prisma.studentCourse.upsert({
        where: { unique_student_course: { studentId, courseId } },
        update: { status: 'ENROLLED' },
        create: { studentId, courseId, status: 'ENROLLED' },
      });
      return {
        id: rec.id,
        studentId: rec.studentId,
        courseId: rec.courseId,
        status: rec.status || 'ENROLLED',
        createdAt: rec.createdAt,
      };
    },
    async upsertGrade(_, { input }, ctx) {
      const user = await resolveUser(ctx.req).catch(()=>null)
      let role = null
      if (input?.courseId && user?.id) {
        const baseUrl = (ctx.req.protocol + '://' + ctx.req.get('host')).replace(/\/$/, '')
        const icResp = await fetch(`${baseUrl}/api/teach-internal/course/${encodeURIComponent(String(input.courseId))}/institution-context`).catch(() => null)
        const ic = icResp && (await icResp.json().catch(() => null))
        const institutionId = ic?.institutionId || null
        role = institutionId ? await resolveInstitutionRole(user.id, institutionId, ctx.req) : null
      }
      const allowed = await canUser('assignment.grade', { user, role })
      if (!allowed) throw new Error('FORBIDDEN')
      const { studentId, courseId, assignmentId, label, points, maxPoints } = input;
      const rec = await prisma.gradebookEntry.upsert({
        where: { unique_grade: { studentId, courseId, assignmentId: assignmentId || null, label: label || null } },
        update: { points, maxPoints, label, assignmentId },
        create: { studentId, courseId, assignmentId: assignmentId || null, label: label || null, points, maxPoints },
        include: { assignment: true, course: true },
      });
      return {
        id: rec.id,
        studentId: rec.studentId,
        courseId: rec.courseId,
        assignmentId: rec.assignmentId,
        label: rec.label,
        points: rec.points,
        maxPoints: rec.maxPoints,
        percentage: rec.maxPoints ? (rec.points / rec.maxPoints) * 100 : 0,
        updatedAt: rec.updatedAt,
        assignment: rec.assignment || null,
        course: rec.course || null,
      };
    },
  },
};
