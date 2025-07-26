import { z } from "zod"

export const roleFormSchema = z.object({
  name: z.string().min(1, { message: "Role name is required" }),
  description: z.string().optional(),
  isActive: z.boolean()
})

export type RoleFormValues = z.infer<typeof roleFormSchema>;
