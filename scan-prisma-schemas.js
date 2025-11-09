// scan-prisma-schemas.js
// 🧭 Recursively find all schema.prisma files and print them as JSON with path + content
import { readdirSync, readFileSync, statSync } from 'fs';
import path from 'path';
import process from 'process';

function walk(dir, files = []) {
  for (const file of readdirSync(dir)) {
    const full = path.join(dir, file);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      walk(full, files);
    } else if (file === 'schema.prisma') {
      files.push(full);
    }
  }
  return files;
}

function main() {
  const root = process.cwd();
  const schemas = walk(root).map((file) => {
    const content = readFileSync(file, 'utf-8');
    return { path: file, content };
  });

  // Print formatted JSON to stdout
  console.log(JSON.stringify(schemas, null, 2));
}

main();
