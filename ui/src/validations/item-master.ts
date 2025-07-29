import z from "zod"

export const itemTypeSchema = z.object({
  code: z.string().min(1, "Code is required"),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  parentTypeId: z.number().optional(),
  isActive: z.boolean().default(true),
});

export type ItemTypeFormData = z.infer<typeof itemTypeSchema>;