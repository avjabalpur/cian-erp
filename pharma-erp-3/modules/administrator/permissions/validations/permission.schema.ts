import { z } from "zod";

export const permissionSchema = z.object({
  name: z.string().min(2, 'Permission name must be at least 2 characters').max(100),
  description: z.string().optional().nullable(),
  moduleName: z.string().min(1, 'Module name is required'),
  actionType: z.string().min(1, 'Action type is required'),
  isActive: z.boolean().default(true),
});

export type PermissionFormValues = z.infer<typeof permissionSchema>;

