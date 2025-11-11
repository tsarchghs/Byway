import { defineNuxtModule, createResolver } from '@nuxt/kit'
import fs from 'node:fs'
import path from 'node:path'
import chalk from 'chalk'

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
      console.warn(chalk.red('[plugin-loader] ❌ No plugins directory found.\nLooked in:\n') +
        candidates.map(c => '  - ' + c).join('\n'))
      return
    }

    const pluginNames = fs.readdirSync(pluginsDir).filter(d => {
      const full = path.join(pluginsDir, d)
      return fs.statSync(full).isDirectory()
    })

    console.log(chalk.cyanBright(`🔍 [plugin-loader] Loading ${pluginNames.length} plugins from ${pluginsDir}\n`))

    nuxt.hook('pages:extend', (pages) => {
      for (const name of pluginNames) {
        const pdir = path.join(pluginsDir, name)
        const manifestPath = path.join(pdir, 'manifest.json')
        let manifest
        const errors = []

        // 🔸 Validate manifest presence
        if (!fs.existsSync(manifestPath)) {
          console.warn(chalk.yellow(`⚠️  [${name}] Missing manifest.json`))
          continue
        }

        // 🔸 Try to parse manifest.json
        try {
          const raw = fs.readFileSync(manifestPath, 'utf8')
          manifest = JSON.parse(raw)
        } catch (e) {
          console.error(chalk.red(`❌ [${name}] Invalid JSON in manifest.json`))
          console.error(chalk.gray(`   ${e.message}`))
          continue
        }

        // 🔸 Basic validation
        if (!manifest.name || typeof manifest.name !== 'string')
          errors.push('Missing or invalid "name" field')
        if (!Array.isArray(manifest.routes))
          errors.push('"routes" field must be an array')

        const routes = manifest.routes || []
        const goodRoutes = []

        for (const [i, r] of routes.entries()) {
          // Allow string-only shorthand (like "/institutions/[slug]/classrooms/[id]/gradebook")
          if (typeof r === 'string') {
            goodRoutes.push({ path: r, file: null })
            continue
          }

          // Validate required keys
          if (!r.path || !r.file) {
            errors.push(`Route #${i + 1} missing "path" or "file"`)
            continue
          }

          const file = path.resolve(pdir, r.file)
          if (!fs.existsSync(file)) {
            errors.push(`File not found for route "${r.path}" → ${file}`)
            continue
          }

          // Normalize [param] → :param
          const normalizedPath = r.path.replace(/\[([^\]]+)\]/g, ':$1')

          pages.push({
            name: `plugin-${name}-${normalizedPath}`.replace(/[^a-zA-Z0-9_-]/g, '_'),
            path: normalizedPath,
            file
          })
        }

        // 🔸 Output results per plugin
        if (errors.length > 0) {
          console.log(chalk.redBright(`\n❌ [${name}] Found ${errors.length} issue(s):`))
          for (const e of errors) console.log('   - ' + chalk.yellow(e))
        } else {
          console.log(chalk.greenBright(`✅ [${name}] All routes loaded successfully (${routes.length})`))
        }

        console.log(chalk.dim('──────────────────────────────'))
      }

      console.log(chalk.greenBright('\n✨ [plugin-loader] Plugin route extension complete\n'))
    })
  }
})
