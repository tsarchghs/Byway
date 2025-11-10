#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import chalk from "chalk";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..", "plugins");

console.log(chalk.cyanBright("🔍 Nexus Type Analyzer — Detecting Missing / Mismatched Types\n"));


function getAllNexusFiles() {
  const files = [];
  function walk(dir) {
    if (!fs.existsSync(dir)) return;
    for (const file of fs.readdirSync(dir)) {
      const full = path.join(dir, file);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) walk(full);
      else if (file.endsWith(".ts") && full.includes("/server/nexus/")) files.push(full);
    }
  }
  walk(rootDir);
  return files;
}

const nexusFiles = getAllNexusFiles();
if (!nexusFiles.length) {
  console.log(chalk.yellow("⚠️  No Nexus files found."));
  process.exit(0);
}

let issues = [];

for (const file of nexusFiles) {
  const content = fs.readFileSync(file, "utf8");

  // Find export const Something = objectType({ name: 'Xyz' })
  const exportMatches = [...content.matchAll(/export\s+const\s+(\w+)\s*=\s*objectType\s*\(\s*\{[\s\S]*?name\s*:\s*['"]([\w]+)['"]/g)];
  for (const match of exportMatches) {
    const exportName = match[1];
    const gqlName = match[2];

    if (exportName !== gqlName) {
      issues.push({
        file,
        exportName,
        gqlName,
        type: "Mismatch",
        message: `Exported as "${exportName}" but GraphQL type is "${gqlName}"`,
      });
    }

    if (!gqlName.startsWith("Gql") && !exportName.startsWith("Gql")) {
      issues.push({
        file,
        exportName,
        gqlName,
        type: "Unprefixed",
        message: `Type "${exportName}" not prefixed with "Gql"`,
      });
    }
  }
}

if (!issues.length) {
  console.log(chalk.greenBright("✅ All Nexus types are consistent (no missing or mismatched names)."));
  process.exit(0);
}

console.log(chalk.redBright(`⚠️ Found ${issues.length} inconsistent type declarations:\n`));
for (const issue of issues) {
  console.log(
    chalk.yellowBright(`• ${issue.file}\n  → ${chalk.white(issue.message)}\n`)
  );
}

/**
 * Check schema imports for missing Gql-prefixed types
 */
const gqlImportsCheck = [];

for (const plugin of fs.readdirSync(rootDir)) {
  const gqlIndex = path.join(rootDir, plugin, "server/graphql/index.ts");
  if (!fs.existsSync(gqlIndex)) continue;

  const content = fs.readFileSync(gqlIndex, "utf8");
  const missing = [];

  for (const issue of issues) {
    const base = path.basename(issue.file, ".ts");
    const typeName = issue.gqlName || issue.exportName;
    if (content.includes(base) && !content.includes(typeName)) {
      missing.push({ base, typeName });
    }
  }

  if (missing.length) {
    gqlImportsCheck.push({ gqlIndex, missing });
  }
}

if (gqlImportsCheck.length) {
  console.log(chalk.magentaBright("\n🔍 Schema Import Analysis — Possible Missing or Wrong Imports:\n"));
  for (const entry of gqlImportsCheck) {
    console.log(chalk.cyan(entry.gqlIndex));
    for (const miss of entry.missing) {
      console.log(`  ⚠️  Should import "${miss.typeName}" (from ${miss.base}.ts)`);
    }
    console.log();
  }
}

console.log(chalk.gray("\n💡 Tip: Run 'node scripts/nexus-namespace-fix.mjs' to auto-rename exports."));
