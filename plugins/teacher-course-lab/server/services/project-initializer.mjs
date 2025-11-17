import fs from 'node:fs/promises';
import path from 'node:path';
import { exec as _exec } from 'node:child_process';
import { promisify } from 'node:util';
import { spawn } from 'node:child_process';

export async function runCommand(cmd, cwd) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, {
      cwd,
      shell: true,
      env: process.env,
      stdio: 'inherit'
    });

    child.on('exit', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Command failed with exit ${code}`));
    });
  });
}
const exec = promisify(_exec);

function log(...args) {
  console.log(`[TCLab:ProjectInit][${new Date().toISOString()}]`, ...args);
}

/**
 * Initialize a lab project based on lab metadata.
 * Creates the project structure, package.json, and basic files.
 * 
 * @param {string} workspaceDir - Directory where the project will be initialized
 * @param {object} labMeta - Lab metadata from lesson.metadata.lab
 * @returns {Promise<void>}
 */
export async function initializeLabProject(workspaceDir, labMeta) {
  log('initializeLabProject()', { workspaceDir, kind: labMeta?.kind });

  if (!labMeta || !labMeta.kind) {
    throw new Error('Lab metadata missing or invalid');
  }

  // Ensure workspace directory exists
  await fs.mkdir(workspaceDir, { recursive: true });

  const kind = labMeta.kind;
  const dockerImage = labMeta.dockerImage || (kind === 'BACKEND_NODE' ? 'node:22-alpine' : 'node:22-alpine');
  const buildCmd = labMeta.buildCmd || (kind === 'BACKEND_NODE' ? 'npm install' : 'npm install');
  const startCmd = labMeta.startCmd || (kind === 'BACKEND_NODE' ? 'npm start' : 'npm run dev');
  const devPort = labMeta.devPort || (kind === 'BACKEND_NODE' ? 3000 : 3000);

  if (kind === 'BACKEND_NODE') {
    await initializeExpressProject(workspaceDir, { buildCmd, startCmd, devPort });
  } else if (kind === 'FRONTEND_NUXT') {
    await initializeNuxtProject(workspaceDir, { buildCmd, startCmd, devPort });
  } else {
    throw new Error(`Unsupported lab kind: ${kind}`);
  }

  log('✅ Project initialized successfully');
}

/**
 * Initialize a basic Express.js project
 */
async function initializeExpressProject(workspaceDir, { buildCmd, startCmd, devPort }) {
  log('Initializing Express project...');

  const resolveScript = (cmd, fallback) => {
    if (!cmd) return fallback;
    const lower = cmd.trim().toLowerCase();
    // avoid recursive "npm start" -> "npm start"
    if (lower === 'npm start') return fallback;
    return cmd;
  };

  // Create package.json
  const packageJson = {
    name: 'lab-backend',
    version: '1.0.0',
    type: 'module',
    scripts: {
      start: resolveScript(startCmd, 'node server.js'),
      dev: resolveScript(startCmd, 'node server.js')
    },
    dependencies: {
      express: '^5.1.0',
      cors: '^2.8.5'
    }
  };

  await fs.writeFile(
    path.join(workspaceDir, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  );

  // Create basic server.js
  const serverJs = `import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || ${devPort};

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  // Align with lab test expectations
  res.json({ ok: true, status: 'healthy', message: 'Hello' });
});

// TODO: Add your API routes here

app.listen(PORT, () => {
  console.log(\`Server running on http://localhost:\${PORT}\`);
});
`;

  await fs.writeFile(path.join(workspaceDir, 'server.js'), serverJs);

  // Create .gitignore
  const gitignore = `node_modules/
.env
*.log
.DS_Store
`;
  await fs.writeFile(path.join(workspaceDir, '.gitignore'), gitignore);

  // Create README
  const readme = `# Lab Backend Project

This is your lab workspace. Modify \`server.js\` to implement the required functionality.

## Getting Started

\`\`\`bash
npm install
npm start
\`\`\`

The server will run on http://localhost:${devPort}
`;
  await fs.writeFile(path.join(workspaceDir, 'README.md'), readme);

  log('✅ Express project created');
}

/**
 * Initialize a basic Nuxt.js project
 */
async function initializeNuxtProject(workspaceDir, { buildCmd, startCmd, devPort }) {
  log('Initializing Nuxt project...');
await runCommand("npm install nuxt@latest", workspaceDir);
  // Create package.json
  const packageJson = {
    name: 'lab-frontend',
    version: '1.0.0',
    type: 'module',
    scripts: {
      dev: startCmd || 'nuxt dev',
      build: 'nuxt build',
      start: 'nuxt start'
    },
    dependencies: {
      nuxt: '^4.2.0'
    },
    devDependencies: {}
  };

  await fs.writeFile(
    path.join(workspaceDir, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  );

  // Create nuxt.config.ts
  const nuxtConfig = `export default defineNuxtConfig({
  devServer: {
    port: ${devPort},
    host: '0.0.0.0'
  },
  ssr: false, // SPA mode for labs
  future: {
    compatibilityVersion: 4
  }
});
`;

  await fs.writeFile(path.join(workspaceDir, 'nuxt.config.ts'), nuxtConfig);

  // Create app.vue
  const appVue = `<template>
  <div>
    <h1>Lab Frontend Project</h1>
    <p>Edit this file to build your UI.</p>
    <NuxtPage />
  </div>
</template>

<script setup>
// Your app logic here
</script>
`;

  await fs.mkdir(path.join(workspaceDir, 'pages'), { recursive: true });
  await fs.writeFile(path.join(workspaceDir, 'app.vue'), appVue);

  // Create pages/index.vue
  const indexVue = `<template>
  <div>
    <h2>Home Page</h2>
    <p>Implement your UI here.</p>
  </div>
</template>

<script setup>
// Your page logic here
</script>
`;

  await fs.writeFile(path.join(workspaceDir, 'pages/index.vue'), indexVue);

  // Create .gitignore
  const gitignore = `node_modules/
.nuxt/
.output/
.env
*.log
.DS_Store
`;
  await fs.writeFile(path.join(workspaceDir, '.gitignore'), gitignore);

  // Create README
  const readme = `# Lab Frontend Project

This is your lab workspace. Modify \`pages/\` and \`app.vue\` to implement the required UI.

## Getting Started

\`\`\`bash
npm install
npm run dev
\`\`\`

The app will run on http://localhost:${devPort}
`;
  await fs.writeFile(path.join(workspaceDir, 'README.md'), readme);

  log('✅ Nuxt project created');
}

/**
 * Run build command in workspace (if needed)
 */
export async function buildLabProject(workspaceDir, buildCmd) {
  if (!buildCmd) return;

  log('Building project...', { buildCmd });

  try {
    await runCommand(buildCmd, workspaceDir)
    log('✅ Build completed');
  } catch (err) {
    log('⚠️ Build failed (continuing anyway):', err.message);
    // Don't throw - let the project continue even if build fails
  }
}
