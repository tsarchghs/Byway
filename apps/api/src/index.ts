  import express from "express"
  import cors from "cors"
  import path from "node:path"
  import fs from "node:fs"
  import { pathToFileURL, fileURLToPath } from "node:url"

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
app.use((req, res, next) => {
  if (req.path.startsWith("/api/authentication/graphql")) {
    return next() // Apollo handles parsing itself
  }
  return express.json({ limit: "50mb" })(req, res, next)
})  
  app.use(
    cors({
      origin: ["http://localhost:3000"],
      credentials: true,
    }),
  )

  const PORT = Number(process.env.PORT || 4000)
  const HOST = process.env.HOST || '0.0.0.0'

  // --- Load plugin routers dynamically ---
  const here = path.dirname(fileURLToPath(import.meta.url))
  const candidates = [
    process.env.BLOGGRS_PLUGINS_DIR,
    path.resolve(here, "plugins"),
    path.resolve(process.cwd(), "apps/api/src/plugins"),
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


  // --- Dynamic plugin route discovery ---
  app.get("/api/discovery/routes", (_req, res) => {
    try {
      const base = pluginsDir && fs.existsSync(pluginsDir) ? pluginsDir : null;
      const result = [];
      if (base) {
        const pluginNames = fs
          .readdirSync(base)
          .filter((d) => fs.statSync(path.join(base, d)).isDirectory());
        for (const name of pluginNames) {
          const plugDir = path.join(base, name);
          const manifestPath = path.join(plugDir, "manifest.json");
          let manifest = null;
          if (fs.existsSync(manifestPath)) {
            try { manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8")); } catch {}
          }
          // discover pages
          const pagesRoot = path.join(plugDir, "nuxt", "pages");
          const discoveredPages = [];
          if (fs.existsSync(pagesRoot)) {
            const walk = (p) => {
              for (const entry of fs.readdirSync(p)) {
                const full = path.join(p, entry);
                const stat = fs.statSync(full);
                if (stat.isDirectory()) walk(full);
                else if (entry.endsWith(".vue")) {
                  discoveredPages.push(path.relative(plugDir, full).replace(/\\/g, "/"));
                }
              }
            };
            walk(pagesRoot);
          }
          result.push({ plugin: name, manifest, discoveredPages });
        }
      }
      res.json({ ok: true, plugins: result });
    } catch (e) {
      console.error("[discovery] error", e);
      res.status(500).json({ ok: false, error: e?.message || String(e) });
    }
  });

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true, time: new Date().toISOString() })
  })

  app.listen(PORT, HOST, () => {
    console.log(`[api] listening on http://${HOST === '0.0.0.0' ? 'localhost' : HOST}:${PORT}`)
  })
