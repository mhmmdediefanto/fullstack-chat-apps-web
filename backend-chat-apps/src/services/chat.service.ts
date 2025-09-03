import { json } from "zod";
import {
  conversationExistsPrivate,
  createConversationPrivate,
  saveMessagePrivate,
  getConversationIdPrivate,
  listPrivateMessagesConversation,
} from "../repository/chat.repository";
import { getFriends } from "../repository/contact.repository";

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
    // list semua pesan private conversation
    const conversation = await listPrivateMessagesConversation(userId);

    const data = conversation.map((convo) => ({
      id: convo.id,
      participants: convo.participants.map((p) => ({
        id: p.user.id,
        username: p.user.username,
        fullname: p.user.fullname,
      })),
      lastMessage: convo.messages[0]
        ? {
            content: convo.messages[0].content,
            sender: convo.messages[0].sender.username,
            penerima: convo.participants
              .filter((p) => p.user.id !== convo.messages[0]?.senderId)
              .map((p) => p.user.username)
              .join(", "),
            createdAt: convo.messages[0].createdAt,
          }
        : null,
    }));

    return data;
  }
}
