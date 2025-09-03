import express, { Application } from "express";
import AuthRoute from "./routes/AuthRoutes";
import ContactRoute from "./routes/ContactRoutes";
import ChatRoute from "./routes/ChatRoutes";
import cookieParser from "cookie-parser";

const app: Application = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/v1/auth", AuthRoute);
app.use("/api/v1/contact", ContactRoute);
app.use("/api/v1/chat", ChatRoute);

export default app;
