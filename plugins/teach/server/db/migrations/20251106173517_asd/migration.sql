/*
  Warnings:

  - You are about to drop the column `user` on the `TeacherProfile` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TeacherProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "subjects" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "payoutEmail" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_TeacherProfile" ("avatarUrl", "bio", "createdAt", "id", "payoutEmail", "subjects", "userId", "verified") SELECT "avatarUrl", "bio", "createdAt", "id", "payoutEmail", "subjects", "userId", "verified" FROM "TeacherProfile";
DROP TABLE "TeacherProfile";
ALTER TABLE "new_TeacherProfile" RENAME TO "TeacherProfile";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
