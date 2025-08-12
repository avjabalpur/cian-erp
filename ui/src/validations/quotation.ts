import { z } from "zod";

// Product line item schema
export const quotationItemSchema = z.object({
  id: z.string().optional(),
  salesOrderApprovalId: z.number().optional(),
  productName: z.string().min(1, "Product name is required"),
  composition: z.string().optional(),
  dosageName: z.string().optional(),
  productCast: z.string().optional(),
  pPackShort: z.string().optional(),
  soStatus: z.string().optional(),
  pQuantity: z.number().min(1, "Quantity must be greater than 0"),
  pFocQty: z.number().optional(),
  pMrp: z.number().optional(),
  pBillingRate: z.number().min(0, "Billing rate must be greater than or equal to 0"),
  comments: z.string().optional(),
  taxPercent: z.number().min(0).max(100).default(0),
  productExtraCharges: z.number().default(0),
  productExtraChargesTaxPercent: z.number().min(0).max(100).default(0),
});

// Main quotation schema
export const quotationSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  quotationNumber: z.string().min(1, "Quotation number is required"),
  quotationDate: z.string().min(1, "Quotation date is required"),
  customerName: z.string().min(1, "Customer name is required"),
  contactPerson: z.string().optional(),
  paymentTerm: z.string().optional(),
  mobileNo: z.string().optional(),
  emailId: z.string().optional(),
  preparedBy: z.string().optional(),
  finalComment: z.string().optional(),
  advancePercentage: z.number().min(0).max(100).default(0),
  items: z.array(quotationItemSchema).min(1, "At least one item is required"),
  charges: z.object({
    inventoryCharges: z.number().default(0),
    inventoryChargesTaxPercent: z.number().default(0),
  }).optional(),
});

export type QuotationFormData = z.infer<typeof quotationSchema>;
