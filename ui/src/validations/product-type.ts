import * as z from "zod";

export const productTypeSchema = z.object({
  code: z.string().min(1, "Code is required").max(10, "Code must be at most 10 characters"),
  name: z.string().min(1, "Name is required").max(100, "Name must be at most 100 characters"),
  description: z.string().optional(),
  parentTypeId: z.string()
    .optional()
    .transform((val) => {
      if (!val || val === "-1") return undefined;
      const num = parseInt(val);
      return isNaN(num) ? undefined : num;
    }),
  isActive: z.coerce.boolean().default(true),
});

export type ProductTypeFormData = z.infer<typeof productTypeSchema>; 