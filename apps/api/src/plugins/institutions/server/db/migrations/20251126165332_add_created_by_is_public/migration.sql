/*
  Warnings:

  - Added the required column `createdByUserId` to the `Institution` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Institution" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdByUserId" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "type" TEXT,
    "location" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Institution" ("id", "name", "slug", "createdByUserId", "isPublic", "description", "type", "location", "email", "phone", "active", "createdAt", "updatedAt") SELECT "id", "name", "slug", 'system', false, "description", "type", "location", "email", "phone", "active", "createdAt", "updatedAt" FROM "Institution";
DROP TABLE "Institution";
ALTER TABLE "new_Institution" RENAME TO "Institution";
CREATE UNIQUE INDEX "Institution_slug_key" ON "Institution"("slug");
CREATE INDEX "Institution_createdByUserId_idx" ON "Institution"("createdByUserId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
