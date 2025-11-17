import prisma from '../db/client.mjs'
import { spawnCodeServerForSession, stopCodeServerForSession } from './spawner.mjs'
import { fetchBindingMetaForChallenge } from './courses-bridge.mjs'

//
// Helper logger with timestamps
//
function log(...args) {
  console.log(`[teacher-course-lab][${new Date().toISOString()}]`, ...args)
}

//
// START SESSION
//
export async function startSessionForUser({ challengeId, userId }) {
  log('startSessionForUser() called', { challengeId, userId })

  if (!challengeId || !userId) {
    log('❌ Missing challengeId or userId')
    throw new Error('challengeId and userId are required')
  }

  log('🔎 Fetching challenge from Prisma...', { challengeId })

  const challenge = await prisma.labChallenge.findUnique({ where: { id: challengeId } })
  log('📌 challenge result =', challenge)

  if (!challenge) {
    log('❌ Challenge not found in DB')
    throw new Error(`Challenge '${challengeId}' not found`)
  }

  log('🧱 Creating lab session record...', { userId, challengeId })

  const session = await prisma.labSession.create({
    data: {
      userId,
      challengeId,
      status: 'starting'
    }
  })

  log('📌 Created session', session)

  // Try to fetch lab metadata from lesson if challenge is bound to a lesson
  let labMeta = null
  if (challenge.lessonId) {
    try {
      const bindings = await fetchBindingMetaForChallenge(challenge)
      if (bindings?.lesson?.metadata?.lab) {
        labMeta = bindings.lesson.metadata.lab
        log('📦 Found lab metadata:', { kind: labMeta.kind })
      }
    } catch (e) {
      log('⚠️ Failed to fetch lab metadata:', e.message)
    }
  }

  let spawnInfo
  try {
    log('🚀 Spawning Code-Server for session...', { sessionId: session.id })

    spawnInfo = await spawnCodeServerForSession({
      sessionId: session.id,
      userId,
      challengeId,
      labMeta
    })

    log('📦 spawnCodeServerForSession() returned:', spawnInfo)

  } catch (e) {
    log('❌ Spawner failed, marking session as error.', e)

    await prisma.labSession.update({
      where: { id: session.id },
      data: { status: 'error' }
    })

    throw new Error('Failed to spawn Code Server: ' + (e?.message || e))
  }

  log('📝 Updating session with code-server details...', spawnInfo)

  const updated = await prisma.labSession.update({
    where: { id: session.id },
    data: {
      status: 'running',
      codeServerUrl: spawnInfo.codeServerUrl,
      appUrl: spawnInfo.appUrl || spawnInfo.appOrbLocalUrl || spawnInfo.orbLocalUrl || null,
      codeServerToken: spawnInfo.token,
      containerId: spawnInfo.containerId
    }
  })

  const withOrb = spawnInfo.orbLocalUrl
    ? { ...updated, orbLocalUrl: spawnInfo.orbLocalUrl }
    : updated

  log('✅ Session updated successfully:', withOrb)

  return withOrb
}

//
// STOP SESSION
//
export async function stopSessionById(id) {
  log('stopSessionById() called', { id })

  const existing = await prisma.labSession.findUnique({ where: { id } })
  log('📌 existing session =', existing)

  if (!existing) {
    log('❌ No session found for stopSessionById()', id)
    throw new Error('Session not found')
  }

  log('📝 Marking session as stopped')

    await prisma.labSession.update({
      where: { id },
      data: { status: 'stopped' }
    })

  if (existing.containerId || existing.id) {
    log('🛑 Stopping Code-Server/App containers...', { containerId: existing.containerId, sessionId: id })

    try {
      await stopCodeServerForSession({ containerId: existing.containerId, sessionId: id })
      log('🟢 Container stop successful')
    } catch (e) {
      log('❌ Failed to stop container', e)
    }
  } else {
    log('ℹ No containerId — nothing to stop')
  }

  const finalSession = await prisma.labSession.findUnique({ where: { id } })
  log('📌 Final session state:', finalSession)

  return finalSession
}
