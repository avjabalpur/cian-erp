import { z } from "zod";

export const roleSchema = z.object({
  name: z.string().min(2, 'Role name must be at least 2 characters').max(100),
  description: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
});

export type RoleFormValues = z.infer<typeof roleSchema>;

