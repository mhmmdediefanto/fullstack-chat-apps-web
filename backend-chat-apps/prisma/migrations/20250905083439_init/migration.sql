/*
  Warnings:

  - A unique constraint covering the columns `[slug_group]` on the table `Conversation` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `conversation` ADD COLUMN `createdBy` INTEGER NULL,
    ADD COLUMN `slug_group` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Conversation_slug_group_key` ON `Conversation`(`slug_group`);

-- AddForeignKey
ALTER TABLE `Conversation` ADD CONSTRAINT `Conversation_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
