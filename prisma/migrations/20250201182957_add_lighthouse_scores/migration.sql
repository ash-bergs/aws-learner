-- CreateTable
CREATE TABLE `LighthouseScore` (
    `id` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `performance` DOUBLE NOT NULL,
    `accessibility` DOUBLE NOT NULL,
    `bestPractices` DOUBLE NOT NULL,
    `seo` DOUBLE NOT NULL,
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
