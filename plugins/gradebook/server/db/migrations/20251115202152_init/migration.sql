-- CreateTable
CREATE TABLE "GradebookEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "courseId" TEXT NOT NULL,
    "courseTitle" TEXT,
    "studentId" TEXT NOT NULL,
    "studentDisplayName" TEXT,
    "assignmentId" TEXT,
    "assignmentTitle" TEXT,
    "score" REAL,
    "maxScore" REAL,
    "letter" TEXT,
    "feedback" TEXT,
    "metadata" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
