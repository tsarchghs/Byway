import { exec } from "child_process";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fsp from "fs/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// base folder where schemas live
const BASE = join(__dirname, "..", "apps/api/src/plugins");

// helper: run prisma command
function run(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, (err, stdout, stderr) => {
      if (stdout) console.log(stdout);
      if (stderr) console.error(stderr);
      err ? reject(err) : resolve();
    });
  });
}

async function findSchemas(dir) {
  const out = [];
  const entries = await fsp.readdir(dir, { withFileTypes: true });

  for (const e of entries) {
    const full = join(dir, e.name);

    // skip generated paths
    if (full.includes("/generated/") || full.includes("\\generated\\")) continue;
    if (full.includes("/client/") || full.includes("\\client\\")) continue;

    if (e.isDirectory()) {
      out.push(...await findSchemas(full));
    } else if (e.isFile() && e.name === "schema.prisma") {
      out.push(full);
    }
  }
  return out;
}

async function main() {
  console.log("Searching for schema.prisma files...\n");

  const schemas = await findSchemas(BASE);

  if (schemas.length === 0) {
    console.log("No schema.prisma files found.");
    return;
  }

  console.log("Found schemas:\n", schemas.join("\n"), "\n");

  for (const schema of schemas) {
    console.log(`\n🚀 Running migrate dev for:\n${schema}\n`);
    await run(`npx prisma migrate dev --schema="${schema}"`);
  }

  console.log("\n✅ All migrations done.");
}

main().catch(err => {
  console.error("❌ Error running migrations:", err);
});
