// src/codeServerManager.js
import fs from 'fs'
import path from 'path'
import { spawn } from 'child_process'
import net from 'net'

/**
 * Find a free TCP port starting from `base`.
 */
async function findFreePort(base = 3144, limit = 100) {
  for (let p = base; p < base + limit; p++) {
    const available = await new Promise(resolve => {
      const s = net.createServer()
      s.once('error', () => resolve(false))
      s.once('listening', () => s.close(() => resolve(true)))
      s.listen(p, '127.0.0.1')
    })
    if (available) return p
  }
  throw new Error('No free port found for code-server')
}

/**
 * Cache of running code-server instances (keyed by teacherId:lessonId)
 * In production, replace with Redis or a database table.
 */
const activeServers = new Map()

/**
 * Ensure a lesson-specific code-server instance is running.
 * Returns { url, pid, port, teacherId, lessonId }
 */
export async function ensureCodeServer(teacherId, lessonId) {
  if (!teacherId || !lessonId) throw new Error('Missing teacherId or lessonId')

  const key = `${teacherId}:${lessonId}`

  // Reuse if already alive
  if (activeServers.has(key)) {
    const existing = activeServers.get(key)
    try {
      process.kill(existing.pid, 0)
      return existing
    } catch {
      activeServers.delete(key)
    }
  }

  // --- Prepare workspace directory ---
  const workspace = path.resolve(
    `./apps/api/workspace/teachers/${teacherId}/lessons/${lessonId}`
  )
  fs.mkdirSync(workspace, { recursive: true })

  // --- Find available port ---
  const port = await findFreePort(3144)
  const password = process.env.CODE_SERVER_PASSWORD || 'teacher'

  // --- Resolve binary path ---
  const binary = process.env.CODE_SERVER_PATH || 'code-server'
  const binaryPath = binary.startsWith('/')
    ? binary
    : `/usr/local/bin/${binary}`

  try {
    await fs.promises.access(binaryPath, fs.constants.X_OK)
  } catch {
    console.warn(`[code-server] binary not found at ${binaryPath}.`)
  }

  // --- Spawn detached code-server ---
  const proc = spawn(
    binary,
    ['--bind-addr', `127.0.0.1:${port}`, '--auth', 'password', workspace],
    {
      env: { ...process.env, PASSWORD: password },
      stdio: 'ignore',
      detached: true,
    }
  )

  proc.unref()

  // --- Store instance metadata ---
  const url = `http://127.0.0.1:${port}/?folder=${encodeURIComponent(workspace)}`
  const info = {
    url,
    pid: proc.pid,
    port,
    teacherId,
    lessonId,
    startedAt: new Date().toISOString(),
  }
  activeServers.set(key, info)

  console.log(`[code-server] started for teacher=${teacherId}, lesson=${lessonId} → ${url}`)
  return info
}

/**
 * Stop an active code-server (optional)
 */
export async function stopCodeServer(teacherId, lessonId) {
  const key = `${teacherId}:${lessonId}`
  const entry = activeServers.get(key)
  if (!entry) return { ok: false, error: 'No active instance' }

  try {
    process.kill(entry.pid)
    activeServers.delete(key)
    console.log(`[code-server] stopped for ${key}`)
    return { ok: true }
  } catch (err) {
    return { ok: false, error: err.message }
  }
}
