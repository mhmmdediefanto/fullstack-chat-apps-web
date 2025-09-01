import { hashPassword } from "../helpers/hashingPassword";
import { response } from "../helpers/response";
import AuthService from "../services/auth.service";
class AuthController {
  async authMe(req: any, res: any) {}

  async login(req: any, res: any) {}

  async register(req: any, res: any) {
    try {
      const { username, email, fullname, password } = req.body;

      if (!username || !email || !fullname || !password) {
        return response(400, {}, "Missing required fields", res);
      }

      const hashingPassword = await hashPassword(password);

      const user = await AuthService.registerUser({
        fullname: fullname,
        email: email,
        username: username,
        password: hashingPassword,
      });

      return response(200, user, "Register success", res);

    } catch (error: any) {
      if ((error.message = "User/Email already exists"))
        return response(400, {}, error.message, res);
      response(500, {}, error, res);
    }
  }

  async logout(req: any, res: any) {}
}

export default new AuthController();
