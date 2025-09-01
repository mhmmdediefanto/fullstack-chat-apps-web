// src/services/auth.service.ts
import jwt from "jsonwebtoken";


const JWT_SECRET = process.env.JWT_SECRET || "supersecret"; // simpan di .env

export function generateToken(payload: object) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" }); // token berlaku 1 jam
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET);
}
