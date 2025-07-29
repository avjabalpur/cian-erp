import z from "zod"

export const configListSchema = z.object({
  listCode: z.string().min(1, "List code is required"),
  listName: z.string().min(1, "List name is required"),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
});

export const configListValueSchema = z.object({
  listId: z.number().min(1, "List ID is required"),
  valueCode: z.string().min(1, "Value code is required"),
  valueName: z.string().min(1, "Value name is required"),
  displayOrder: z.number().min(0, "Display order must be 0 or greater").default(0),
  isActive: z.boolean().default(true),
  extraData: z.any().optional(),
});

export type ConfigListFormData = z.infer<typeof configListSchema>;
export type ConfigListValueFormData = z.infer<typeof configListValueSchema>; 