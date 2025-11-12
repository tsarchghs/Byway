-- CreateTable
CREATE TABLE "StudentProgress" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "studentId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "moduleId" TEXT,
    "lessonId" TEXT,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "score" REAL DEFAULT 0,
    "progressPct" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "StudentProgress_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_GradebookEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "assignmentId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "grade" REAL DEFAULT 0,
    "feedback" TEXT,
    "progressPct" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "GradebookEntry_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_GradebookEntry" ("assignmentId", "courseId", "createdAt", "feedback", "grade", "id", "progressPct", "studentId", "updatedAt") SELECT "assignmentId", "courseId", "createdAt", "feedback", "grade", "id", "progressPct", "studentId", "updatedAt" FROM "GradebookEntry";
DROP TABLE "GradebookEntry";
ALTER TABLE "new_GradebookEntry" RENAME TO "GradebookEntry";
CREATE INDEX "GradebookEntry_studentId_courseId_idx" ON "GradebookEntry"("studentId", "courseId");
CREATE TABLE "new_StudentNote" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "studentId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "StudentNote_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_StudentNote" ("body", "courseId", "createdAt", "id", "studentId", "updatedAt") SELECT "body", "courseId", "createdAt", "id", "studentId", "updatedAt" FROM "StudentNote";
DROP TABLE "StudentNote";
ALTER TABLE "new_StudentNote" RENAME TO "StudentNote";
CREATE INDEX "StudentNote_studentId_courseId_idx" ON "StudentNote"("studentId", "courseId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "StudentProgress_studentId_courseId_idx" ON "StudentProgress"("studentId", "courseId");

-- CreateIndex
CREATE INDEX "StudentProgress_studentId_courseId_lessonId_idx" ON "StudentProgress"("studentId", "courseId", "lessonId");
