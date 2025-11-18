-- CreateTable
CREATE TABLE "Department" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "institutionId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "contact" TEXT,
    "head" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Department_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "Institution" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "InstitutionMember" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "institutionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "InstitutionMember_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "Institution" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ClassroomEnrollment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "classroomId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ENROLLED',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ClassroomEnrollment_classroomId_fkey" FOREIGN KEY ("classroomId") REFERENCES "Classroom" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "InstitutionInvite" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "institutionId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'student',
    "expiresAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "InstitutionInvite_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "Institution" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Classroom" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "institutionId" TEXT NOT NULL,
    "departmentId" TEXT,
    "teacherId" TEXT,
    "title" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "capacity" INTEGER,
    "status" TEXT,
    "startsAt" DATETIME,
    "endsAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Classroom_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "Institution" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Classroom_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Classroom" ("code", "createdAt", "id", "institutionId", "title", "updatedAt") SELECT "code", "createdAt", "id", "institutionId", "title", "updatedAt" FROM "Classroom";
DROP TABLE "Classroom";
ALTER TABLE "new_Classroom" RENAME TO "Classroom";
CREATE UNIQUE INDEX "Classroom_code_key" ON "Classroom"("code");
CREATE TABLE "new_Institution" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT,
    "location" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Institution" ("createdAt", "description", "id", "name", "slug", "updatedAt") SELECT "createdAt", "description", "id", "name", "slug", "updatedAt" FROM "Institution";
DROP TABLE "Institution";
ALTER TABLE "new_Institution" RENAME TO "Institution";
CREATE UNIQUE INDEX "Institution_slug_key" ON "Institution"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Department_institutionId_slug_key" ON "Department"("institutionId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "InstitutionMember_institutionId_userId_key" ON "InstitutionMember"("institutionId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "ClassroomEnrollment_classroomId_studentId_key" ON "ClassroomEnrollment"("classroomId", "studentId");

-- CreateIndex
CREATE UNIQUE INDEX "InstitutionInvite_code_key" ON "InstitutionInvite"("code");
