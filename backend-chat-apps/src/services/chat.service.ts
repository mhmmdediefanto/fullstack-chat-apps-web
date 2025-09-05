import {
  conversationExistsPrivate,
  createConversationPrivate,
  saveMessagePrivate,
  getConversationIdPrivate,
  listPrivateMessagesConversation,
  messagesPrivate,
} from "../repository/chat.repository";
import { getFriends, isMutualFriend } from "../repository/contact.repository";

export default class ChatService {
  public static async sendPrivateMessage(
    senderId: number,
    recipientId: number,
    message: string
  ) {
    // Cek apakah recipientId adalah teman dari senderId(diri sendiri)
    const userFriend = await getFriends(senderId);
    const isFriend = userFriend.some(
      (friend) => friend.contactId === recipientId
    );

    if (!isFriend) {
      throw new Error("Anda hanya bisa mengirim pesan ke teman Anda");
    }

    const mutualFriend = await isMutualFriend(senderId, recipientId);
    if (!mutualFriend) {
      throw new Error("Teman harus saling mengikuti untuk mengirim pesan");
    }

    // Cek apakah sudah ada conversation antara senderId dan recipientId
    let conversationId: number;
    const checkConversationExists = await conversationExistsPrivate(
      senderId,
      recipientId
    );
    if (checkConversationExists) {
      // jika sudah ada, ambil conversationId
      conversationId = await getConversationIdPrivate(senderId, recipientId);
    } else {
      const conversation = await createConversationPrivate(
        senderId,
        recipientId
      );
      conversationId = conversation.id;
    }

    // simpan pesan ke database dan kirim melalui websocket
    const result = await saveMessagePrivate(senderId, message, conversationId);

    // return hasilnya
    if (!result) throw new Error("Failed to save message");
    return {
      senderId,
      recipientId,
      message,
      timestamp: new Date(),
    };
  }

  public static async listPrivateMessages({ userId }: { userId: number }) {
    const conversation = await listPrivateMessagesConversation(userId);

    const result = conversation.map((conv) => {
      const lastMessage = conv.messages[0];
      const friend = conv.participants.find((p) => p.userId !== userId)?.user;
      return {
        conversationId: conv.id,
        friend: friend
          ? {
              id: friend.id,
              username: friend.username,
              fullname: friend.fullname,
            }
          : null,
        lastMessage: lastMessage
          ? {
              id: lastMessage.id,
              content: lastMessage.content,
              sender: lastMessage.sender.username ?? "Unknown",
            }
          : null,
      };
    });

    return result;
  }

  public static async getPrivateMessages({
    userId,
    friendUsername,
  }: {
    userId: number;
    friendUsername: string;
  }) {
    // pastikan friendUsername adalah teman dari userId
    const userFriends = await getFriends(userId);
    const friend = userFriends.find(
      (friend) => friend.contact.username === friendUsername
    );
    if (!friend) {
      throw new Error("Anda hanya bisa melihat pesan dari teman Anda");
    }

    // conversationid antara userId dan friend.id
    const conversationId = await getConversationIdPrivate(
      userId,
      friend.contactId
    );
    if (!conversationId) {
      return []; // jika tidak ada conversation, return array kosong
    }

    // ambil semua pesan dari conversationId
    const resultMessages = await messagesPrivate(conversationId);
    const result = resultMessages.map((msg) => ({
      id: msg.id,
      content: msg.content,
      createdAt: msg.createdAt,
      sender: {
        id: msg.sender.id,
        username: msg.sender.username,
        fullname: msg.sender.fullname,
      },
      isMine: msg.senderId === userId,
    }));

    if (result.length === 0) {
      return [];
    }

    return result;
  }
}
