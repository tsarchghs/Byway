import express from 'express';
import prisma from '../db/client.mjs';
import { startSessionForUser, stopSessionById } from '../services/sessions.mjs';
import { runGrading } from '../services/grader.mjs';
import { fetchBindingMetaForChallenge } from '../services/courses-bridge.mjs';
import { PrismaClient } from '../../../authentication/server/db/generated';

export const restRouter = express.Router();
function requireUser(req, res) {
  const user = req.user;
  if (!user || !user.id) {
    res.status(401).json({ error: 'Unauthorized' });
    return null;
  }
  return user;
}

restRouter.get('/health', (_req, res) => {
  res.json({ ok: true, plugin: 'teacher-course-lab' });
});

// Quick list of challenges (REST)
restRouter.get('/challenges', async (_req, res) => {
  const items = await prisma.labChallenge.findMany({ orderBy: { createdAt: 'desc' } });
  res.json({ items });
});

// Create a challenge (REST)
restRouter.post('/challenges', express.json(), async (req, res) => {
  const user = requireUser(req, res);
  if (!user) return;

  const body = req.body ?? {};
  if (!body.title || !body.slug || !body.description || !body.difficulty) {
    return res.status(400).json({ error: 'Missing fields: title, slug, description, difficulty' });
  }

  const item = await prisma.labChallenge.create({
    data: {
      title: body.title,
      slug: body.slug,
      description: body.description,
      difficulty: body.difficulty,
      starterRepoUrl: body.starterRepoUrl,
      testsRepoUrl: body.testsRepoUrl,
      runtime: body.runtime,
      visibility: body.visibility ?? 'private',
      createdByUserId: user.id,
      courseId: body.courseId || null,
      moduleId: body.moduleId || null,
      lessonId: body.lessonId || null
    }
  });
  res.json({ item });
});

// Start session (REST)
restRouter.post('/session/start', express.json(), async (req, res) => {
  const user = requireUser(req, res);
  if (!user) return;

  const { challengeId } = req.body ?? {};
  if (!challengeId) {
    return res.status(400).json({ error: 'challengeId required' });
  }

  try {
    const session = await startSessionForUser({
      challengeId,
      userId: user.id
    });
    res.json({ session });
  } catch (e) {
    res.status(500).json({ error: e?.message || 'Failed to start session' });
  }
});

// Stop session (REST)
restRouter.post('/session/stop', express.json(), async (req, res) => {
  const user = requireUser(req, res);
  if (!user) return;

  const { id } = req.body ?? {};
  if (!id) return res.status(400).json({ error: 'id required' });

  try {
    const session = await stopSessionById(id);
    res.json({ session });
  } catch (e) {
    res.status(500).json({ error: e?.message || 'Failed to stop session' });
  }
});

// Submissions (REST) - student submit
restRouter.post('/submit', express.json(), async (req, res) => {
  const user = requireUser(req, res);
  if (!user) return;

  const { sessionId } = req.body ?? {};
  if (!sessionId) return res.status(400).json({ error: 'sessionId required' });

  const sub = await prisma.submission.create({
    data: { sessionId, status: 'pending', passed: false }
  });

  runGrading(sub.id).catch(e =>
    console.error('[teacher-course-lab] runGrading error (REST):', e?.message || e)
  );

  res.json({ submission: sub });
});

// Course/module/lesson bindings
restRouter.get('/bindings/challenge/:id', async (req, res) => {
  const id = req.params.id;
  const challenge = await prisma.labChallenge.findUnique({ where: { id } });
  if (!challenge) {
    return res.status(404).json({ error: 'Challenge not found' });
  }

  let bindings = null;
  try {
    bindings = await fetchBindingMetaForChallenge(challenge);
  } catch (e) {
    console.warn('[teacher-course-lab] bindings fetch error:', e?.message || e);
  }

  res.json({ challenge, bindings });
});

restRouter.post('/bindings/challenge/:id', express.json(), async (req, res) => {
  const user = requireUser(req, res);
  if (!user) return;

  const id = req.params.id;
  const { courseId, moduleId, lessonId } = req.body ?? {};

  const challenge = await prisma.labChallenge.update({
    where: { id },
    data: {
      courseId: courseId || null,
      moduleId: moduleId || null,
      lessonId: lessonId || null
    }
  });

  res.json({ challenge });
});

// Student: My lab sessions (with submissions + challenge meta)
restRouter.get('/sessions/me', async (req, res) => {
  const user = requireUser(req, res);
  if (!user) return;

  const sessions = await prisma.labSession.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    include: {
      challenge: true,
      submissions: { orderBy: { createdAt: 'desc' } }
    }
  });

  res.json({ sessions });
});

// Teacher: submissions dashboard (for challenges created by current user)
restRouter.get('/teacher/submissions', async (req, res) => {
  const user = requireUser(req, res);
  if (!user) return;

  const submissions = await prisma.submission.findMany({
    where: {
      session: {
        challenge: {
          createdByUserId: user.id
        }
      }
    },
    orderBy: { createdAt: 'desc' },
    include: {
      session: {
        include: {
          challenge: true
        }
      }
    }
  });

  const items = submissions.map(sub => ({
    id: sub.id,
    status: sub.status,
    passed: sub.passed,
    gradePct: sub.gradePct,
    feedback: sub.feedback,
    createdAt: sub.createdAt,
    updatedAt: sub.updatedAt,
    sessionId: sub.sessionId,
    sessionStatus: sub.session.status,
    sessionUserId: sub.session.userId,
    challengeId: sub.session.challenge.id,
    challengeTitle: sub.session.challenge.title,
    difficulty: sub.session.challenge.difficulty,
    courseId: sub.session.challenge.courseId,
    moduleId: sub.session.challenge.moduleId,
    lessonId: sub.session.challenge.lessonId
  }));

  res.json({ items });
});


// Teacher: re-run grading for a submission
restRouter.post('/teacher/submissions/:id/rerun', express.json(), async (req, res) => {
  const user = requireUser(req, res);
  if (!user) return;

  const id = req.params.id;

  // Ensure submission belongs to a challenge created by this teacher
  const submission = await prisma.submission.findFirst({
    where: {
      id,
      session: {
        challenge: {
          createdByUserId: user.id
        }
      }
    }
  });

  if (!submission) {
    return res.status(404).json({ error: 'Submission not found' });
  }

  try {
    await runGrading(id);
    const updated = await prisma.submission.findUnique({ where: { id } });
    res.json({ submission: updated });
  } catch (e) {
    console.error('[teacher-course-lab] re-run grading error:', e?.message || e);
    res.status(500).json({ error: 'Failed to re-run grading' });
  }
});

// Teacher: per-session submission history
restRouter.get('/teacher/submissions/session/:sessionId', async (req, res) => {
  const user = requireUser(req, res);
  if (!user) return;

  const sessionId = req.params.sessionId;

  const session = await prisma.labSession.findFirst({
    where: {
      id: sessionId,
      challenge: {
        createdByUserId: user.id
      }
    },
    include: {
      challenge: true,
      submissions: { orderBy: { createdAt: 'desc' } }
    }
  });

  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }

  res.json({ session });
});
