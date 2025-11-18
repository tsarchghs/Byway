import { exec as _exec, spawn } from 'node:child_process';
import { promisify } from 'node:util';
import fs from 'node:fs';
import path from 'node:path';
import { initializeLabProject, buildLabProject } from './project-initializer.mjs';

const exec = promisify(_exec);

function log(...args) {
  console.log(`[TCLab:Spawner][${new Date().toISOString()}]`, ...args);
}

function workspaceHasExistingFiles(dir) {
  try {
    const entries = fs.readdirSync(dir).filter(
      name => !['.DS_Store', '.turbo', '.next', '.nuxt'].includes(name)
    );
    return entries.length > 0;
  } catch {
    return false;
  }
}

/**
 * Normalize Windows path to Docker Desktop mount path
 */
function normalizeDockerPath(p) {
  if (process.platform !== 'win32') return p;
  const drive = p[0].toLowerCase();
  const rest = p.substring(2).replace(/\\/g, '/');
  return `/host_mnt/${drive}${rest}`;
}

/**
 * Shell-safe docker wrapper
 */
function execDocker(args) {
  return new Promise((resolve, reject) => {
    log('🐳 execDocker:', args.join(' '));

    const proc = spawn('docker', args, {
      stdio: ['ignore', 'pipe', 'pipe'],
      shell: false,
    });

    let stdout = '';
    let stderr = '';

    proc.stdout.on('data', d => (stdout += d.toString()));
    proc.stderr.on('data', d => (stderr += d.toString()));

    proc.on('close', code => {
      if (code === 0) resolve({ stdout: stdout.trim(), stderr: stderr.trim() });
      else reject(new Error(stderr || stdout || `Docker exited with code ${code}`));
    });

    proc.on('error', reject);
  });
}

const DEFAULT_TOKEN =
  process.env.CODE_SERVER_DEFAULT_TOKEN ||
  process.env.CODE_SERVER_PASSWORD ||
  'changeme';

const resolvePath = p => {
  if (!p) return undefined;
  return path.isAbsolute(p) ? p : path.resolve(process.cwd(), p);
};
const DEFAULT_CERT_PATH = resolvePath('plugins/teacher-course-lab/certs/local-cert.pem');
const DEFAULT_KEY_PATH = resolvePath('plugins/teacher-course-lab/certs/local-key.pem');
const tlsCertExists = DEFAULT_CERT_PATH && DEFAULT_KEY_PATH && fs.existsSync(DEFAULT_CERT_PATH) && fs.existsSync(DEFAULT_KEY_PATH);
const TRAEFIK_NETWORK = process.env.TCLAB_TRAEFIK_NETWORK || 'tclab-traefik-network';
const TRAEFIK_DOMAIN = '127.0.0.1.nip.io';
const TRAEFIK_ENTRYPOINT = process.env.TCLAB_TRAEFIK_ENTRYPOINT || 'web';
const HOST_PORT_BASE = Number(process.env.TCLAB_CS_PORT_BASE || 30000);
const HOST_PORT_SPREAD = Number(process.env.TCLAB_CS_PORT_SPREAD || 10000);
const APP_HOST_PORT_BASE = Number(process.env.TCLAB_APP_PORT_BASE || 31000);
const APP_HOST_PORT_SPREAD = Number(process.env.TCLAB_APP_PORT_SPREAD || 10000);
const MUTAGEN_ENABLED = String(process.env.TCLAB_ENABLE_MUTAGEN_SYNC || '').toLowerCase() === 'true';
const MUTAGEN_BIN = process.env.TCLAB_MUTAGEN_BIN || 'mutagen';
const MUTAGEN_IGNORES =
  (process.env.TCLAB_MUTAGEN_IGNORE || 'node_modules,.git,.pnpm-store,.npm,.cache').split(',')
    .map(s => s.trim())
    .filter(Boolean);
const MUTAGEN_DATA_DIR = resolvePath(
  process.env.TCLAB_MUTAGEN_DATA_DIR ||
  path.join('plugins', 'teacher-course-lab', 'docker', '.mutagen-data')
);
const TLS_CERT = resolvePath(process.env.TCLAB_CS_TLS_CERT) || (tlsCertExists ? DEFAULT_CERT_PATH : undefined); // host path to cert
const TLS_KEY = resolvePath(process.env.TCLAB_CS_TLS_KEY) || (tlsCertExists ? DEFAULT_KEY_PATH : undefined); // host path to key
const DEFAULT_PROTO = TLS_CERT && TLS_KEY ? 'https' : 'http';
const CODE_SERVER_PROTOCOL = (process.env.TCLAB_CS_PROTOCOL || DEFAULT_PROTO).toLowerCase();

