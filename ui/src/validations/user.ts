import { z } from "zod";
export const userFormSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email().max(100),
  password: z.string().min(8).max(100).optional(),
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
export type UserFormValues = z.infer<typeof userFormSchema>;
