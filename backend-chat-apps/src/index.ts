import http from "http";
import app from "./app";
import { Server } from "socket.io";
import registerSockets from "./sockets";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173", // ganti sesuai domain frontend kamu
    methods: ["GET", "POST"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  },
});

registerSockets(io);

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
