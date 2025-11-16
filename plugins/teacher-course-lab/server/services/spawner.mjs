import { exec as _exec } from 'node:child_process';
import { promisify } from 'node:util';
import fs from 'node:fs';
import path from 'node:path';

const exec = promisify(_exec);

// Shared-mode defaults (using docker-compose code_server)
const BASE_URL = process.env.CODE_SERVER_BASE_URL || 'http://codeserver.localhost';
const DEFAULT_TOKEN = process.env.CODE_SERVER_DEFAULT_TOKEN || process.env.CODE_SERVER_PASSWORD || 'changeme';

/**
 * Spawn or attach a code-server workspace for a given lab session.
 * Modes:
 *  - shared (default): reuse a shared code-server instance (docker-compose) and just return base URL + token.
 *  - docker-per-session: create a dedicated code-server container per lab session via `docker run`.
 */
export async function spawnCodeServerForSession({ sessionId, userId, challengeId }) {
  const mode = (process.env.TCLAB_SPAWNER_MODE || 'shared').toLowerCase();

  if (mode === 'docker-per-session') {
    const image = process.env.TCLAB_CODE_SERVER_IMAGE || 'codercom/code-server:4.21.1';
    const password = DEFAULT_TOKEN;
    const containerName = `tclab-session-${sessionId.slice(0, 12)}`;
    const baseWorkdir = process.env.TCLAB_WORKSPACES_ROOT ||
      path.resolve(process.cwd(), 'plugins/teacher-course-lab/docker/workspaces');
    const workspaceDir = path.resolve(baseWorkdir, userId, sessionId);

    fs.mkdirSync(workspaceDir, { recursive: true });

    // Best-effort ephemeral port for this container
    const port = Number(process.env.TCLAB_SESSION_PORT_BASE || 10000) + Math.floor(Math.random() * 40000);

    const cmd = [
      'docker run -d',
      `--name ${containerName}`,
      `-p ${port}:8080`,
      `-e PASSWORD=${password}`,
      `-v "${workspaceDir}:/home/coder/project"`,
      image,
      '--auth password',
      '--bind-addr 0.0.0.0:8080',
      '/home/coder/project'
    ].join(' ');

    try {
      const { stdout, stderr } = await exec(cmd);
      if (stderr) {
        console.warn('[teacher-course-lab] docker run stderr:', stderr);
      }
      const containerId = stdout.trim();
      return {
        url: `http://localhost:${port}`,
        token: password,
        containerId,
        mode: 'docker-per-session'
      };
    } catch (e) {
      console.error('[teacher-course-lab] Failed to spawn docker code-server:', e?.message || e);
      throw e;
    }
  }

  // SHARED MODE: assume a single code-server is running under BASE_URL
  return {
    url: BASE_URL,
    token: DEFAULT_TOKEN,
    containerId: null,
    mode: 'shared'
  };
}

export async function stopCodeServerForSession(containerId) {
  if (!containerId) return;
  const mode = (process.env.TCLAB_SPAWNER_MODE || 'shared').toLowerCase();
  if (mode !== 'docker-per-session') return;

  try {
    await exec(`docker rm -f ${containerId}`);
  } catch (e) {
    console.warn('[teacher-course-lab] Failed to stop container', containerId, e?.message || e);
  }
}
