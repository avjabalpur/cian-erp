import * as z from 'zod';

export const divisionFormSchema = z.object({
  code: z.string().min(1, 'Code is required').max(10, 'Code must be at most 10 characters'),
  name: z.string().min(1, 'Name is required').max(100, 'Name must be at most 100 characters'),
  description: z.string().optional(),
  departmentId: z.number().min(1, 'Department is required'),
  unit: z.string().max(10).optional(),
  conversionFactor: z.number().min(0, 'Conversion factor must be positive').optional(),
  isActive: z.boolean().optional(),
});

export type DivisionFormValues = z.infer<typeof divisionFormSchema>;
