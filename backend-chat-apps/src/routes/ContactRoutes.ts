import { Router } from "express";
import ContactController from "../controllers/ContactController";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();
router.post("/add-friend", authMiddleware, ContactController.addFriendController);
router.post("/accept-friend/:friendId", authMiddleware, ContactController.acceptFriendController);
router.delete("/delete-friend/:friendId", authMiddleware, ContactController.deleteFriendController);
router.get("/friends", authMiddleware, ContactController.getFriendsController);
router.get("/request-friends", authMiddleware, ContactController.getRequestFriendsController);

export default router;