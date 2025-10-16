import * as z from 'zod';

export const configListSchema = z.object({
  listCode: z.string().min(1, 'List code is required').max(50, 'List code must be at most 50 characters'),
  listName: z.string().min(1, 'List name is required').max(100, 'List name must be at most 100 characters'),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const configListValueSchema = z.object({
  listId: z.coerce.number().min(1, 'List is required'),
  valueCode: z.string().min(1, 'Value code is required').max(50, 'Value code must be at most 50 characters'),
  valueName: z.string().min(1, 'Value name is required').max(100, 'Value name must be at most 100 characters'),
  displayOrder: z.coerce.number().optional(),
  isActive: z.boolean().optional(),
  extraData: z.any().optional(),
});

export type ConfigListFormValues = z.infer<typeof configListSchema>;
export type ConfigListValueFormValues = z.infer<typeof configListValueSchema>;

