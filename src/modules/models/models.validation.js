import { z } from "zod";

export const setDefaultProviderSchema = z.object({
  body: z.object({
    provider: z.enum(["ollama", "openai"])
  })
});
