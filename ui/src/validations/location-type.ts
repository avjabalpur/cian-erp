import z from "zod"

export const locationTypeFormSchema = z.object({
  code: z.string().min(1, "Location type code is required").max(10),
  name: z.string().min(1, "Location type name is required").max(100),
  isActive: z.coerce.boolean().optional(),
})

export type LocationTypeFormValues = z.infer<typeof locationTypeFormSchema> 