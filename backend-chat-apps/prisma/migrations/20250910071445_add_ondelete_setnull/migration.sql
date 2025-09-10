-- DropForeignKey
ALTER TABLE `conversationparticipant` DROP FOREIGN KEY `ConversationParticipant_conversationId_fkey`;

-- DropIndex
DROP INDEX `ConversationParticipant_conversationId_fkey` ON `conversationparticipant`;

-- AddForeignKey
ALTER TABLE `ConversationParticipant` ADD CONSTRAINT `ConversationParticipant_conversationId_fkey` FOREIGN KEY (`conversationId`) REFERENCES `Conversation`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
