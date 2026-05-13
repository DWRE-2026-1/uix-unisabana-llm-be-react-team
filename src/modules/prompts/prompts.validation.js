import { z } from "zod";

export const promptSchema = z.object({
  body: z.object({
    prompt: z.string().min(1, "El prompt es requerido"),
    provider: z.enum(["ollama", "openai"]).optional()
  })
});