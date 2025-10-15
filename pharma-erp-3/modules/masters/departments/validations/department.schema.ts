import * as z from 'zod';

export const departmentFormSchema = z.object({
  code: z.string().min(1, 'Code is required').max(10, 'Code must be at most 10 characters'),
  name: z.string().min(1, 'Name is required').max(100, 'Name must be at most 100 characters'),
  description: z.string().optional(),
  uomForMis: z.string().max(10).optional(),
  isActive: z.boolean().optional(),
});

export type DepartmentFormValues = z.infer<typeof departmentFormSchema>;

