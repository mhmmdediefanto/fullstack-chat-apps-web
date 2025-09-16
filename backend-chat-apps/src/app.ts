import express, { Application } from "express";
import AuthRoute from "./routes/AuthRoutes";
import ContactRoute from "./routes/ContactRoutes";
import ChatRoute from "./routes/ChatRoutes";
import GroupRoute from "./routes/GroupRoutes";
import cookieParser from "cookie-parser";
import cors from "cors";

const app: Application = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// setting cors origin
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Routes
app.use("/api/v1/auth", AuthRoute);
app.use("/api/v1/contact", ContactRoute);
app.use("/api/v1/chat", ChatRoute);
app.use("/api/v1/group", GroupRoute);

export default app;
