/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Student` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `StudentCourse` ADD COLUMN `classroomId` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Student_userId_key` ON `Student`(`userId`);

-- CreateIndex
CREATE INDEX `StudentCourse_courseId_idx` ON `StudentCourse`(`courseId`);
