import { z } from "zod"

export const permissionFormSchema = z.object({
  name: z.string().min(1, { message: "Permission name is required" }),
  description: z.string().optional(),
  moduleName: z.string().min(1, { message: "Module name is required" }),
  actionType: z.preprocess(
    (val) => Array.isArray(val) ? val.join(",") : val,
    z.string().min(1, { message: "Action type is required" })
  ),
  isActive: z.boolean()
})

export type PermissionFormValues = z.infer<typeof permissionFormSchema>;
