import * as z from 'zod';

export const salesOrderSchema = z.object({
  // Required Fields
  soNumber: z.string().min(1, 'SO Number is required'),
  soStatus: z.string().min(1, 'SO Status is required'),
  
  // Optional Basic Fields
  soDate: z.string().optional(),
  organizationId: z.coerce.number().optional(),
  customerId: z.coerce.number().optional(),
  paymentTerm: z.string().optional(),
  quotationDate: z.string().optional(),
  quotationNo: z.string().optional(),
  hsnCode: z.string().optional(),
  itemId: z.coerce.number().optional(),
  divisionId: z.coerce.number().optional(),
  designUnder: z.string().optional(),
  
  // Product Details
  packingStyleDescription: z.string().optional(),
  composition: z.string().optional(),
  packShort: z.string().optional(),
  
  // Quantities and Pricing
  quantity: z.string().optional(),
  mrp: z.string().optional(),
  billingRate: z.string().optional(),
  costing: z.string().optional(),
  
  // Status and Comments
  currentStatus: z.string().optional(),
  comments: z.string().optional(),
  
  // Flags
  isSubmitted: z.boolean().optional(),
});

export type SalesOrderFormValues = z.infer<typeof salesOrderSchema>;

