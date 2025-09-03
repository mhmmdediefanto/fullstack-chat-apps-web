import z from "zod";

export const validatorFriendSchema = z.object({
  friendId: z.number().min(1, "friendId must be a positive number"),
});

export type ValidatorFriend = z.infer<typeof validatorFriendSchema>;
