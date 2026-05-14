import { z } from "zod";

export const createConversationSchema = z.object({
  body: z.object({
    title: z.string().min(1),
    modelId: z.string().optional()
  })
});