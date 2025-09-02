// src/services/auth.service.ts
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret"; // simpan di .env
const JWT_SECRET_REFRESH = process.env.JWT_SECRET_REFRESH || "refreshsecret";

export async function generateToken(payload: object) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "15m" }); // token berlaku 15 menit
}

export async function generateRefreshToken(payload: object) {
  return jwt.sign(payload, JWT_SECRET_REFRESH, { expiresIn: "7d" });
}

export async function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET);
}

export async function verifyRefreshToken(token: string) {
  return jwt.verify(token, JWT_SECRET_REFRESH as string);
}