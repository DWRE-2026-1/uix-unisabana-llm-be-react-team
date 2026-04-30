import { z } from "zod";

export const createMessageSchema = z.object({
  body: z.object({
    conversationId: z.string().min(1),
    role: z.enum(["user", "assistant", "system", "tool"]),
    content: z.string().min(1)
  })
});
