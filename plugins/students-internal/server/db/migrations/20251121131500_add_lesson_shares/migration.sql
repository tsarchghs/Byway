-- students-internal: add metadata column and lesson_shares table

ALTER TABLE "Course" ADD COLUMN "metadata" TEXT;

CREATE TABLE "LessonShare" (
  "id" TEXT PRIMARY KEY,
  "courseId" TEXT NOT NULL,
  "moduleId" TEXT,
  "lessonId" TEXT,
  "kind" TEXT NOT NULL,
  "title" TEXT,
  "url" TEXT NOT NULL,
  "size" INTEGER,
  "mimeType" TEXT,
  "metadata" TEXT,
  "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "LessonShare_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "LessonShare_courseId_moduleId_lessonId_idx" ON "LessonShare" ("courseId", "moduleId", "lessonId");
CREATE INDEX "LessonShare_lessonId_idx" ON "LessonShare" ("lessonId");

