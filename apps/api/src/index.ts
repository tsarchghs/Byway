import express from "express"
import cors from "cors"
import path from "node:path"
import fs from "node:fs"
import { pathToFileURL } from "node:url"

// ✅ bring Nexus internals into scope
import { makeSchema } from "nexus"
import * as Nexus from "nexus/dist/core"

// --- Nexus runtime duplicate detection patch ---
const seen = new Set<string>()
const SchemaBuilder = Nexus.SchemaBuilder
if (SchemaBuilder && !SchemaBuilder.__patchedForDuplicates) {
  const originalAddType = SchemaBuilder.prototype.addType
  SchemaBuilder.prototype.addType = function (typeDef: any) {
    const name = typeDef?.name ?? "unknown"
    if (seen.has(name)) {
      console.warn(`⚠️ Runtime duplicate Nexus type detected: "${name}"`)
      console.warn("   ↳ Check if multiple plugins export the same objectType")
    }
    seen.add(name)
    return originalAddType.call(this, typeDef)
  }
  // prevent double-patching
  SchemaBuilder.__patchedForDuplicates = true
}

// --- Express setup ---
const app = express()

app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  }),
)

// GraphQL body-parser exception
app.use((req, res, next) => {
  if (req.path.startsWith("/api/authentication/graphql")) next()
  else express.json()(req, res, next)
})

const PORT = Number(process.env.PORT || 4000)

// --- Load plugin routers dynamically ---
const candidates = [
  process.env.BLOGGRS_PLUGINS_DIR,
  path.resolve(process.cwd(), "../../plugins"),
  path.resolve(process.cwd(), "../plugins"),
  path.resolve(process.cwd(), "./plugins"),
].filter(Boolean) as string[]

const pluginsDir = candidates.find((p) => fs.existsSync(p))
if (!pluginsDir) {
  console.warn("[api] No plugins directory found. Looked in:", candidates)
} else {
  const pluginNames = fs
    .readdirSync(pluginsDir)
    .filter((d) => fs.statSync(path.join(pluginsDir, d)).isDirectory())

  for (const name of pluginNames) {
    const serverEntry = path.join(pluginsDir, name, "server", "index.mjs")
    if (fs.existsSync(serverEntry)) {
      const mod = await import(pathToFileURL(serverEntry).href)
      if (typeof mod.register === "function") {
        mod.register(app)
        console.log(`[api] Loaded plugin server: ${name}`)
      }
    }
  }

  // static assets per plugin
  for (const name of pluginNames) {
    const publicDir = path.join(pluginsDir, name, "public")
    if (fs.existsSync(publicDir)) {
      app.use(`/plugins/${name}`, express.static(publicDir))
      console.log(`[api] Serving static: /plugins/${name} -> ${publicDir}`)
    }
  }
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, time: new Date().toISOString() })
})

app.listen(PORT, () => {
  console.log(`[api] listening on http://localhost:${PORT}`)
})
