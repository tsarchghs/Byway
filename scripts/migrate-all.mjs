#!/usr/bin/env node
import { execSync } from "node:child_process";
import { readdirSync, existsSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const pluginsDir = path.join(root, "plugins");

for (const plugin of readdirSync(pluginsDir)) {
  const schemaPath = path.join(pluginsDir, plugin, "server/db/schema.prisma");
  if (existsSync(schemaPath)) {
    console.log(`\n📦 Migrating ${plugin}...`);
    try {
      execSync(
        `npx prisma migrate dev --schema="${schemaPath}" --name init`,
        { stdio: "inherit" }
      );
    } catch (e) {
      console.error(`❌ Migration failed for ${plugin}`);
    }
  }
}

console.log("\n✅ All plugin schemas migrated!");
