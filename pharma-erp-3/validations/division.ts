import z from "zod"


export const divisionFormSchema = z.object({
  code: z.string().min(1).max(10),
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  departmentId: z.coerce.number().optional(),
  unit: z.string().max(10).optional(),
  conversionFactor: z.coerce.number().optional(),
  isActive: z.coerce.boolean().optional(),
})

export type DivisionFormValues = z.infer<typeof divisionFormSchema>
