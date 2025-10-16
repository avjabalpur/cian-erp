import * as z from 'zod';

export const itemTypeSchema = z.object({
  code: z.string().min(1, 'Code is required').max(50, 'Code must be at most 50 characters'),
  name: z.string().min(1, 'Name is required').max(255, 'Name must be at most 255 characters'),
  description: z.string().optional(),
  parentTypeId: z.coerce.number().optional(),
  isActive: z.boolean().optional(),
});

export type ItemTypeFormValues = z.infer<typeof itemTypeSchema>;
