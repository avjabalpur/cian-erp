import * as z from 'zod';

export const organizationFormSchema = z.object({
  // Basic Information
  code: z.string().min(1, 'Code is required').max(10, 'Code must be at most 10 characters'),
  name: z.string().min(1, 'Name is required').max(100, 'Name must be at most 100 characters'),
  locationTypeId: z.coerce.number().min(1, 'Location type is required'),
  contactPerson: z.string().max(100).optional(),
  
  // Contact Information
  email: z.string().email('Invalid email format').max(100).optional().or(z.literal('')),
  phone: z.string().max(15).optional(),
  website: z.string().url('Invalid URL format').max(100).optional().or(z.literal('')),
  
  // Address Information
  address1: z.string().max(100).optional(),
  address2: z.string().max(100).optional(),
  city: z.string().max(50).optional(),
  state: z.string().max(50).optional(),
  zip: z.string().max(10).optional(),
  country: z.string().max(50).optional(),
  
  // Tax Information
  gstinNumber: z.string().max(50).optional(),
  panNumber: z.string().max(10).optional(),
  tdsCycle: z.string().max(50).optional(),
  vatTinNumber: z.string().max(50).optional(),
  cstRegnNumber: z.string().max(50).optional(),
  
  // Additional Information
  employmentStatusCode: z.string().max(50).optional(),
  esiOfficeCode: z.string().max(50).optional(),
  cinNumber: z.string().max(50).optional(),
  licenseNumber: z.string().max(50).optional(),
  excReginCode: z.string().max(50).optional(),
  stRegnCode: z.string().max(50).optional(),
  interfaceCode: z.string().max(50).optional(),
  eccNumber: z.string().max(50).optional(),
  range: z.string().max(50).optional(),
  division: z.string().max(50).optional(),
  collectorate: z.string().max(50).optional(),
  drugLicenseNumber1: z.string().max(50).optional(),
  drugLicenseNumber2: z.string().max(50).optional(),
  foodLicenseNumber: z.string().max(50).optional(),
  
  isActive: z.boolean().optional(),
});

export type OrganizationFormValues = z.infer<typeof organizationFormSchema>;
