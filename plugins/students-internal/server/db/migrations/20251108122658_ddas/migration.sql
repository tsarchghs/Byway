/*
  Warnings:

  - You are about to alter the column `type` on the `StudentSubmission` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `VarChar(191)`.
  - You are about to alter the column `grade` on the `StudentSubmission` table. The data in that column could be lost. The data in that column will be cast from `Double` to `VarChar(191)`.
  - You are about to drop the `LabInstance` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `QuizAttempt` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `LabInstance` DROP FOREIGN KEY `LabInstance_studentId_fkey`;

-- DropForeignKey
ALTER TABLE `QuizAttempt` DROP FOREIGN KEY `QuizAttempt_studentId_fkey`;

-- DropForeignKey
ALTER TABLE `StudentCourse` DROP FOREIGN KEY `StudentCourse_studentId_fkey`;

-- DropForeignKey
ALTER TABLE `StudentProgress` DROP FOREIGN KEY `StudentProgress_studentId_fkey`;

-- DropForeignKey
ALTER TABLE `StudentSubmission` DROP FOREIGN KEY `StudentSubmission_studentId_fkey`;

-- AlterTable
ALTER TABLE `StudentProgress` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `StudentSubmission` MODIFY `type` VARCHAR(191) NOT NULL,
    MODIFY `grade` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `LabInstance`;

-- DropTable
DROP TABLE `QuizAttempt`;

-- CreateIndex
CREATE INDEX `StudentCourse_studentId_idx` ON `StudentCourse`(`studentId`);

-- CreateIndex
CREATE INDEX `StudentCourse_courseId_idx` ON `StudentCourse`(`courseId`);

-- CreateIndex
CREATE INDEX `StudentProgress_studentId_idx` ON `StudentProgress`(`studentId`);

-- CreateIndex
CREATE INDEX `StudentProgress_lessonId_idx` ON `StudentProgress`(`lessonId`);
