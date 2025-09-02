import z from "zod";

export const registerSchema = z.object({
  username: z
    .string()
    .min(3, "username minimal 3 karakter")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "username hanya boleh huruf, angka, dan underscore"
    ),
  email: z.string().email("email tidak valid"),
  fullname: z.string().min(3, "fullname minimal 3 karakter"),
  password: z.string().min(6, "password minimal 6 karakter"),
  refresh_token: z.string().optional(),
});

export const loginSchema = z.object({
  identifier: z.string().min(3, "username/email minimal 3 karakter"),
  password: z.string(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
