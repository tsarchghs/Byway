import express from 'express'
import cors from 'cors'
import path from 'node:path'
import fs from 'node:fs'
import { pathToFileURL } from 'node:url'

const app = express()
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000

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
  const pluginNames = fs.readdirSync(pluginsDir).filter((d) => {
    const full = path.join(pluginsDir, d)
    return fs.statSync(full).isDirectory()
  })
  for (const name of pluginNames) {
    const serverEntry = path.join(pluginsDir, name, 'server', 'index.mjs')
    if (fs.existsSync(serverEntry)) {
      const mod = await import(pathToFileURL(serverEntry).href)
      if (typeof mod.register === 'function') {
        mod.register(app)
        console.log(`[api] Loaded plugin server: ${name}`)
      }
    }
  }
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, time: new Date().toISOString() })
})

app.listen(PORT, () => {
  console.log(`[api] listening on http://localhost:${PORT}`)
})
