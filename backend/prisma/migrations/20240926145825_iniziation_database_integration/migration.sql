-- CreateTable
CREATE TABLE `Member` (
    `id` VARCHAR(100) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `phone_number` VARCHAR(15) NULL,
    `membership_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `penaltyId` VARCHAR(100) NULL,
    `current_borrowed_books` INTEGER NOT NULL DEFAULT 0,
    `is_active` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `Member_code_key`(`code`),
    UNIQUE INDEX `Member_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Book` (
    `id` VARCHAR(100) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `author` VARCHAR(191) NOT NULL,
    `total_stocks` INTEGER NOT NULL,
    `available_stocks` INTEGER NOT NULL,
    `history_borrowed_counts` INTEGER NOT NULL DEFAULT 0,
    `categoryId` VARCHAR(100) NULL,
    `is_available` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `Book_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Penalty` (
    `id` VARCHAR(100) NOT NULL,
    `memberId` VARCHAR(100) NOT NULL,
    `start_date` DATETIME(3) NOT NULL,
    `end_date` DATETIME(3) NULL,
    `status` BOOLEAN NOT NULL,
    `reason` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Penalty_memberId_key`(`memberId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Loan` (
    `id` VARCHAR(100) NOT NULL,
    `bookId` VARCHAR(100) NOT NULL,
    `memberId` VARCHAR(100) NOT NULL,
    `borrow_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `return_date` DATETIME(3) NULL,
    `due_date` DATETIME(3) NOT NULL,
    `status` ENUM('Active', 'Returned', 'Overdue') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Member` ADD CONSTRAINT `Member_penaltyId_fkey` FOREIGN KEY (`penaltyId`) REFERENCES `Penalty`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Loan` ADD CONSTRAINT `Loan_memberId_fkey` FOREIGN KEY (`memberId`) REFERENCES `Member`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Loan` ADD CONSTRAINT `Loan_bookId_fkey` FOREIGN KEY (`bookId`) REFERENCES `Book`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
