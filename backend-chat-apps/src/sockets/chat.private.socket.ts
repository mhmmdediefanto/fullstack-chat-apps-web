import { Server, Socket } from "socket.io";
import ChatService from "../services/chat.service";

export default function chatPrivateSocket(io: Server, socket: Socket) {
  // join ke private room
  socket.on("private:join", (conversationId: number) => {
    socket.join(conversationId.toString());
    console.log(`User ${socket.id} joined conversation ${conversationId}`);
  });
  // kirim pesan private
  socket.on(
    "private:send",
    async (data: {
      senderId: number;
      recipientId: number;
      message: string;
    }) => {
      try {
        // simpan pesan lewat service
        const result = await ChatService.sendPrivateMessage(
          data.senderId,
          data.recipientId,
          data.message
        );

        // ambil conversationId
        const conversationId = await ChatService.getConversationId(
          data.senderId,
          data.recipientId
        );

        // broadcast ke semua anggota room
        io.to(conversationId.toString()).emit("private:new", result);
      } catch (err: any) {
        socket.emit("private:error", err.message);
      }
    }
  );
}
