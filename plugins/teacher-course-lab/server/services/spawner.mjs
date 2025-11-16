  import { exec as _exec, spawn } from 'node:child_process'
  import { promisify } from 'node:util'
  import fs from 'node:fs'
  import path from 'node:path'

  const exec = promisify(_exec)
  
  // Helper to run docker command with proper argument handling
  function execDocker(args) {
    return new Promise((resolve, reject) => {
      const proc = spawn('docker', args, {
        stdio: ['ignore', 'pipe', 'pipe'],
        shell: false,
      })
      
      let stdout = ''
      let stderr = ''
      
      proc.stdout.on('data', (data) => { stdout += data.toString() })
      proc.stderr.on('data', (data) => { stderr += data.toString() })
      
      proc.on('close', (code) => {
        if (code === 0) {
          resolve({ stdout: stdout.trim(), stderr: stderr.trim() })
        } else {
          reject(new Error(`Docker command failed: ${stderr || stdout || 'Unknown error'}`))
        }
      })
      
      proc.on('error', (err) => {
        reject(err)
      })
    })
  }

  function log(...args) {
    console.log(`[TCLab:Spawner][${new Date().toISOString()}]`, ...args)
  }

  // Shared-mode defaults (single shared code-server)
  const BASE_URL = process.env.CODE_SERVER_BASE_URL || 'http://codeserver.localhost'
  const DEFAULT_TOKEN =
    process.env.CODE_SERVER_DEFAULT_TOKEN ||
    process.env.CODE_SERVER_PASSWORD ||
    'changeme'

  // Traefik configuration
  const TRAEFIK_NETWORK = process.env.TCLAB_TRAEFIK_NETWORK || 'tclab-traefik-network'
  const TRAEFIK_DOMAIN = process.env.TCLAB_TRAEFIK_DOMAIN || 'localhost'
  const TRAEFIK_ENTRYPOINT = process.env.TCLAB_TRAEFIK_ENTRYPOINT || 'web'

  /**
   * Ensure Traefik network exists for container connectivity
   */
  async function ensureTraefikNetwork() {
    try {
      // Check if network exists
      const { stdout } = await exec(`docker network inspect ${TRAEFIK_NETWORK}`, { encoding: 'utf8' })
      if (stdout) {
        log(`✅ Traefik network '${TRAEFIK_NETWORK}' exists`)
        return
      }
    } catch (err) {
      // Network doesn't exist, create it
      log(`📡 Creating Traefik network '${TRAEFIK_NETWORK}'...`)
      try {
        const cmd = process.platform === 'win32' 
          ? `cmd.exe /c docker network create ${TRAEFIK_NETWORK}`
          : `docker network create ${TRAEFIK_NETWORK}`
        await exec(cmd)
        log(`✅ Traefik network '${TRAEFIK_NETWORK}' created`)
      } catch (createErr) {
        log('⚠️ Failed to create network, will continue without network isolation:', createErr?.message)
      }
    }
  }

  /**
   * Spawn or attach a code-server workspace for a given lab session.
   * Modes:
   *  - shared (default): reuse a single code-server instance (BASE_URL).
   *  - docker-per-session: start a dedicated code-server container per lab session with Traefik routing.
   */
  export async function spawnCodeServerForSession({ sessionId, userId, challengeId }) {
    log('spawnCodeServerForSession() called', { sessionId, userId, challengeId })

    const mode = (process.env.TCLAB_SPAWNER_MODE || 'docker-per-session').toLowerCase()
    log('Spawner mode =', mode)

    // 1️⃣ Shared mode: just return base URL/token
    if (mode === 'shared') {
      log('Shared mode → using BASE_URL', { BASE_URL })
      return {
        url: BASE_URL,
        token: DEFAULT_TOKEN,
        containerId: null,
        mode: 'shared',
      }
    }

    // 2️⃣ Docker-per-session mode with Traefik routing
    await ensureTraefikNetwork()

    const image = process.env.TCLAB_CODE_SERVER_IMAGE || 'codercom/code-server:4.21.1'
    const password = DEFAULT_TOKEN
    const sessionShortId = sessionId.replace(/[^a-zA-Z0-9]/g, '').slice(0, 12)
    const containerName = `tclab-session-${sessionShortId}`

    const baseWorkdir =
      process.env.TCLAB_WORKSPACES_ROOT ||
      path.resolve(process.cwd(), 'plugins/teacher-course-lab/docker/workspaces')

    const workspaceDir = path.resolve(baseWorkdir, userId, sessionId)

    log('Docker per-session config', {
      image,
      passwordSet: Boolean(password),
      containerName,
      baseWorkdir,
      workspaceDir,
      cwd: process.cwd(),
      platform: process.platform,
    })

    // Ensure workspace exists
    try {
      fs.mkdirSync(workspaceDir, { recursive: true })
      log('📁 Workspace directory ensured:', workspaceDir)
    } catch (err) {
      log('❌ Failed to create workspace directory', {
        message: err?.message,
        stack: err?.stack,
      })
      throw new Error(`Failed to create workspace directory: ${workspaceDir}`)
    }

    // Host path for Docker volume
    let volumeHostPath = workspaceDir
    if (process.platform === 'win32') {
      // On Windows with Docker Desktop, convert to Windows path format if needed
      volumeHostPath = volumeHostPath.replace(/\\/g, '/')
      // For Docker Desktop on Windows, we may need to use /host_mnt or similar
      // But typically the path works as-is
      log('Using Windows host path for Docker volume:', volumeHostPath)
    } else {
      log('Using POSIX host path for Docker volume:', volumeHostPath)
    }

    // Generate Traefik hostname: lab-<sessionShortId>.localhost
    const traefikHost = `lab-${sessionShortId}.${TRAEFIK_DOMAIN}`
    const traefikUrl = `http://${traefikHost}`

    // Build Traefik labels (properly escaped)
    const routerName = `tclab-${sessionShortId}`
    // Traefik v3 host rule - use backticks for exact matching
    // Format: Host(`hostname`) for Traefik v3
    // We need to escape backticks in the label value: Host(\`hostname\`)
    // Using JSON.stringify to properly escape for the shell command
    const hostRuleValue = `Host(\`${traefikHost}\`)`
    
    // Build labels array - we'll pass them separately to avoid complex escaping
    // Each label is passed as --label key=value
    // For the host rule with backticks, we need proper escaping per platform
    const labels = [
      'traefik.enable=true',
      `traefik.http.routers.${routerName}.rule=${hostRuleValue}`,
      `traefik.http.routers.${routerName}.entrypoints=${TRAEFIK_ENTRYPOINT}`,
      `traefik.http.services.${routerName}.loadbalancer.server.port=8080`,
      `traefik.docker.network=${TRAEFIK_NETWORK}`,
    ]

    // Build docker command using spawn with proper arguments (no shell escaping needed)
    const dockerArgs = [
      'run',
      '-d',
      `--name`, containerName,
      `--network`, TRAEFIK_NETWORK,
    ]

    // Add labels - with spawn, we can pass key=value directly without escaping
    labels.forEach(label => {
      dockerArgs.push('--label', label)
    })

    // Add remaining arguments
    dockerArgs.push(
      '-e', `PASSWORD=${password}`,
      '-v', `${volumeHostPath}:/home/coder/project`,
      image,
      '--auth', 'password',
      '--bind-addr', '0.0.0.0:8080',
      '/home/coder/project',
    )

    const dockerCmdStr = `docker ${dockerArgs.join(' ')}`
    log('🐳 Executing Docker command:', dockerCmdStr)

    try {
      const start = Date.now()
      const { stdout, stderr } = await execDocker(dockerArgs)
      const elapsed = Date.now() - start

      log(`⏱ docker run completed in ${elapsed}ms`)
      if (stderr) log('🐳 docker run STDERR:', stderr)
      if (stdout) log('🐳 docker run STDOUT:', stdout)

      const containerId = stdout.trim()

      log('🟢 Docker container started with Traefik routing', {
        containerId,
        containerName,
        traefikHost,
        traefikUrl,
      })

      // Wait a moment for Traefik to discover the container
      await new Promise(resolve => setTimeout(resolve, 500))

      return {
        url: traefikUrl,
        token: password,
        containerId,
        mode: 'docker-per-session',
        traefikHost,
      }
    } catch (err) {
      log('❌ Failed to spawn docker code-server', {
        message: err?.message,
        stack: err?.stack,
      })
      throw err
    }
  }

  /**
   * Stop & clean up docker-per-session container.
   */
  export async function stopCodeServerForSession(containerId) {
    const mode = (process.env.TCLAB_SPAWNER_MODE || 'shared').toLowerCase()

    log('stopCodeServerForSession() called', { containerId, mode })

    if (!containerId) {
      log('ℹ No containerId provided — skipping stop.')
      return
    }
    if (mode !== 'docker-per-session') {
      log('ℹ Mode is not docker-per-session — skip stopping container.')
      return
    }

    const baseCmd = `docker rm -f ${containerId}`
    const cmd =
      process.platform === 'win32'
        ? `cmd.exe /c ${baseCmd}`
        : baseCmd

    log('🐳 Stopping Docker container with CMD:', cmd)

    try {
      const start = Date.now()
      const { stdout, stderr } = await exec(cmd)
      const elapsed = Date.now() - start

      log(`⏱ docker rm -f completed in ${elapsed}ms`)
      if (stderr) log('🐳 docker rm STDERR:', stderr)
      if (stdout) log('🐳 docker rm STDOUT:', stdout)

      log('🟢 Container removed successfully:', containerId)
    } catch (err) {
      log('❌ Failed to stop container', {
        containerId,
        message: err?.message,
        stack: err?.stack,
      })
    }
  }
