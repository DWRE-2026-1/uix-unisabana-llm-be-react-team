import { z } from "zod";

export const createRoleSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    permissions: z.array(z.string()).optional()
  })
});
