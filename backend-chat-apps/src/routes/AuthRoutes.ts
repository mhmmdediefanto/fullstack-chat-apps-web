import { Router } from "express";

import AuthController  from "../controllers/AuthController";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post("/login", AuthController.login);
router.post("/register", AuthController.register);
router.post("/logout", AuthController.logout);
router.get("/me", authMiddleware ,AuthController.authMe);
router.post("/refresh-token", AuthController.refreshTokenUser);

export default router;