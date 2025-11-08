/*
  Warnings:

  - You are about to drop the column `enrollmentId` on the `LabInstance` table. All the data in the column will be lost.
  - You are about to drop the column `enrollmentId` on the `QuizAttempt` table. All the data in the column will be lost.
  - You are about to drop the `Enrollment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LessonProgress` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Submission` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[studentId,lessonId]` on the table `LabInstance` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `studentId` to the `LabInstance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `studentId` to the `QuizAttempt` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Enrollment` DROP FOREIGN KEY `Enrollment_studentId_fkey`;

-- DropForeignKey
ALTER TABLE `LabInstance` DROP FOREIGN KEY `LabInstance_enrollmentId_fkey`;

-- DropForeignKey
ALTER TABLE `LessonProgress` DROP FOREIGN KEY `LessonProgress_enrollmentId_fkey`;

-- DropForeignKey
ALTER TABLE `QuizAttempt` DROP FOREIGN KEY `QuizAttempt_enrollmentId_fkey`;

-- DropForeignKey
ALTER TABLE `Submission` DROP FOREIGN KEY `Submission_enrollmentId_fkey`;

-- DropIndex
DROP INDEX `LabInstance_enrollmentId_lessonId_key` ON `LabInstance`;

-- DropIndex
DROP INDEX `QuizAttempt_enrollmentId_lessonId_idx` ON `QuizAttempt`;

-- AlterTable
ALTER TABLE `LabInstance` DROP COLUMN `enrollmentId`,
    ADD COLUMN `studentId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `QuizAttempt` DROP COLUMN `enrollmentId`,
    ADD COLUMN `studentId` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `Enrollment`;

-- DropTable
DROP TABLE `LessonProgress`;

-- DropTable
DROP TABLE `Submission`;

-- CreateTable
CREATE TABLE `StudentCourse` (
    `id` VARCHAR(191) NOT NULL,
    `studentId` VARCHAR(191) NOT NULL,
    `courseId` VARCHAR(191) NOT NULL,
    `completed` BOOLEAN NOT NULL DEFAULT false,
    `progress` INTEGER NULL,
    `enrolledAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `StudentCourse_studentId_courseId_key`(`studentId`, `courseId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StudentProgress` (
    `id` VARCHAR(191) NOT NULL,
    `studentId` VARCHAR(191) NOT NULL,
    `lessonId` VARCHAR(191) NOT NULL,
    `completed` BOOLEAN NOT NULL DEFAULT false,
    `score` INTEGER NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `StudentProgress_studentId_lessonId_key`(`studentId`, `lessonId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StudentSubmission` (
    `id` VARCHAR(191) NOT NULL,
    `studentId` VARCHAR(191) NOT NULL,
    `lessonId` VARCHAR(191) NOT NULL,
    `type` ENUM('ASSIGNMENT', 'LAB', 'FILE') NOT NULL,
    `content` VARCHAR(191) NULL,
    `grade` DOUBLE NULL,
    `submittedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `StudentSubmission_studentId_lessonId_idx`(`studentId`, `lessonId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `LabInstance_studentId_lessonId_key` ON `LabInstance`(`studentId`, `lessonId`);

-- CreateIndex
CREATE INDEX `QuizAttempt_studentId_lessonId_idx` ON `QuizAttempt`(`studentId`, `lessonId`);

-- AddForeignKey
ALTER TABLE `StudentCourse` ADD CONSTRAINT `StudentCourse_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Student`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentProgress` ADD CONSTRAINT `StudentProgress_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Student`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentSubmission` ADD CONSTRAINT `StudentSubmission_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Student`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LabInstance` ADD CONSTRAINT `LabInstance_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Student`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `QuizAttempt` ADD CONSTRAINT `QuizAttempt_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Student`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
