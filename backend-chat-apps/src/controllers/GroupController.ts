import slug from "slug";
import GroupService from "../services/group.service";
import {
  addMemberSchema,
  createGroupSchema,
  sendMessageGroupSchema,
} from "../validator/group.validator";
import { sl } from "zod/locales";

class GroupController {
  async createGroupController(req: any, res: any) {
    try {
      const createdBy = req.user.id; // didapat dari authMiddleware
      if (!createdBy) {
        return res.status(400).json({ message: "Unauthorized" });
      }
      const validate = createGroupSchema.safeParse({
        name: req.body.name,
        createdBy, // didapat dari authMiddleware
      });

      if (!validate.success) {
        const errors = validate.error.issues.map((issue) => ({
          field: issue.path.join("."), // supaya tau error di field mana
          message: issue.message,
        }));
        return res.status(400).json({
          message: "Validation failed",
          errors,
        });
      }

      const { name } = validate.data;
      // buat slugGroup dari name
      const slugGroup = slug(name, { lower: true });

      const result = await GroupService.createGroup({
        name,
        createdBy,
        slugGroup,
      });
      return res
        .status(200)
        .json({ message: "Group created successfully", data: result });
    } catch (error: any) {
      if (error.message === "Group ini sudah anda buat sebelumnya") {
        return res.status(400).json({ message: error.message });
      }
      return res
        .status(500)
        .json({ message: error || "Internal server error" });
    }
  }

  async listMyGroupsController(req: any, res: any) {
    try {
      const createdBy = req.user.id; // didapat dari authMiddleware
      if (!createdBy) {
        return res.status(400).json({ message: "Unauthorized" });
      }
      const result = await GroupService.listMyGroups({ createdBy });
      return res.status(200).json({ message: "Success", data: result });
    } catch (error) {
      return res
        .status(500)
        .json({ message: error || "Internal server error" });
    }
  }

  async addMemberController(req: any, res: any) {
    try {
      const validate = addMemberSchema.safeParse({
        groupId: parseInt(req.body.groupId), // dari body untuk field conversationId
        userId: parseInt(req.body.userId), // dari body untuk field userId(member yang ditambahkan)
      });

      if (!validate.success) {
        const errors = validate.error.issues.map((issue) => ({
          field: issue.path.join("."), // supaya tau error di field mana
          message: issue.message,
        }));
        return res.status(400).json({
          message: "Validation failed",
          errors,
        });
      }

      const { groupId, userId } = validate.data;
      const result = await GroupService.addMember({
        groupId,
        userId,
        createdBy: req.user.id, // didapat dari authMiddleware
      });
      return res.status(200).json({ message: "Success", data: result });
    } catch (error: any) {
      if (
        error.message === "User yang ditambahkan harus merupakan teman anda"
      ) {
        return res.status(400).json({ message: error.message });
      }
      if (error.message === "Group tidak ditemukan") {
        return res.status(404).json({ message: error.message });
      }
      if (
        error.message ===
        "Hanya admin yang dapat menambahkan member ke group ini"
      ) {
        return res.status(422).json({ message: error.message });
      }
      return res
        .status(500)
        .json({ message: error || "Internal server error" });
    }
  }

  async sendMessageGroupController(req: any, res: any) {
    try {
      const senderId = req.user.id; // didapat dari authMiddleware
      if (!senderId) {
        return res.status(400).json({ message: "Unauthorized" });
      }

      const validate = sendMessageGroupSchema.safeParse({
        groupId: parseInt(req.body.groupId), // dari body untuk field conversationId
        message: req.body.message, // dari body untuk field message
      });

      if (!validate.success) {
        const errors = validate.error.issues.map((issue) => ({
          field: issue.path.join("."), // supaya tau error di field mana
          message: issue.message,
        }));
        return res.status(400).json({
          message: "Validation failed",
          errors,
        });
      }
      const { groupId, message } = validate.data;

      const result = await GroupService.sendMessageGroup({
        groupId,
        message,
        senderId,
      });
      return res.status(200).json({ message: "Success", data: result });
    } catch (error: any) {
      if (error.message === "Group tidak ditemukan") {
        return res.status(404).json({ message: error.message });
      }
      if (error.message === "Anda bukan member dari group ini") {
        return res.status(422).json({ message: error.message });
      }
      return res
        .status(500)
        .json({ message: error || "Internal server error" });
    }
  }

  async getMessagesGroupController(req: any, res: any) {
    try {
      const slugGroup = req.params.slugGroup;
      const userId = req.user.id;

      if (!slugGroup) {
        return res.status(400).json({ message: "slugGroup is required" });
      }
      const createdBy = req.user.id; // didapat dari authMiddleware
      if (!createdBy) {
        return res.status(400).json({ message: "Unauthorized" });
      }

      const resulData = await GroupService.getMessagesGroup({
        slugGroup,
        userId,
      });
      return res.status(200).json({ message: "Success", data: resulData });
    } catch (error) {
      console.log(error);
    }
  }
}

export default new GroupController();
