// apps/production/server.mjs
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import express from 'express'
import compression from 'compression'
import cors from 'cors'
import fs from 'fs'

// —— Resolve __dirname (ESM)
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// —— Directories
const ROOT = join(__dirname, '..', '..')          // monorepo root
const API_DIST = join(ROOT, 'apps/api/dist')      // built API
const NUXT_OUTPUT = join(ROOT, 'apps/web/.output')// built Nuxt bundle
const PLUGINS_DIR = join(ROOT, 'plugins')

// —— Create main express instance
const app = express()

// —— Production middlewares
app.use(cors({ origin: '*', credentials: true }))
app.use(express.json())
app.use(compression())

// ============================================================
// 1. Mount API (apps/api)
// ============================================================

// The API must export a "createServer" or "default" express app.
// Your dist/index.js ALWAYS exports a function register(app) in our setup.
const apiEntry = join(API_DIST, 'index.js')

if (fs.existsSync(apiEntry)) {
  const apiModule = await import(apiEntry)

  if (typeof apiModule.register === 'function') {
    console.log('[API] Registering API into combined server...')
    await apiModule.register(app)
  } else if (typeof apiModule.default === 'function') {
    console.log('[API] Mounting API default export...')
    const apiApp = apiModule.default
    app.use('/api', apiApp)
  } else {
    console.warn('[API] No register() export found in dist/index.js')
  }
} else {
  console.warn('[API] dist/index.js missing — Did you run pnpm build in apps/api?')
}

// ============================================================
// 2. Mount plugin servers
// ============================================================

console.log('[Plugins] Loading plugin servers...')

const pluginNames = fs.readdirSync(PLUGINS_DIR)

for (const plugin of pluginNames) {
  const pluginServerDir = join(PLUGINS_DIR, plugin, 'server')
  const pluginIndex = join(pluginServerDir, 'index.mjs')

  if (fs.existsSync(pluginIndex)) {
    console.log(`→ Registering plugin server: ${plugin}`)

    try {
      const mod = await import(pluginIndex)

      if (typeof mod.register === 'function') {
        await mod.register(app)
        console.log(`   ✔ registered ${plugin}`)
      } else {
        console.warn(`   ⚠ ${plugin} missing register(app) export`)
      }
    } catch (err) {
      console.error(`   ❌ Failed loading plugin: ${plugin}`, err)
    }
  }

  const publicDir = join(PLUGINS_DIR, plugin, 'public')
  if (fs.existsSync(publicDir)) {
    console.log(`→ Mounting static assets: /plugins/${plugin}`)
    app.use(`/plugins/${plugin}`, express.static(publicDir))
  }
}

// ============================================================
// 3. Mount Nuxt server
// ============================================================

console.log('[Nuxt] Bootstrapping Nitro server...')

const nitroServer = await import(join(NUXT_OUTPUT, 'server/index.mjs'))

// Nitro's handler is always exported as "default"
app.use(nitroServer.default)

// ============================================================
// 4. Start combined server
// ============================================================

const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
  console.log(`🚀 Combined production server running at http://localhost:${PORT}`)
})
