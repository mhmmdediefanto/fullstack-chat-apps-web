import { Server } from "socket.io";
import chatPrivateSocket from "./chat.private.socket";
import groupSocket from "./chat.group.socket";

export default function registerSockets(io: Server) {
  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    chatPrivateSocket(io, socket);
    groupSocket(io, socket);

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
}
