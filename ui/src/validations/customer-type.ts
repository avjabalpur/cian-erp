import z from "zod";

export const customerTypeSchema = z.object({
  code: z.string().min(1, "Code is required").max(10, "Code must be at most 10 characters"),
  name: z.string().min(1, "Name is required").max(100, "Name must be at most 100 characters"),
  description: z.string().max(500, "Description must be at most 500 characters").optional(),
  isExportType: z.boolean(),
  isDomesticType: z.boolean(),
  requiresDrugLicense: z.boolean(),
  creditTermsApplicable: z.boolean(),
  isActive: z.boolean(),
});

export const customerTypeUpdateSchema = customerTypeSchema.partial(); 