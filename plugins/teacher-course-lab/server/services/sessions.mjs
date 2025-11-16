import prisma from '../db/client.mjs';
import { spawnCodeServerForSession, stopCodeServerForSession } from './spawner.mjs';

export async function startSessionForUser({ challengeId, userId }) {
  if (!challengeId || !userId) {
    throw new Error('challengeId and userId are required');
  }

  const challenge = await prisma.labChallenge.findUnique({ where: { id: challengeId } });
  if (!challenge) {
    throw new Error('Challenge not found');
  }

  const session = await prisma.labSession.create({
    data: {
      userId,
      challengeId,
      status: 'starting'
    }
  });

  let spawnInfo;
  try {
    spawnInfo = await spawnCodeServerForSession({
      sessionId: session.id,
      userId,
      challengeId
    });
  } catch (e) {
    await prisma.labSession.update({
      where: { id: session.id },
      data: { status: 'error' }
    });
    throw e;
  }

  const updated = await prisma.labSession.update({
    where: { id: session.id },
    data: {
      status: 'running',
      codeServerUrl: spawnInfo.url,
      codeServerToken: spawnInfo.token,
      containerId: spawnInfo.containerId
    }
  });

  return updated;
}

export async function stopSessionById(id) {
  const existing = await prisma.labSession.findUnique({ where: { id } });
  if (!existing) {
    throw new Error('Session not found');
  }

  await prisma.labSession.update({
    where: { id },
    data: { status: 'stopped' }
  });

  if (existing.containerId) {
    await stopCodeServerForSession(existing.containerId);
  }

  return prisma.labSession.findUnique({ where: { id } });
}
