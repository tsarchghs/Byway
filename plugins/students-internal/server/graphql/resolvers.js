// students-internal/server/graphql/resolvers.js
import fs from 'node:fs'
import path from 'node:path'

let memory = {
  rubrics: new Map(), // courseId -> { id, courseId, items, updatedAt }
  enrollments: new Map(), // enrollmentId -> { ... }
  grades: new Map(), // enrollmentId -> [gradeItems]
}

function nowISO(){ return new Date().toISOString() }
function id(){ return Math.random().toString(36).slice(2) }

// Best-effort prisma loader (surgical, no apps/ edits)
async function getPrisma() {
  try {
    const modA = await import('../db/client.js').catch(()=>null)
    if (modA && modA.prisma) return modA.prisma
  } catch {}
  try {
    const modB = await import('../db/generated/client/index.js').catch(()=>null)
    if (modB && modB.PrismaClient) {
      const prisma = new modB.PrismaClient()
      return prisma
    }
  } catch {}
  return null
}

export default {
  Query: {
    meRole: async (_p, _a, ctx) => {
      // Without auth, heuristics: teacher if header x-role=TEACHER, otherwise GUEST
      const hdr = (ctx?.req?.headers?.['x-role'] || ctx?.req?.headers?.['x-user-role'] || '').toString().toUpperCase()
      if (hdr === 'TEACHER' || hdr === 'ADMIN' || hdr === 'STUDENT') return hdr
      return 'GUEST'
    },
    myEnrollments: async (_p, { studentId }) => {
      const prisma = await getPrisma()
      if (prisma?.enrollment) {
        const rows = await prisma.enrollment.findMany({ where: { studentId } })
        return rows
      }
      // memory fallback
      return Array.from(memory.enrollments.values()).filter(e=>e.studentId===studentId)
    },
    isEnrolled: async (_p, { studentId, courseId }) => {
      const prisma = await getPrisma()
      if (prisma?.enrollment) {
        const found = await prisma.enrollment.findFirst({ where: { studentId, courseId } })
        return !!found
      }
      // memory fallback
      return Array.from(memory.enrollments.values()).some(e=>e.studentId===studentId && e.courseId===courseId)
    },
    gradebook: async (_p, { courseId }) => {
      const prisma = await getPrisma()
      if (prisma?.gradeItem && prisma?.enrollment) {
        const ens = await prisma.enrollment.findMany({ where: { courseId } })
        const ids = ens.map(e=>e.id)
        const items = await prisma.gradeItem.findMany({ where: { enrollmentId: { in: ids } } })
        return items
      }
      // memory fallback aggregate
      const all = []
      for (const [enrId, rows] of memory.grades.entries()) {
        for (const r of rows) {
          // join via enrollment
          const enr = memory.enrollments.get(enrId)
          if (enr?.courseId === courseId) all.push(r)
        }
      }
      return all
    },
    rubric: async (_p, { courseId }) => {
      const prisma = await getPrisma()
      if (prisma?.courseRubric) {
        const r = await prisma.courseRubric.findFirst({ where: { courseId } })
        return r && { ...r, items: (r.items||[]) }
      }
      // memory
      return memory.rubrics.get(courseId) || null
    }
  },
  Mutation: {
    enrollStudent: async (_p, { studentId, courseId }) => {
      const prisma = await getPrisma()
      if (prisma?.enrollment) {
        const created = await prisma.enrollment.upsert({
          where: { studentId_courseId: { studentId, courseId } },
          update: {},
          create: { studentId, courseId, progress: 0 }
        })
        return created
      }
      // memory fallback
      const eid = id()
      const row = { id: eid, studentId, courseId, progress: 0, createdAt: nowISO(), updatedAt: nowISO() }
      memory.enrollments.set(eid, row)
      return row
    },
    setProgress: async (_p, { enrollmentId, value }) => {
      const prisma = await getPrisma()
      if (prisma?.enrollment) {
        const upd = await prisma.enrollment.update({
          where: { id: enrollmentId },
          data: { progress: Math.max(0, Math.min(100, value)), updatedAt: new Date() }
        })
        return upd
      }
      const cur = memory.enrollments.get(enrollmentId)
      if (cur) {
        cur.progress = Math.max(0, Math.min(100, value))
        cur.updatedAt = nowISO()
        return cur
      }
      throw new Error('enrollment not found')
    },
    setRubric: async (_p, { courseId, items }) => {
      const prisma = await getPrisma()
      if (prisma?.courseRubric) {
        const saved = await prisma.courseRubric.upsert({
          where: { courseId },
          update: { items, updatedAt: new Date() },
          create: { courseId, items }
        })
        return { ...saved, items: saved.items||[] }
      }
      const row = { id: id(), courseId, items, updatedAt: nowISO() }
      memory.rubrics.set(courseId, row)
      return row
    },
    upsertGradeItems: async (_p, { items }) => {
      const prisma = await getPrisma()
      if (prisma?.gradeItem) {
        const out = []
        for (const it of items) {
          const saved = await prisma.gradeItem.create({
            data: {
              enrollmentId: it.enrollmentId,
              label: it.label,
              points: it.points,
              weight: it.weight
            }
          })
          out.push(saved)
        }
        return out
      }
      // memory
      const out = []
      for (const it of items) {
        const row = { id: id(), ...it, updatedAt: nowISO() }
        const arr = memory.grades.get(it.enrollmentId) || []
        arr.push(row); memory.grades.set(it.enrollmentId, arr)
        out.push(row)
      }
      return out
    }
  }
}
