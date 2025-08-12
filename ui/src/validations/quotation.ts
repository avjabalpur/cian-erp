import * as z from "zod";

export const quotationSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  quotationNumber: z.string().min(1, "Quotation number is required"),
  quotationDate: z.string().optional(),
  customerName: z.string().min(1, "Customer name is required"),
  customerContactPerson: z.string().min(1, "Contact person is required"),
  customerMobileNumber: z.string().min(1, "Mobile number is required"),
  customerEmail: z.string().email("Invalid email address").optional().or(z.literal("")),
  paymentTerms: z.string().optional(),
  advancePercentage: z.number().min(0).max(100),
  finalComment: z.string().optional(),
  terms: z.string().optional(),
});

export const quotationProductSchema = z.object({
  id: z.number(),
  productName: z.string().min(1, "Product name is required"),
  composition: z.string().optional(),
  dosageName: z.string().optional(),
  productCast: z.string().optional(),
  packShort: z.string().optional(),
  quantity: z.number().min(0, "Quantity must be positive"),
  focQty: z.number().min(0, "FOC quantity must be positive"),
  mrp: z.number().min(0, "MRP must be positive"),
  billingRate: z.number().min(0, "Billing rate must be positive"),
  taxPercent: z.number().min(0, "Tax percentage must be positive"),
  total: z.number().min(0, "Total must be positive"),
});

export const quotationChargeSchema = z.object({
  id: z.number(),
  description: z.string().min(1, "Description is required"),
  amount: z.number().min(0, "Amount must be positive"),
  taxPercent: z.number().min(0, "Tax percentage must be positive"),
  total: z.number().min(0, "Total must be positive"),
});

export const createQuotationSchema = z.object({
  ...quotationSchema.shape,
  products: z.array(quotationProductSchema).min(1, "At least one product is required"),
  charges: z.array(quotationChargeSchema).optional(),
  totalAmount: z.number().min(0, "Total amount must be positive"),
  advanceAmount: z.number().min(0, "Advance amount must be positive"),
  prevCopyQuotationId: z.number().optional(),
});
