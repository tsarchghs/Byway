#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import chalk from "chalk";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "../plugins");

console.log(chalk.cyanBright("🛠️ Nexus Namespace Auto-Fixer (prefix='Gql')\n"));

function getNexusFiles() {
  const files = [];
  const walk = (dir) => {
    if (!fs.existsSync(dir)) return;
    for (const f of fs.readdirSync(dir)) {
      const full = path.join(dir, f);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) walk(full);
      else if (f.endsWith(".ts") && full.includes("/server/nexus/")) files.push(full);
    }
  };
  walk(rootDir);
  return files;
}

const files = getNexusFiles();
const changes = [];

for (const file of files) {
  let src = fs.readFileSync(file, "utf8");
  let modified = false;

  // Find all exports with objectType({ name: 'GqlXyz' })
  src = src.replace(/export\s+const\s+(\w+)\s*=\s*objectType\s*\(\s*\{([\s\S]*?)name\s*:\s*['"](Gql\w+)['"]/g,
    (m, exportName, before, gqlName) => {
      if (exportName !== gqlName) {
        console.log(chalk.yellow(`🔧 Fixing export in ${file}`));
        changes.push({ file, from: exportName, to: gqlName });
        modified = true;
        return `export const ${gqlName} = objectType({${before}name: '${gqlName}'`;
      }
      return m;
    });

  if (modified) {
    fs.writeFileSync(file + ".bak", src);
    fs.writeFileSync(file, src, "utf8");
  }
}

if (!changes.length) {
  console.log(chalk.green("✅ No fixes needed. All Nexus exports already match GraphQL type names."));
} else {
  console.log(chalk.greenBright(`\n✅ Fixed ${changes.length} mismatched Nexus exports.`));
  changes.forEach(c => console.log(`   ${chalk.gray(path.relative(rootDir, c.file))}: ${chalk.red(c.from)} → ${chalk.green(c.to)}`));
}
