import z from "zod"

export const departmentFormSchema = z.object({
  code: z.string().min(1).max(10),
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  uomForMis: z.string().max(10).optional(),
  isActive: z.boolean().optional(),
})

export type DepartmentFormValues = z.infer<typeof departmentFormSchema>