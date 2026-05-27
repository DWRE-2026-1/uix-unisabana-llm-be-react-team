import { z } from "zod";

const messageSchema = z.object({
  role: z.enum(["system", "user", "assistant"]),
  content: z.string().min(1)
});

export const chatSchema = z.object({
  body: z
    .object({
      prompt: z.string().min(1).optional(),
      messages: z.array(messageSchema).min(1).optional(),
      provider: z.enum(["ollama", "openai"]).optional(),
      model: z.string().min(1).optional(),
      userId: z.string().min(1).optional(),
      conversationId: z.string().min(1).optional()
    })
    .refine((body) => Boolean(body.prompt?.trim()) || (body.messages && body.messages.length > 0), {
      message: "Either prompt or messages is required"
    })
});
