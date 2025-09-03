import z from "zod";

export const sendMessagePrivateSchema = z.object({
  recipientId: z.number().min(1, "recipientId tidak valid"),
  message: z.string().min(1, "message tidak boleh kosong"),
});

export type SendMessagePrivateInput = z.infer<typeof sendMessagePrivateSchema>;