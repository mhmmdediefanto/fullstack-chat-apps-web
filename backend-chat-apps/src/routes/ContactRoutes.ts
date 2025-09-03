import { Router } from "express";
import ContactController from "../controllers/ContactController";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();
router.post("/add-friend", authMiddleware, ContactController.addFriendController);
router.delete("/delete-friend/:friendId", authMiddleware, ContactController.deleteFriendController);
router.get("/friends", authMiddleware, ContactController.getFriendsController);

export default router;