import * as z from 'zod';

export const customerTypeSchema = z.object({
  code: z.string().min(1, 'Code is required').max(50, 'Code must be at most 50 characters'),
  name: z.string().min(1, 'Name is required').max(100, 'Name must be at most 100 characters'),
  description: z.string().optional(),
  isExportType: z.boolean().optional(),
  isDomesticType: z.boolean().optional(),
  requiresDrugLicense: z.boolean().optional(),
  creditTermsApplicable: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

export type CustomerTypeFormValues = z.infer<typeof customerTypeSchema>;

