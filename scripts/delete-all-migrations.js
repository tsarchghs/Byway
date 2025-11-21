#!/usr/bin/env node
import { readdirSync, statSync, rmSync } from "fs";
import path from "path";

function deleteMigrations(dir) {
  for (const entry of readdirSync(dir)) {
    const fullPath = path.join(dir, entry);

    if (statSync(fullPath).isDirectory()) {
      if (entry === "migrations") {
        console.log("🗑️ Deleting folder:", fullPath);
        rmSync(fullPath, { recursive: true, force: true });
      } else {
        deleteMigrations(fullPath);
      }
    }
  }
}

deleteMigrations(process.cwd());
console.log("\n✅ All migrations/ folders deleted!");
