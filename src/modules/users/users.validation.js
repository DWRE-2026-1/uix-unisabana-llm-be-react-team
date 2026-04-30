import { z } from "zod";

export const createUserSchema = z.object({
  body: z.object({
    email: z.string().email(),
    name: z.string().min(1),
    password: z.string().min(6).optional(),
    roleId: z.string().min(1).optional()
  })
});
