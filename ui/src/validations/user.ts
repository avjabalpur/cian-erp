import { z } from "zod";

const baseUserSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email().max(100),
  firstName: z.string().min(2, { message: "First name must contain at least 2 characters" }).max(50),
  lastName: z.string().min(2, { message: "Last name must contain at least 2 characters" }).max(50),
  employeeId: z.string().max(50).optional(),
  phone: z.string()
  .length(15, { message: "Phone number must be exactly 15 digits" })
  .regex(/^\d+$/, { message: "Phone number must contain only digits" })
  .optional(),
  dob: z.string().optional(),
  gender: z.string().max(2).optional(),
  department: z.string().max(50).optional(),
  designation: z.string().max(50).optional(),
  reportingManagerId: z.number().int().optional(),
  isActive: z.boolean().optional(),
  isEmailVerified: z.boolean().optional(),
  isPhoneVerified: z.boolean().optional()
});

export const createUserSchema = baseUserSchema.extend({
  password: z.string().min(8, { message: "Password must be at least 8 characters" }).max(100),
});

export const updateUserSchema = baseUserSchema.extend({
  password: z.string().min(8, { message: "Password must be at least 8 characters" }).max(100).optional(),
});

export const userFormSchema = updateUserSchema; // Default to update schema for backward compatibility

export type UserFormValues = z.infer<typeof userFormSchema>;
export type CreateUserFormValues = z.infer<typeof createUserSchema>;
export type UpdateUserFormValues = z.infer<typeof updateUserSchema>;
