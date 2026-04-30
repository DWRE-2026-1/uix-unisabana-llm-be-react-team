import { z } from "zod";

export const chatSchema = z.object({
  body: z.object({
    prompt: z.string().min(1).optional(),
    messages: z.array(z.object({ role: z.string(), content: z.string() })).optional(),
    userId: z.string().min(1).optional(),
    conversationId: z.string().min(1).optional()
  })
});