/**
 * Ensure Traefik network exists
 */
async function ensureTraefikNetwork() {
  try {
    await execDocker(['network', 'inspect', TRAEFIK_NETWORK]);
    log(`✅ Traefik network '${TRAEFIK_NETWORK}' exists.`);
  } catch (_) {
    log(`📡 Creating Traefik network '${TRAEFIK_NETWORK}'...`);
    try {
      await execDocker(['network', 'create', TRAEFIK_NETWORK]);
      log(`✅ Created Traefik network '${TRAEFIK_NETWORK}'`);
    } catch (err) {
      log('⚠ Failed creating Traefik network:', err.message);
    }
  }
}

/**
 * Best-effort Mutagen helpers for fast two-way sync when requested.
 * These never throw (to avoid breaking session startup) and log for visibility.
 */
async function runMutagen(args) {
  const cmd = [MUTAGEN_BIN, ...args];
  log('🔁 mutagen:', cmd.join(' '));
  return exec(cmd.join(' '), {
    env: {
      ...process.env,
      MUTAGEN_DATA_DIRECTORY: MUTAGEN_DATA_DIR,
    },
  }); // exec is fine here; args are controlled
}

async function ensureMutagenAvailable() {
  try {
    log('🔁 Mutagen data dir:', MUTAGEN_DATA_DIR);
    fs.mkdirSync(MUTAGEN_DATA_DIR, { recursive: true });
    await runMutagen(['version']);
    return true;
  } catch (err) {
    log('⚠ Mutagen not available, skipping sync:', err?.message || err);
    return false;
  }
}

async function ensureMutagenDaemon() {
  try {
    await runMutagen(['daemon', 'start']);
    return true;
  } catch (err) {
    log('⚠ Mutagen daemon failed to start:', err?.message || err);
    return false;
  }
}

async function startMutagenSync({ name, alpha, beta }) {
  if (!MUTAGEN_ENABLED) return;
  if (!(await ensureMutagenAvailable())) return;
  if (!(await ensureMutagenDaemon())) return;

  const ignoreArgs = MUTAGEN_IGNORES.flatMap(p => ['--ignore', p]);
  try {
    // Clean up any stale session with the same name (best-effort).
    await runMutagen(['sync', 'terminate', name]).catch(() => {});
    await runMutagen([
      'sync', 'create',
      '--name', name,
      '--sync-mode', 'two-way-resolved',
      '--watch-mode', 'portable',
      ...ignoreArgs,
      alpha,
      beta,
    ]);
    log('✅ Mutagen sync started:', name);
  } catch (err) {
    log('⚠ Failed to start Mutagen sync:', err?.message || err);
  }
}

async function stopMutagenSync(name) {
  if (!MUTAGEN_ENABLED) return;
  if (!(await ensureMutagenAvailable())) return;
  try {
    await runMutagen(['sync', 'terminate', name]);
    log('🧹 Mutagen sync terminated:', name);
  } catch (err) {
    log('⚠ Failed to terminate Mutagen sync:', err?.message || err);
  }
}

