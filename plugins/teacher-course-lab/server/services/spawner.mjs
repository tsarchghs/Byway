import { exec as _exec, spawn } from 'node:child_process'
import { promisify } from 'node:util'
import fs from 'node:fs'
import path from 'node:path'
import { initializeLabProject, buildLabProject } from './project-initializer.mjs'

const exec = promisify(_exec)

/**
 * Normalize a Windows host path for Docker Desktop
 * C:\Users\Me → /host_mnt/c/Users/Me
 */
function normalizeDockerPath(p) {
  if (process.platform !== 'win32') return p

  const drive = p[0].toLowerCase()
  const rest = p.substring(2).replace(/\\/g, '/')
  return `/host_mnt/${drive}${rest}`
}

/**
 * Spawn docker using arguments array (cross-platform safe)
 */
function execDocker(args) {
  return new Promise((resolve, reject) => {
    const proc = spawn('docker', args, {
      stdio: ['ignore', 'pipe', 'pipe'],
      shell: false,
    })

    let stdout = ''
    let stderr = ''

    proc.stdout.on('data', d => (stdout += d.toString()))
    proc.stderr.on('data', d => (stderr += d.toString()))

    proc.on('close', code => {
      if (code === 0) resolve({ stdout: stdout.trim(), stderr: stderr.trim() })
      else reject(new Error(stderr || stdout || 'Unknown Docker error'))
    })

    proc.on('error', reject)
  })
}

function log(...args) {
  console.log(`[TCLab:Spawner][${new Date().toISOString()}]`, ...args)
}

// Defaults
const BASE_URL = process.env.CODE_SERVER_BASE_URL || 'http://codeserver.localhost'
const DEFAULT_TOKEN =
  process.env.CODE_SERVER_DEFAULT_TOKEN ||
  process.env.CODE_SERVER_PASSWORD ||
  'changeme'

const TRAEFIK_NETWORK = process.env.TCLAB_TRAEFIK_NETWORK || 'tclab-traefik-network'
const TRAEFIK_DOMAIN = process.env.TCLAB_TRAEFIK_DOMAIN || 'localhost'
const TRAEFIK_ENTRYPOINT = process.env.TCLAB_TRAEFIK_ENTRYPOINT || 'web'

/**
 * Ensure Traefik network exists
 */
async function ensureTraefikNetwork() {
  try {
    await execDocker(['network', 'inspect', TRAEFIK_NETWORK])
    log(`✅ Traefik network '${TRAEFIK_NETWORK}' exists`)
    return
  } catch (_) {
    log(`📡 Traefik network missing — creating '${TRAEFIK_NETWORK}'...`)
  }

  try {
    await execDocker(['network', 'create', TRAEFIK_NETWORK])
    log(`✅ Created Traefik network '${TRAEFIK_NETWORK}'`)
  } catch (err) {
    log('⚠ Failed to create network (continue anyway):', err.message)
  }
}

/**
 * Main spawner
 * @param {object} options - Session options
 * @param {string} options.sessionId - Session ID
 * @param {string} options.userId - User ID
 * @param {string} options.challengeId - Challenge ID
 * @param {object} options.labMeta - Optional lab metadata from lesson.metadata.lab
 */
export async function spawnCodeServerForSession({ sessionId, userId, challengeId, labMeta }) {
  log('spawnCodeServerForSession()', { sessionId, userId, challengeId, hasLabMeta: !!labMeta })

  const mode = (process.env.TCLAB_SPAWNER_MODE || 'docker-per-session').toLowerCase()
  log('Spawner mode =', mode)

  if (mode === 'shared') {
    return {
      url: BASE_URL,
      token: DEFAULT_TOKEN,
      containerId: null,
      mode: 'shared',
    }
  }

  await ensureTraefikNetwork()

  const image = process.env.TCLAB_CODE_SERVER_IMAGE || 'codercom/code-server:4.21.1'
  const password = DEFAULT_TOKEN

  // EXACT: keep your format
  const sessionShortId = sessionId.replace(/[^a-zA-Z0-9]/g, '').slice(0, 12)
  const containerName = `tclab-session-${sessionShortId}`

  const baseWorkdir =
    process.env.TCLAB_WORKSPACES_ROOT ||
    path.resolve(process.cwd(), 'plugins/teacher-course-lab/docker/workspaces')

  const workspaceDir = path.resolve(baseWorkdir, userId, sessionId)

  fs.mkdirSync(workspaceDir, { recursive: true })
  log('📁 Workspace directory ensured:', workspaceDir)

  // If lab metadata is provided, initialize the project
  if (labMeta && labMeta.kind) {
    try {
      log('🔧 Initializing lab project...', { kind: labMeta.kind })
      await initializeLabProject(workspaceDir, labMeta)
      log('✅ Project initialized successfully')
    } catch (err) {
      log('⚠️ Project initialization failed (continuing anyway):', err.message)
    }

    if (labMeta?.buildCmd) {
      try {
        log('🛠  Running lab build command...', { buildCmd: labMeta.buildCmd })
        await buildLabProject(workspaceDir, labMeta.buildCmd)
      } catch (err) {
        log('⚠️ Lab build command failed (continuing anyway):', err.message)
      }
    }
  }

  // Normalize Windows volume path
  let volumeHostPath = process.platform === 'win32'
    ? normalizeDockerPath(workspaceDir)
    : workspaceDir

  log('Volume mount =', volumeHostPath)

  // Traefik routing
const traefikHost = `${containerName}.${TRAEFIK_DOMAIN}`
const traefikUrl = `http://${traefikHost}`  
const routerName = containerName // router = tclab-session-xxxx
const labels = [
  'traefik.enable=true',
  `traefik.http.routers.${containerName}.rule=Host(\`${traefikHost}\`)`,
  `traefik.http.routers.${containerName}.entrypoints=${TRAEFIK_ENTRYPOINT}`,
  `traefik.http.services.${containerName}.loadbalancer.server.port=8080`,
  `traefik.docker.network=${TRAEFIK_NETWORK}`,
]

  const dockerArgs = [
    'run',
    '-d',
    '--name', containerName,
    '--network', TRAEFIK_NETWORK,
  ]

  labels.forEach(label => dockerArgs.push('--label', label))

  dockerArgs.push(
    '-e', `PASSWORD=${password}`,
    '-v', `${volumeHostPath}:/home/coder/project`,
    image,
    '--auth', 'password',
    '--bind-addr', '0.0.0.0:8080',
    '/home/coder/project',
  )

  log('🐳 docker run:', dockerArgs.join(' '))

  try {
    const { stdout } = await execDocker(dockerArgs)
    const containerId = stdout.trim()

    log('🟢 Container started:', { containerId, traefikHost })

    return {
      url: traefikUrl,
      token: password,
      containerId,
      mode: 'docker-per-session',
      traefikHost,
    }
  } catch (err) {
    log('❌ Failed to start docker container', err.message)
    throw err
  }
}

export async function stopCodeServerForSession(containerId) {
  const mode = (process.env.TCLAB_SPAWNER_MODE || 'shared').toLowerCase()

  if (!containerId) return
  if (mode !== 'docker-per-session') return

  log('🐳 Stopping container:', containerId)

  try {
    await execDocker(['rm', '-f', containerId])
    log('🗑 Removed container:', containerId)
  } catch (err) {
    log('❌ Failed removing container:', err.message)
  }
}
