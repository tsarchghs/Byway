/*
  Warnings:

  - You are about to drop the column `urls` on the `Submission` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Submission` DROP COLUMN `urls`,
    ADD COLUMN `urlsJson` JSON NULL;
