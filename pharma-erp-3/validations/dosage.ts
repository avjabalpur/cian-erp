import z from "zod"

export const dosageFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name cannot exceed 255 characters'),
  registerDate: z.string().optional(),
  isActive: z.boolean().optional(),
})

export type DosageFormValues = z.infer<typeof dosageFormSchema> 