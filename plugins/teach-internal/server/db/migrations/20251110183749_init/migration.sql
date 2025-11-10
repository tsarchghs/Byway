-- AlterTable
ALTER TABLE "Course" ADD COLUMN "institutionId" TEXT;

-- AlterTable
ALTER TABLE "Lesson" ADD COLUMN "position" INTEGER DEFAULT 0;

-- CreateTable
CREATE TABLE "Classroom" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "courseId" TEXT NOT NULL,
    "institutionId" TEXT,
    "name" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Assignment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "classroomId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "dueDate" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "acceptUntil" DATETIME,
    "maxAttempts" INTEGER DEFAULT 1,
    "latePenalty" REAL,
    "rubric" JSONB,
    "gradingWeight" REAL
);

-- CreateTable
CREATE TABLE "Submission" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "assignmentId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "fileUrl" TEXT,
    "grade" REAL,
    "feedback" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "gradedAt" DATETIME,
    "graderId" TEXT,
    "rubric" JSONB,
    "comment" TEXT,
    "attempt" INTEGER DEFAULT 1,
    "isLate" BOOLEAN DEFAULT false,
    "comments" JSONB
);

-- CreateIndex
CREATE INDEX "Course_teacherId_idx" ON "Course"("teacherId");
