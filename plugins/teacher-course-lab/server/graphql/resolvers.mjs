import prisma from '../db/client.mjs';
import { startSessionForUser, stopSessionById } from '../services/sessions.mjs';
import { runGrading } from '../services/grader.mjs';

export const resolvers = {
  Query: {
    tclab_challenges: async (_root, { search }) => {
      if (!search) {
        return prisma.labChallenge.findMany({ orderBy: { createdAt: 'desc' } });
      }
      return prisma.labChallenge.findMany({
        where: {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
            { slug: { contains: search, mode: 'insensitive' } }
          ]
        },
        orderBy: { createdAt: 'desc' }
      });
    },
    tclab_challengeBySlug: (_root, { slug }) =>
      prisma.labChallenge.findUnique({ where: { slug } }),
    tclab_sessionsByUser: (_root, { userId }, ctx) => {
      const effectiveUserId = userId || ctx?.user?.id;
      if (!effectiveUserId) {
        throw new Error('Not authenticated');
      }
      return prisma.labSession.findMany({
        where: { userId: effectiveUserId },
        orderBy: { createdAt: 'desc' }
      });
    },
    tclab_session: (_root, { id }) =>
      prisma.labSession.findUnique({ where: { id } }),
    tclab_submissions: (_root, { sessionId }) =>
      prisma.submission.findMany({
        where: { sessionId },
        orderBy: { createdAt: 'desc' }
      }),
  },
  Mutation: {
    tclab_createChallenge: async (_root, { input }, ctx) => {
      const user = ctx?.user;
      if (!user?.id) {
        throw new Error('Not authenticated');
      }
      return prisma.labChallenge.create({
        data: {
          title: input.title,
          slug: input.slug,
          description: input.description,
          difficulty: input.difficulty,
          starterRepoUrl: input.starterRepoUrl,
          testsRepoUrl: input.testsRepoUrl,
          runtime: input.runtime,
          visibility: input.visibility ?? 'private',
          createdByUserId: user.id,
          courseId: input.courseId || null,
          moduleId: input.moduleId || null,
          lessonId: input.lessonId || null
        }
      });
    },
    tclab_startSession: async (_root, { input }, ctx) => {
      const user = ctx?.user;
      const effectiveUserId = user?.id || input.userId;
      if (!effectiveUserId) {
        throw new Error('Not authenticated');
      }
      const session = await startSessionForUser({
        challengeId: input.challengeId,
        userId: effectiveUserId,
        forceRestart: Boolean(input.forceRestart),
        preferredSessionId: input.sessionId || null
      });
      return session;
    },
    tclab_stopSession: async (_root, { id }, ctx) => {
      const user = ctx?.user;
      if (!user?.id) {
        throw new Error('Not authenticated');
      }
      const session = await stopSessionById(id);
      // Optionally check ownership/teacher role here.
      return session;
    },
    tclab_submit: async (_root, { input }, ctx) => {
      const user = ctx?.user;
      if (!user?.id) {
        throw new Error('Not authenticated');
      }
      const sub = await prisma.submission.create({
        data: {
          sessionId: input.sessionId,
          status: 'pending',
          passed: false
        }
      });
      // Fire-and-forget grading
      runGrading(sub.id).catch(e =>
        console.error('[teacher-course-lab] runGrading error:', e?.message || e)
      );
      return sub;
    }
  },
  LabSession: {
    challenge: (parent) =>
      prisma.labChallenge.findUnique({ where: { id: parent.challengeId } })
  }
};
