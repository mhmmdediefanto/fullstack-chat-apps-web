import express, { Application } from "express";
import AuthRoute from "./routes/AuthRoutes";
import cookieParser from "cookie-parser";

const app: Application = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/v1/auth", AuthRoute);

export default app;