export async function spawnCodeServerForSession({ sessionId, userId, challengeId, labMeta }) {
log("🔥 RAW INPUT to spawnCodeServerForSession:", {
  sessionId,
  userId,
  challengeId,
  labMeta,
});
  if (sessionId == null) {
    throw new Error("spawnCodeServerForSession() called with sessionId = " + String(sessionId));
  }
  log('spawnCodeServerForSession()', { sessionId, userId, challengeId });
  log('TLS lookup paths:', { TLS_CERT, TLS_KEY, CODE_SERVER_PROTOCOL });

  const mode = (process.env.TCLAB_SPAWNER_MODE || 'docker-per-session').toLowerCase();
  if (mode === 'shared') {
    return {
      url: 'http://codeserver.localhost',
      token: DEFAULT_TOKEN,
      containerId: null,
      mode: 'shared',
    };
  }

  await ensureTraefikNetwork();

  const image = process.env.TCLAB_CODE_SERVER_IMAGE || 'codercom/code-server:4.89.0';
  const password = DEFAULT_TOKEN;

  // ---------------------------
  // SESSION IDENTIFIERS
  // ---------------------------
  if (!sessionId) {
    throw new Error('sessionId is required');
  }

  const sessionShortId = String(sessionId)
    .replace(/[^a-zA-Z0-9]/g, '')
    .slice(0, 12);

  const baseName = `tclab-session-${sessionShortId}`;
  const codeContainerName = `${baseName}-cs`;
  const appContainerName = `${baseName}-app`;

  const baseWorkdir =
    process.env.TCLAB_WORKSPACES_ROOT ||
    path.resolve(process.cwd(), 'plugins/teacher-course-lab/docker/workspaces');

  const workspaceDir = path.resolve(baseWorkdir, userId, sessionId);
  fs.mkdirSync(workspaceDir, { recursive: true });
  const hasExistingFiles = workspaceHasExistingFiles(workspaceDir);
  log('📁 Workspace', workspaceDir, hasExistingFiles ? 'already has files' : 'is empty');

  // ---------------------------
  // INITIALIZE PROJECT
  // ---------------------------
  if (labMeta?.kind) {
    const shouldInit = !hasExistingFiles;
    try {
      if (shouldInit) {
        log('🔧 Initializing lab project…');
        await initializeLabProject(workspaceDir, labMeta);
      } else {
        log('⚙️  Skipping project scaffold; workspace already contains files');
      }
    } catch (err) {
      log('⚠ Project init failed:', err.message);
    }

    if (labMeta?.buildCmd && shouldInit) {
      try {
        await buildLabProject(workspaceDir, labMeta.buildCmd);
      } catch (err) {
        log('⚠ Build failed:', err.message);
      }
    }
  }

  const volumeHostPath =
    process.platform === 'win32'
      ? normalizeDockerPath(workspaceDir)
      : workspaceDir;

  // ---------------------------
  // TRAEFIK ROUTING + PORTS
  // ---------------------------
  const devPort = labMeta?.devPort || 3000;
  const codeServerHost = `${codeContainerName}.${TRAEFIK_DOMAIN}`;
  const appHost = `${appContainerName}.${TRAEFIK_DOMAIN}`;
  const hostPort =
    HOST_PORT_BASE + Math.floor(Math.random() * Math.max(1, HOST_PORT_SPREAD));
  const appHostPort =
    APP_HOST_PORT_BASE + Math.floor(Math.random() * Math.max(1, APP_HOST_PORT_SPREAD));
  const orbLocalHost = `${codeContainerName}.orb.local`;
  const appOrbLocalHost = `${appContainerName}.orb.local`;
  const codeProto = TLS_CERT && TLS_KEY ? CODE_SERVER_PROTOCOL : 'http';

  const appLabels = [
    'traefik.enable=true',

    `traefik.http.routers.${appContainerName}.rule=Host("${appHost}")`,
    `traefik.http.routers.${appContainerName}.entrypoints=${TRAEFIK_ENTRYPOINT}`,
    `traefik.http.services.${appContainerName}.loadbalancer.server.port=${devPort}`,

    `traefik.docker.network=${TRAEFIK_NETWORK}`,
  ];

  // ---------------------------
  // RUN DOCKER
  // ---------------------------
  // Clean up any stale containers with the same names before starting fresh
  const maybeRemove = async name => {
    if (!name) return;
    try {
      await execDocker(['rm', '-f', name]);
      log('🧹 Removed stale container:', name);
    } catch (_) {
      /* ignore */ 
    }
  };
  await maybeRemove(codeContainerName);
  await maybeRemove(appContainerName);

  // Optional TLS mount for code-server (if cert/key provided)
  let certVolume = null;
  let certInContainer = null;
  let keyInContainer = null;
  if (TLS_CERT && TLS_KEY) {
    const certDir = path.dirname(TLS_CERT);
    const keyDir = path.dirname(TLS_KEY);
    const mountDir = certDir === keyDir ? certDir : certDir;
    certVolume = `${mountDir}:/tclab-certs:ro`;
    certInContainer = `/tclab-certs/${path.basename(TLS_CERT)}`;
    keyInContainer = `/tclab-certs/${path.basename(TLS_KEY)}`;
  }
  const appDockerArgs = [
    'run',
    '-d',
    '--name', appContainerName,
    '--network', TRAEFIK_NETWORK,
    '-p', `${appHostPort}:${devPort}`,

    '-e', `PORT=${devPort}`,
    '-e', 'HOST=0.0.0.0',

    '-v', `${volumeHostPath}:/home/coder/project`,
  ];

  appLabels.forEach(l => appDockerArgs.push('--label', l));

  // Prefer dev script (nodemon) to pick up file changes automatically
  const appStartCmd = labMeta?.startCmd || 'npm run dev';
  appDockerArgs.push(
    labMeta?.dockerImage || 'node:22-alpine',
    'sh',
    '-c',
    `cd /home/coder/project && ${appStartCmd}`
  );

  const codeDockerArgs = [
    'run',
    '-d',
    '--user', '0:0', // run code-server as root to avoid host mount permission issues
    '--name', codeContainerName,
    '--network', TRAEFIK_NETWORK,
    '-p', `${hostPort}:8080`,

    '-e', `PASSWORD=${password}`,
    '-e', 'CS_DISABLE_UPDATE_CHECK=true',
    '-e', 'CS_DISABLE_TELEMETRY=true',

    '-v', `${volumeHostPath}:/home/coder/project`,
  ];
  if (certVolume) {
    codeDockerArgs.push('-v', certVolume);
  }

  // Only code-server needs its own (optional) Traefik labels if you want
  const codeLabels = [
    'traefik.enable=true',
    `traefik.http.routers.${codeContainerName}.rule=Host("${codeServerHost}")`,
    `traefik.http.routers.${codeContainerName}.entrypoints=${TRAEFIK_ENTRYPOINT}`,
    `traefik.http.services.${codeContainerName}.loadbalancer.server.port=8080`,
    `traefik.docker.network=${TRAEFIK_NETWORK}`,
  ];
  codeLabels.forEach(l => codeDockerArgs.push('--label', l));

  codeDockerArgs.push(
    image,
    '--auth', 'password',
    '--disable-update-check',
    '--disable-telemetry',
    '--bind-addr', '0.0.0.0:8080',
    ...(certInContainer && keyInContainer
      ? ['--cert', certInContainer, '--cert-key', keyInContainer]
      : []),
    '/home/coder/project'
  );

  log('🐳 Running app container…');
  const { stdout: appStdout } = await execDocker(appDockerArgs);
  const appContainerId = appStdout.trim();
  log('🟢 App container started:', appContainerId);

  log('🐳 Running code-server container…');
  const { stdout } = await execDocker(codeDockerArgs);
  const containerId = stdout.trim();
  log('🟢 Code-server container started:', containerId);

  const mutagenSyncName = `tclab-sync-${sessionShortId}`;
  const mutagenAlpha = workspaceDir;
  const mutagenBeta = `docker://${codeContainerName}/home/coder/project`;
  await startMutagenSync({ name: mutagenSyncName, alpha: mutagenAlpha, beta: mutagenBeta });

  return {
    // Direct host-mapped access (works on OrbStack/Docker Desktop)
    codeServerUrl: `${codeProto}://localhost:${hostPort}`,
    orbLocalUrl: `${codeProto}://${orbLocalHost}:${hostPort}`,
    // Traefik-style hosts (kept for future/production)
    appUrl: `http://localhost:${appHostPort}`,
    appOrbLocalUrl: `http://${appOrbLocalHost}:${appHostPort}`,
    traefikHost: appHost,
    traefikHostCodeServer: codeServerHost,
    traefikHostApp: appHost,
    token: password,
    containerId,
    appContainerId,
    mode: 'docker-per-session',
    port: hostPort,
    appPort: appHostPort,
  };
}

