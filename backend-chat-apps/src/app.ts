import express, { Application } from "express";
import ProductRoute from "./routes/ProductRoutes";
import AuthRoute from "./routes/AuthRoutes";

const app: Application = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/v1/products", ProductRoute);
app.use("/api/v1/auth", AuthRoute);

export default app;
