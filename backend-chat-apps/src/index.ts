import http from "http";
import app from "./app";
import { Server } from "socket.io";
import registerSockets from "./sockets";

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // ganti sesuai domain frontend kamu
    methods: ["GET", "POST"],
  },
});

registerSockets(io);

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
