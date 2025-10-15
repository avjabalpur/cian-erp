import * as z from 'zod';

export const contactSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  phone: z.string().optional(),
  title: z.string().optional(),
  isPrimary: z.boolean().default(false),
  portalAccess: z.boolean().default(false),
});

export const addressSchema = z.object({
  street: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State/Province is required"),
  zip: z.string().min(1, "Postal/Zip code is required"),
  country: z.string().min(1, "Country is required"),
  isPrimary: z.boolean().default(false),
});

// Base schema for form values (allowing strings for number inputs)
export const customerFormSchema = z.object({
  companyId: z.coerce.number().min(1, "Company name is required"),
  name: z.string().min(1, "Contact name is required"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  phone: z.string().optional(),
  website: z.string().url("Invalid website URL").or(z.literal("")).optional(),
  industry: z.string().optional(),
  segment: z.string().optional(),
  status: z.string().optional(),
  
  // Accept both string and number input, but transform to number
  typeId: z.coerce.number().min(1, "Type is required"),
  tierId: z.coerce.number().min(1, "Tier is required"),
  accountManagerId: z.coerce.number().min(1, "Account manager is required"),
  
  addresses: z.array(addressSchema).nonempty({
    message: "At least one address is required",
  }),
  
  // Accept string input but will be converted to number
  annualRevenue: z.coerce.number().optional(),
  employeeCount: z.coerce.number().optional(),
  
  referralSource: z.string().optional(),
  
  contacts: z.array(contactSchema).nonempty({
    message: "At least one contact is required",
  }),
  
  tags: z.array(z.string()).default([]),
});

export type CustomerFormValues = z.infer<typeof customerFormSchema>;

export type ContactFormValues = z.infer<typeof contactSchema>;

export type AddressFormValues = z.infer<typeof addressSchema>;
