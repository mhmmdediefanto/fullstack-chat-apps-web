import { Router } from "express";

import ChatController from "../controllers/ChatController";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post(
  "/private-message",
  authMiddleware,
  ChatController.sendPrivateMessageController
);
router.get(
  "/list-private-messages",
  authMiddleware,
  ChatController.listPrivateMessagesController
);

router.get("/messages-private/:username", authMiddleware, ChatController.getPrivateMessagesController);

export default router;
