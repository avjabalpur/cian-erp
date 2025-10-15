import * as z from 'zod';

export const hsnMasterSchema = z.object({
  code: z.string().min(1, 'Code is required').max(50, 'Code must be at most 50 characters'),
  name: z.string().min(1, 'Name is required').max(255, 'Name must be at most 255 characters'),
  description: z.string().optional(),
  hsnType: z.string().optional(),
  uqc: z.string().max(50).optional(),
  igstRate: z.coerce.number().min(0, 'IGST rate must be positive').max(100, 'IGST rate cannot exceed 100%').optional(),
  cgstRate: z.coerce.number().min(0, 'CGST rate must be positive').max(100, 'CGST rate cannot exceed 100%').optional(),
  sgstRate: z.coerce.number().min(0, 'SGST rate must be positive').max(100, 'SGST rate cannot exceed 100%').optional(),
  cessRate: z.coerce.number().min(0, 'CESS rate must be positive').max(100, 'CESS rate cannot exceed 100%').optional(),
  isReverseCharges: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

export type HsnMasterFormValues = z.infer<typeof hsnMasterSchema>;
