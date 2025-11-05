import { defineNuxtModule, createResolver } from '@nuxt/kit'
import fs from 'node:fs'
import path from 'node:path'

export default defineNuxtModule({
  meta: { name: 'bloggrs-plugin-loader' },
  setup(_opts, nuxt) {
    const resolver = createResolver(import.meta.url)
    const rootDir = nuxt.options.rootDir

    const candidates = [
      process.env.BLOGGRS_PLUGINS_DIR,
      path.resolve(rootDir, '../../plugins'),
      path.resolve(rootDir, '../plugins'),
      path.resolve(rootDir, './plugins')
    ].filter(Boolean)

    const pluginsDir = candidates.find(p => p && fs.existsSync(p))
    if (!pluginsDir) {
      console.warn('[plugin-loader] No plugins directory found. Looked in:', candidates)
      return
    }

    const pluginNames = fs.readdirSync(pluginsDir).filter((d) => {
      const full = path.join(pluginsDir, d)
      return fs.statSync(full).isDirectory()
    })

    nuxt.hook('pages:extend', (pages) => {
      for (const name of pluginNames) {
        const pdir = path.join(pluginsDir, name)
        const manifestPath = path.join(pdir, 'manifest.json')

        if (!fs.existsSync(manifestPath)) continue
        const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
        const routes = manifest.routes || []

        for (const r of routes) {
          const file = path.resolve(pdir, r.file)
          if (!fs.existsSync(file)) {
            console.warn(`[plugin-loader] Missing file for route ${r.path} in plugin ${name}:`, file)
            continue
          }

          // Convert Next/Nuxt-style [param] → Nuxt dynamic :param
          const normalizedPath = r.path.replace(/\[([^\]]+)\]/g, ':$1')

          pages.push({
            name: `plugin-${name}-${normalizedPath}`.replace(/[^a-zA-Z0-9_-]/g, '_'),
            path: normalizedPath,
            file
          })
        }
      }
    })
  }
})
