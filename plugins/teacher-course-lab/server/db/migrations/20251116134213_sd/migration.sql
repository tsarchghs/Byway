-- CreateTable
CREATE TABLE "LabChallenge" (
    "courseId" TEXT,
    "moduleId" TEXT,
    "lessonId" TEXT,
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "starterRepoUrl" TEXT,
    "testsRepoUrl" TEXT,
    "runtime" TEXT,
    "createdByUserId" TEXT NOT NULL,
    "visibility" TEXT NOT NULL DEFAULT 'private',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "LabSession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "challengeId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'created',
    "codeServerUrl" TEXT,
    "codeServerToken" TEXT,
    "containerId" TEXT,
    "lastHeartbeat" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "LabSession_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "LabChallenge" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LabWorkspace" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionId" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "repoUrl" TEXT,
    "branch" TEXT,
    CONSTRAINT "LabWorkspace_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "LabSession" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Submission" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "passed" BOOLEAN NOT NULL DEFAULT false,
    "gradePct" REAL,
    "feedback" TEXT,
    "artifactsUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Submission_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "LabSession" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "LabChallenge_slug_key" ON "LabChallenge"("slug");
