import { z } from "zod";

export const userFormSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email().max(100),
  password: z.string().min(8).max(100).optional(),
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  employeeId: z.string().max(50).optional(),
  phone: z.string().max(15).optional(),
  dob: z.string().optional(),
  gender: z.string().max(1).optional(),
  department: z.string().max(50).optional(),
  designation: z.string().max(50).optional(),
  reportingManagerId: z.number().int().optional(),
  isActive: z.boolean().optional(),
  isEmailVerified: z.boolean().optional(),
  isPhoneVerified: z.boolean().optional()
});

export type UserFormValues = z.infer<typeof userFormSchema>;
