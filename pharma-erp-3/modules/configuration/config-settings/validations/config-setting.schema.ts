import * as z from 'zod';

export const configSettingSchema = z.object({
  settingKey: z.string().min(1, 'Setting key is required').max(100, 'Setting key must be at most 100 characters'),
  settingName: z.string().min(1, 'Setting name is required').max(200, 'Setting name must be at most 200 characters'),
  description: z.string().optional(),
  stringValue: z.string().optional(),
  integerValue: z.coerce.number().optional(),
  booleanValue: z.boolean().optional(),
  decimalValue: z.coerce.number().optional(),
  defaultValue: z.string().optional(),
  isActive: z.boolean().optional(),
});

export type ConfigSettingFormValues = z.infer<typeof configSettingSchema>;

