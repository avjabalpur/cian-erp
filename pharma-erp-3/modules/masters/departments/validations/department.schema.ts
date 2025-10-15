import * as z from 'zod';

export const departmentSchema = z.object({
  code: z.string().min(2, 'Code must be at least 2 characters').max(10, 'Code must be at most 10 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must be at most 100 characters'),
  description: z.string().optional(),
  status: z.string(),
  headOfDepartment: z.string().optional(),
  employeeCount: z.number().optional(),
});

export type DepartmentFormData = z.infer<typeof departmentSchema>;

