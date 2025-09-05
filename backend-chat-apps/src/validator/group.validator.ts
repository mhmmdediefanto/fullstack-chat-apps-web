import z from "zod";

export const createGroupSchema = z.object({
  name: z.string().min(3, "Group name must be at least 3 characters long"),
  createdBy: z.number().int("createdBy must be an integer"),
});

export const addMemberSchema = z.object({
  groupId: z.number().int("groupId must be an integer"),
  userId: z.number().int("userId must be an integer"),
});

export const sendMessageGroupSchema = z.object({
  groupId: z.number().int("Format groupId must be an integer"),
  message: z.string().min(1, "Message cannot be empty"),
});

export type CreateGroupInput = z.infer<typeof createGroupSchema>;
