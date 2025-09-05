import { sendMessagePrivateSchema } from "../validator/chat.validator";
import ChatService from "../services/chat.service";

class ChatController {
  async sendPrivateMessageController(req: any, res: any) {
    try {
      // ambil semua request dan validasi
      const validate = sendMessagePrivateSchema.safeParse({
        recipientId: parseInt(req.body.recipientId),
        message: req.body.message,
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

      const { recipientId, message } = validate.data;
      const senderId = req.user.id; // didapat dari authMiddleware

      const result = await ChatService.sendPrivateMessage(
        senderId,
        recipientId,
        message
      );
      return res
        .status(200)
        .json({ message: "Message sent successfully", data: result });
    } catch (error: any) {
      if (error.message === "Anda hanya bisa mengirim pesan ke teman Anda") {
        return res.status(403).json({ message: error.message });
      }
      return res
        .status(500)
        .json({ message: error.message || "Internal server error" });
    }
  }

  async listPrivateMessagesController(req: any, res: any) {
    try {
      const userId = req.user.id; // didapat dari authMiddleware
      if (!userId) {
        return res.status(400).json({ message: "Unauthorized" });
      }

      const result = await ChatService.listPrivateMessages({ userId });
      return res.status(200).json({ message: "Success", data: result });
    } catch (error: any) {
      return res
        .status(500)
        .json({ message: error.message || "Internal server error" });
    }
  }

  async getPrivateMessagesController(req: any, res: any) {
    try {
      const friendUsername = req.params.username; // username friend yang mau diambil pesannya
      if (!friendUsername) {
        return res.status(400).json({ message: "Username is required" });
      }
      const userId = req.user.id; // didapat dari authMiddleware

      const result = await ChatService.getPrivateMessages({
        userId,
        friendUsername,
      });
      return res.status(200).json({ message: "Success", data: result });
    } catch (error: any) {
      return res
        .status(500)
        .json({ message: error.message || "Internal server error" });
    }
  }
}

export default new ChatController();
