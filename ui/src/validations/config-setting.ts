import z from "zod"

export const configSettingFormSchema = z.object({
  settingKey: z.string().min(1, "Setting key is required").max(100),
  settingName: z.string().min(1, "Setting name is required").max(150),
  description: z.string().optional(),
  stringValue: z.string().optional(),
  integerValue: z.coerce.number().optional(),
  booleanValue: z.coerce.boolean().optional(),
  decimalValue: z.coerce.number().optional(),
  defaultValue: z.string().optional(),
  isActive: z.coerce.boolean().optional(),
})

export type ConfigSettingFormValues = z.infer<typeof configSettingFormSchema> 