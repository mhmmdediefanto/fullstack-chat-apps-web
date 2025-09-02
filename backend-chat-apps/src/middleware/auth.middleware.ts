// middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../helpers/generate.jwt";

export interface AuthRequest extends Request {
  user?: any;
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded: any = await verifyToken(token);

    if (!decoded || !decoded.user) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    // Simpan user ke request biar bisa dipakai di controller
    req.user = {
      id: decoded.user.id,
      email: decoded.user.email,
      username: decoded.user.username,
      role: decoded.user.role,
    };

    next();
  } catch (error: any) {
    return res.status(401).json({
      message: "Unauthorized: Token verification failed",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