export async function stopCodeServerForSession(input) {
  const containerId = typeof input === 'string' ? input : input?.containerId;
  const sessionId = typeof input === 'object' ? input?.sessionId : null;
  const mode = (process.env.TCLAB_SPAWNER_MODE || 'docker-per-session').toLowerCase();
  if (mode !== 'docker-per-session') return;

  let baseName = null;
  if (sessionId) {
    const sessionShortId = String(sessionId).replace(/[^a-zA-Z0-9]/g, '').slice(0, 12);
    baseName = `tclab-session-${sessionShortId}`;
  }
  const mutagenSyncName = sessionId
    ? `tclab-sync-${String(sessionId).replace(/[^a-zA-Z0-9]/g, '').slice(0, 12)}`
    : null;
  const codeContainerName = baseName ? `${baseName}-cs` : null;
  const appContainerName = baseName ? `${baseName}-app` : null;

  if (containerId) {
    log('🛑 Stopping code-server container:', containerId);
    try {
      await execDocker(['rm', '-f', containerId]);
      log('🗑 Removed code-server container:', containerId);
    } catch (err) {
      log('⚠ Failed to remove code-server container:', err.message);
    }
  } else if (codeContainerName) {
    try {
      await execDocker(['rm', '-f', codeContainerName]);
      log('🗑 Removed code-server container by name:', codeContainerName);
    } catch (err) {
      log('⚠ Failed to remove code-server container by name:', err.message);
    }
  }

  if (appContainerName) {
    log('🛑 Stopping app container:', appContainerName);
    try {
      await execDocker(['rm', '-f', appContainerName]);
      log('🗑 Removed app container:', appContainerName);
    } catch (err) {
      log('⚠ Failed to remove app container:', err.message);
    }
  }

  if (mutagenSyncName) {
    await stopMutagenSync(mutagenSyncName);
  }
}
