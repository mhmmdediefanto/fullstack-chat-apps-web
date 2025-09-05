import { parse } from "path";
import { response } from "../helpers/response";
import { ContactService } from "../services/contact.service";
import { validatorFriendSchema } from "../validator/contact.validator";

const contactService = new ContactService();
class ContactController {
  // function untuk tambah teman
  async addFriendController(req: any, res: any) {
    try {
      const validate = validatorFriendSchema.safeParse(req.body);
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

      const { friendId } = req.body;

      const userId = req.user.id; //ambil userId dari token
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const result = await contactService.addFriends(userId, friendId);
      return response(200, result, "Add friend success", res);
    } catch (error: any) {
      let statusCode = 500; // default
      let message = error.message || "Internal server error";

      if (message === "You cannot add yourself as a friend") statusCode = 400;
      else if (message === "This user is already your friend") statusCode = 409;
      else if (message === "Failed to add friend") statusCode = 500;
      else if (message === "User not found") statusCode = 404;

      return res.status(statusCode).json({ message });
    }
  }

  // function untuk hapus teman
  async deleteFriendController(req: any, res: any) {
    // validasi input
    const validate = validatorFriendSchema.safeParse({
      friendId: parseInt(req.params.friendId),
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

    const userId = req.user.id; //ambil userId dari token
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { friendId } = validate.data;
    try {
      const result = await contactService.deleteFriends(userId, friendId);
      return response(200, result, "Delete friend success", res);
    } catch (error: any) {
      let statusCode = 500; // default
      let message = error.message || "Internal server error";
      if (message === "Friend not found") statusCode = 404;
      return res.status(statusCode).json({ message });
    }
  }

  // function untuk get list teman
  async getFriendsController(req: any, res: any) {
    const userId = req.user.id; //ambil userId dari token
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    try {
      const result = await contactService.getFriendsAll(userId);
      return response(200, result, "Get friends success", res);
    } catch (error: any) {
      let statusCode = 500;
      let message = error.message || "Internal server error";
      return res.status(statusCode).json({ message });
    }
  }

  async getRequestFriendsController(req: any, res: any) {
    const userId = req.user.id; //ambil userId dari token
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    try {
      const result = await contactService.getRequestFriendsAll(userId);
      return response(200, result, "Get followers success", res);
    } catch (error: any) {
      let statusCode = 500;
      let message = error.message || "Internal server error";
      return res.status(statusCode).json({ message });
    }
  }

  async acceptFriendController(req: any, res: any) {
    // validasi input
    const validate = validatorFriendSchema.safeParse({
      friendId: parseInt(req.params.friendId),
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
    const userId = req.user.id; //ambil userId dari token
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { friendId } = validate.data;
    try {
      const result = await contactService.acceptFriend(userId, friendId);
      return response(200, result, "Accept friend success", res);
    } catch (error: any) {
      let statusCode = 500; // default
      let message = error.message || "Internal server error";
      if (message === "Friend not found") statusCode = 404;
      return res.status(statusCode).json({ message });
    }
  }
}
export default new ContactController();
