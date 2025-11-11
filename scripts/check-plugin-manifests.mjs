
import fs from 'fs'
import path from 'path'
import chalk from 'chalk'

const pluginsDir = path.join(process.cwd(), 'plugins')

if (!fs.existsSync(pluginsDir)) {
  console.error(chalk.red(`❌ No plugins directory found at ${pluginsDir}`))
  process.exit(1)
}

console.log(chalk.cyanBright(`🔍 Checking plugin manifests in ${pluginsDir}...\n`))

let hasErrors = false

for (const plugin of fs.readdirSync(pluginsDir)) {
  const pluginPath = path.join(pluginsDir, plugin)
  if (!fs.statSync(pluginPath).isDirectory()) continue

  const manifestPath = path.join(pluginPath, 'manifest.json')
  if (!fs.existsSync(manifestPath)) {
    console.warn(chalk.yellow(`⚠️  ${plugin}: Missing manifest.json`))
    continue
  }

  try {
    const data = JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
    const errors = []

    // Validate name
    if (typeof data.name !== 'string' || !data.name.trim())
      errors.push('Invalid or missing "name" field')

    // Validate routes
    if (!Array.isArray(data.routes))
      errors.push('"routes" must be an array')
    else {
      data.routes.forEach((route, idx) => {
        if (typeof route === 'string') {
          // allowed shorthand string routes (just path)
          return
        }
        if (typeof route !== 'object' || !route.path || !route.file)
          errors.push(`Route #${idx + 1} missing "path" or "file"`)
      })
    }

    // If any errors
    if (errors.length > 0) {
      hasErrors = true
      console.log(chalk.redBright(`❌ ${plugin}/manifest.json has issues:`))
      for (const err of errors) console.log(`   - ${chalk.yellow(err)}`)
    } else {
      console.log(chalk.greenBright(`✅ ${plugin}/manifest.json OK`))
    }
  } catch (e) {
    hasErrors = true
    console.log(chalk.redBright(`❌ ${plugin}/manifest.json is not valid JSON`))
    console.error(chalk.gray(`   ${e.message}`))
  }

  console.log(chalk.dim('──────────────────────────────'))
}

if (hasErrors) {
  console.log(chalk.redBright('\n⚠️  Some plugin manifests are invalid.\n'))
  process.exitCode = 1
} else {
  console.log(chalk.greenBright('\n✅ All manifests are valid!\n'))
}