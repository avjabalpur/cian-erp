import z from "zod"

export const organizationFormSchema = z.object({
  code: z.string().min(1, "Organization code is required").max(20),
  name: z.string().min(1, "Organization name is required").max(100),
  locationTypeId: z.number().min(1, "Location type is required"),
  contactPerson: z.string().max(100).optional(),
  address1: z.string().max(200).optional(),
  address2: z.string().max(200).optional(),
  city: z.string().max(50).optional(),
  state: z.string().max(50).optional(),
  country: z.string().max(50).optional(),
  zip: z.string().max(10).optional(),
  phone: z.string().max(20).optional(),
  email: z.string().email("Invalid email format").optional().or(z.literal("")),
  website: z.string().url("Invalid website URL").optional().or(z.literal("")),
  gstinNumber: z.string().max(15).optional(),
  panNumber: z.string().max(10).optional(),
  isActive: z.boolean().optional(),
})

export type OrganizationFormValues = z.infer<typeof organizationFormSchema> 