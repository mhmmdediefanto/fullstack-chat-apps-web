/*
  Warnings:

  - You are about to drop the column `groupId` on the `message` table. All the data in the column will be lost.
  - You are about to drop the column `receiverId` on the `message` table. All the data in the column will be lost.
  - You are about to drop the `group` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `groupmember` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `messagestatus` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `conversationId` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `groupmember` DROP FOREIGN KEY `GroupMember_groupId_fkey`;

-- DropForeignKey
ALTER TABLE `groupmember` DROP FOREIGN KEY `GroupMember_userId_fkey`;

-- DropForeignKey
ALTER TABLE `message` DROP FOREIGN KEY `Message_groupId_fkey`;

-- DropForeignKey
ALTER TABLE `messagestatus` DROP FOREIGN KEY `MessageStatus_messageId_fkey`;

-- DropForeignKey
ALTER TABLE `messagestatus` DROP FOREIGN KEY `MessageStatus_userId_fkey`;

-- DropIndex
DROP INDEX `Message_groupId_fkey` ON `message`;

-- AlterTable
ALTER TABLE `message` DROP COLUMN `groupId`,
    DROP COLUMN `receiverId`,
    ADD COLUMN `conversationId` INTEGER NOT NULL;

-- DropTable
DROP TABLE `group`;

-- DropTable
DROP TABLE `groupmember`;

-- DropTable
DROP TABLE `messagestatus`;

-- CreateTable
CREATE TABLE `Conversation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` ENUM('PRIVATE', 'GROUP') NOT NULL,
    `name` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ConversationParticipant` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `conversationId` INTEGER NOT NULL,
    `role` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ConversationParticipant` ADD CONSTRAINT `ConversationParticipant_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ConversationParticipant` ADD CONSTRAINT `ConversationParticipant_conversationId_fkey` FOREIGN KEY (`conversationId`) REFERENCES `Conversation`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_conversationId_fkey` FOREIGN KEY (`conversationId`) REFERENCES `Conversation`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
