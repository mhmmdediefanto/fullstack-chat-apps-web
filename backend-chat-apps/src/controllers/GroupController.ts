import slug from "slug";
import GroupService from "../services/group.service";
import {
  addMemberSchema,
  createGroupSchema,
  sendMessageGroupSchema,
} from "../validator/group.validator";

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
      const userId = req.user.id; // didapat dari authMiddleware
      if (!userId) {
        return res.status(400).json({ message: "Unauthorized" });
      }
      const result = await GroupService.listMyGroups({ userId });
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
      if (error.message === "User sudah ada di group ini") {
        return res.status(400).json({ message: error.message });
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

  // update member to admin group
  async updateMemberToAdminController(req: any, res: any) {
    try {
      const authId = req.user?.id;
      if (!authId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Validasi input
      const parsed = addMemberSchema.safeParse({
        userId: req.body.userId,
        groupId: req.body.groupId,
      });

      if (!parsed.success) {
        const errors = parsed.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        }));
        return res.status(400).json({ message: "Validation failed", errors });
      }

      const { userId, groupId } = parsed.data;

      const result = await GroupService.updateMemberToAdmin({
        userId,
        groupId,
        createdBy: authId,
      });

      return res.status(200).json({ message: "Success", data: result });
    } catch (error: any) {
      const errorMap: Record<string, number> = {
        "Group tidak ditemukan": 404,
        "Anda bukan member dari group ini": 422,
        "Hanya admin yang dapat update member": 422,
        "Anda tidak dapat update diri sendiri": 422,
        "User tersebut sudah menjadi admin": 422,
      };

      const statusCode = errorMap[error.message] || 500;
      return res.status(statusCode).json({
        message: error.message || "Internal server error",
      });
    }
  }
  async kickMemberofGroupController(req: any, res: any) {
    try {
      const validate = addMemberSchema.safeParse({
        userId: parseInt(req.body.userId),
        groupId: parseInt(req.body.groupId),
      });

      console.log(validate);

      if (!validate.success) {
        const errors = validate.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        }));
        return res.status(400).json({
          message: "Validation failed",
          errors,
        });
      }

      // cari conversation id dan user id yang mau di kick
      const { userId, groupId } = validate.data;
      // ambil id yang login
      const authId = req.user.id;

      const response = await GroupService.kickMemberofGroup({
        userId,
        groupId,
        authId: authId,
      });

      return res
        .status(200)
        .json({ message: "Success Member Kicked", data: response });
    } catch (error: any) {
      if (error.message === "Anda tidak dapat kick diri sendiri") {
        return res.status(422).json({ message: error.message });
      }

      if (error.message === "Group tidak ditemukan") {
        return res.status(404).json({ message: error.message });
      }
      if (error.message === "User tidak ada di group ini") {
        return res.status(422).json({ message: error.message });
      }

      res.status(500).json({ message: error || "Internal server error" });
    }
  }

  async deleteGroupController(req: any, res: any) {
    try {
      const authId = req.user.id; // didapat dari authMiddleware
      if (!authId) {
        return res.status(400).json({ message: "Unauthorized" });
      }
      const groupId = req.body.groupId;
      if(!groupId) {
        return res.status(400).json({ message: "Group id is required" });
      }
      const result = await GroupService.deleteGroup({ groupId, authId });
      return res.status(200).json({ message: "Success", data: result });
    } catch (error: any) {
      console.log(error)
      if (error.message === "Group tidak ditemukan") {
        return res.status(404).json({ message: error.message });
      }
      if (error.message === "Hanya admin yang dapat delete group") {
        return res.status(422).json({ message: error.message });
      }
      return res
        .status(500)
        .json({ message: error || "Internal server error" });
    }
  }
}

export default new GroupController();
