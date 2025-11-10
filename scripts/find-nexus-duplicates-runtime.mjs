// Detects duplicated Nexus type names at runtime
import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../plugins");

const seen = new Map();
const duplicates = [];

function scan(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) scan(p);
    else if (e.name.endsWith(".ts") || e.name.endsWith(".js")) {
      const text = fs.readFileSync(p, "utf-8");
      const matches = text.match(/name:\s*['"`]([A-Z][A-Za-z0-9_]*)['"`]/g) || [];
      for (const m of matches) {
        const name = m.split(/['"`]/)[1];
        if (seen.has(name)) duplicates.push([name, seen.get(name), p]);
        else seen.set(name, p);
      }
    }
  }
}

console.log("🔍 Scanning plugin Nexus type definitions...\n");
scan(root);

if (duplicates.length) {
  console.log("⚠️  Duplicate Nexus type names found:\n");
  for (const [name, first, second] of duplicates) {
    console.log(`Type "${name}" declared twice:\n  ↳ ${first}\n  ↳ ${second}\n`);
  }
} else {
  console.log("✅ No duplicate Nexus type names detected.\n");
}
