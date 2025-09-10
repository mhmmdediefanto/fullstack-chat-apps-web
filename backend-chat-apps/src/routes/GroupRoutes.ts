import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import GroupController from "../controllers/GroupController";

const router = Router();

router.post("/create-group", authMiddleware, GroupController.createGroupController);
router.get("/my-groups", authMiddleware, GroupController.listMyGroupsController);
router.post("/add-member", authMiddleware, GroupController.addMemberController);
router.post("/send-message-group", authMiddleware, GroupController.sendMessageGroupController);
router.get("/:slugGroup/messages", authMiddleware, GroupController.getMessagesGroupController);
router.put("/update-member-to-admin", authMiddleware, GroupController.updateMemberToAdminController);
router.post("/kick-member/:id", authMiddleware, GroupController.kickMemberofGroupController);
router.delete("/delete-group/:id", authMiddleware, GroupController.deleteGroupController);

export default router;