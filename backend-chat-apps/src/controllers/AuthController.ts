import { hashPassword } from "../helpers/hashingPassword";
import { response } from "../helpers/response";
import AuthService from "../services/auth.service";
import { loginSchema, registerSchema } from "../validator/auth.validator";
class AuthController {
  async authMe(req: any, res: any) {
    try {
      // jika tidak ada user id
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const user = await AuthService.getMe(req.user.id);
      return response(200, user, "Success", res);
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }

  async login(req: any, res: any) {
    try {
      const validate = loginSchema.safeParse(req.body);

      if (!validate.success) {
        const errors = validate.error.issues.map((issue) => ({
          field: issue.path.join("."), // supaya tau error di field mana
          message: issue.message,
        }));

        return res.status(400).json({
          message: "Validasi gagal",
          errors,
        });
      }

      const { identifier, password } = req.body;
      const { user, token, refreshToken } = await AuthService.login(
        identifier,
        password
      );
      // Simpan refresh token di cookie HttpOnly
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "development",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 hari
      });

      return response(200, { user, token }, "Login success", res);
    } catch (error: any) {
      if (error.message === "User Tidak Ditemukan")
        return res.status(404).json({ message: error.message });
      if (error.message === "Invalid Password")
        return res.status(400).json({ message: error.message });
      if (error.message === "Failed to update refresh token")
        return res.status(500).json({ message: error.message });
      return res.status(500).json({ message: error });
    }
  }

  async register(req: any, res: any) {
    try {
      const validate = registerSchema.safeParse(req.body);

      if (!validate.success) {
        const errors = validate.error.issues.map((issue) => ({
          field: issue.path.join("."), // supaya tau error di field mana
          message: issue.message,
        }));

        return res.status(400).json({
          message: "Validasi gagal",
          errors,
        });
      }

      const { fullname, email, username, password } = req.body;

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
        return res.status(422).json({ message: error.message });
      response(500, {}, error, res);
    }
  }

  async logout(req: any, res: any) {
    try {
      const { refreshToken } = req.cookies;
      const logout = await AuthService.logout(refreshToken);
      return response(200, logout, "Logout success", res);
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }

  async refreshTokenUser(req: any, res: any) {
    try {
      const { refreshToken } = req.cookies;

      const token = await AuthService.refreshToken(refreshToken);
      return response(200, token, "Refresh token success", res);
    } catch (error: any) {
      if (error.message === "401 Unauthorized / Token Tidak Valid")
        return res.status(401).json({ message: error.message });
      return res.status(500).json({ message: error });
    }
  }
}

export default new AuthController();
