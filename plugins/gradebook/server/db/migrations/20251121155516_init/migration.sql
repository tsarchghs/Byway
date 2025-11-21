-- CreateTable
CREATE TABLE `GradebookEntry` (
    `id` VARCHAR(191) NOT NULL,
    `courseId` VARCHAR(191) NOT NULL,
    `courseTitle` VARCHAR(191) NULL,
    `studentId` VARCHAR(191) NOT NULL,
    `studentDisplayName` VARCHAR(191) NULL,
    `assignmentId` VARCHAR(191) NULL,
    `assignmentTitle` VARCHAR(191) NULL,
    `score` DOUBLE NULL,
    `maxScore` DOUBLE NULL,
    `letter` VARCHAR(191) NULL,
    `feedback` VARCHAR(191) NULL,
    `metadata` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
