import express from 'express'
import cors from 'cors'
import path from 'node:path'
import fs from 'node:fs'
import { pathToFileURL } from 'node:url'
import { EventEmitter } from 'events'
EventEmitter.defaultMaxListeners = 30

const app = express()

app.use(cors({
  origin: ['http://localhost:3000'], // your frontend(s)
  credentials: true, // allow cookies / auth headers
}))
app.use((req, res, next) => {
  if (req.path.startsWith('/api/authentication/graphql')) {
    // skip global JSON parser
    next()
  } else {
    express.json()(req, res, next)
  }
})
const PORT = process.env.PORT ? Number(process.env.PORT) : 4000
process.on('unhandledRejection', (reason) => { console.error('[api] UnhandledRejection', reason) })
process.on('uncaughtException', (err) => { console.error('[api] UncaughtException', err) })

// Load plugin routers
const candidates = [
  process.env.BLOGGRS_PLUGINS_DIR,
  path.resolve(process.cwd(), '../../plugins'),
  path.resolve(process.cwd(), '../plugins'),
  path.resolve(process.cwd(), './plugins')
].filter(Boolean) as string[]

const pluginsDir = candidates.find(p => fs.existsSync(p))
if (!pluginsDir) {
  console.warn('[api] No plugins directory found. Looked in:', candidates)
} else {
  const pluginStates: any[] = []
  const pluginNames = fs.readdirSync(pluginsDir).filter((d) => {
    const full = path.join(pluginsDir, d)
    return fs.statSync(full).isDirectory()
  })
  for (const name of pluginNames) {
    const serverEntry = path.join(pluginsDir, name, 'server', 'index.mjs')
    if (fs.existsSync(serverEntry)) {
      try {
        const mod = await import(pathToFileURL(serverEntry).href)
        if (typeof mod.register === 'function') {
          await mod.register(app)
          pluginStates.push({ name, status: 'loaded' })
          console.log(`[api] Loaded plugin server: ${name}`)
        } else {
          pluginStates.push({ name, status: 'invalid' })
        }
      } catch (e: any) {
        pluginStates.push({ name, status: 'error', error: e?.message || String(e) })
        console.error(`[api] Failed to load plugin server: ${name}`, e)
      }
    } else {
      pluginStates.push({ name, status: 'missing' })
    }
  }
  for (const name of pluginNames) {
    const publicDir = path.join(pluginsDir, name, 'public')
    if (fs.existsSync(publicDir)) {
      app.use(`/plugins/${name}`, express.static(publicDir))
      console.log(`[api] Serving static: /plugins/${name} -> ${publicDir}`)
    }
  }
  app.get('/api/status', (_req, res) => {
    res.json({ ok: true, port: PORT, plugins: pluginStates })
  })
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, time: new Date().toISOString() })
})

app.use((err: any, _req: any, res: any, _next: any) => {
  const status = err?.status || 500
  const code = err?.code || 'INTERNAL_SERVER_ERROR'
  res.status(status).json({ ok: false, error: { code, message: String(err?.message || err), stack: process.env.NODE_ENV === 'development' ? err?.stack : undefined } })
})

const server = app.listen(PORT, () => {
  console.log(`[api] listening on http://localhost:${PORT}`)
})
server.on('error', (e) => { console.error('[api] listen error', e) })
