#!/usr/bin/env node
/**
 * Byway Monorepo Nexus Type Analyzer
 * ----------------------------------
 * Scans all `nexus/*.ts` files under `/plugins` and `/apps/api`
 * to detect duplicate or conflicting Nexus GraphQL type definitions.
 *
 * Detects:
 *   - Duplicate GraphQL `name` values
 *   - Mixed type definitions (objectType, enumType, inputObjectType)
 *   - Possibly extended types without removing originals
 */

import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import chalk from "chalk"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, "..")

// Directories to scan
const SCAN_DIRS = [
  path.join(ROOT, "apps", "api"),
  path.join(ROOT, "plugins"),
]

// Type patterns to detect
const TYPE_PATTERNS = [
  /objectType\s*\(\s*{[^}]*name\s*:\s*["'`](.*?)["'`]/g,
  /inputObjectType\s*\(\s*{[^}]*name\s*:\s*["'`](.*?)["'`]/g,
  /enumType\s*\(\s*{[^}]*name\s*:\s*["'`](.*?)["'`]/g,
  /interfaceType\s*\(\s*{[^}]*name\s*:\s*["'`](.*?)["'`]/g,
  /unionType\s*\(\s*{[^}]*name\s*:\s*["'`](.*?)["'`]/g,
]

/**
 * Recursively scan a directory for .ts or .js files
 */
function walk(dir) {
  let results = []
  for (const file of fs.readdirSync(dir)) {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)
    if (stat.isDirectory()) {
      results = results.concat(walk(filePath))
    } else if (/\.(ts|js|mjs)$/.test(file)) {
      results.push(filePath)
    }
  }
  return results
}

/**
 * Extract GraphQL type names from a file
 */
function extractTypeNames(filePath) {
  const content = fs.readFileSync(filePath, "utf8")
  const types = []

  for (const pattern of TYPE_PATTERNS) {
    let match
    while ((match = pattern.exec(content))) {
      types.push({
        name: match[1],
        file: filePath,
        line: content.substring(0, match.index).split("\n").length,
      })
    }
  }

  return types
}

/**
 * Analyze project for duplicate GraphQL type names
 */
function analyze() {
  const allFiles = SCAN_DIRS.flatMap(walk)
  const nexusFiles = allFiles.filter((f) => f.includes("nexus"))

  const typeMap = new Map()
  const duplicates = new Map()

  for (const file of nexusFiles) {
    const found = extractTypeNames(file)
    for (const type of found) {
      if (typeMap.has(type.name)) {
        if (!duplicates.has(type.name)) {
          duplicates.set(type.name, [typeMap.get(type.name)])
        }
        duplicates.get(type.name).push(type)
      } else {
        typeMap.set(type.name, type)
      }
    }
  }

  console.log(chalk.cyan.bold(`🧩 Scanned ${nexusFiles.length} Nexus files\n`))

  if (duplicates.size === 0) {
    console.log(chalk.green("✅ No duplicate GraphQL type names found."))
  } else {
    console.log(chalk.red.bold("⚠️  Duplicate GraphQL type definitions detected:\n"))
    for (const [name, entries] of duplicates.entries()) {
      console.log(chalk.yellow(`• Type: ${name}`))
      for (const entry of entries) {
        console.log(`  ↳ ${chalk.gray(entry.file)}:${chalk.white(entry.line)}`)
      }
      console.log()
    }
  }

  // Optional: Suggest possible extension conflicts
  const possibleExtensions = Array.from(typeMap.entries())
    .filter(([name]) => name.toLowerCase().includes("extend") || name.toLowerCase().includes("extra"))

  if (possibleExtensions.length > 0) {
    console.log(chalk.magenta("🧠 Possible extended or derived types:"))
    for (const [name, entry] of possibleExtensions) {
      console.log(`  ↳ ${name}  (${chalk.gray(entry.file)})`)
    }
  }

  console.log()
  console.log(chalk.dim("Tip: If duplicates exist, consolidate them into a shared `sharedTypes.ts` file."))
}

analyze()
