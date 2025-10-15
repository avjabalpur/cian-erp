import { z } from "zod";

export const productGroupSchema = z.object({
  code: z.string().min(1, "Code is required").max(10, "Code must be at most 10 characters"),
  level: z.string().min(1, "Level is required").max(20, "Level must be at most 20 characters"),
  productGroupName: z.string().min(1, "Product group name is required").max(255, "Product group name must be at most 255 characters"),
  unit: z.string().max(10, "Unit must be at most 10 characters").default("NOS"),
  salesDivisionCode: z.coerce.number().optional(),
  uomForMls: z.string().max(10, "UOM for MLS must be at most 10 characters").default("NOS"),
  conversionFactor: z.coerce.number().min(0, "Conversion factor must be non-negative").default(1.00000000),
  conversionFactorUnit: z.string().max(20, "Conversion factor unit must be at most 20 characters").default("NOS/NOS"),
  costCentreCode: z.string().max(10, "Cost centre code must be at most 10 characters").optional(),
  isClosed: z.coerce.boolean().default(false),
  revNo: z.string().max(10, "Revision number must be at most 10 characters").default("00938"),
  isActive: z.coerce.boolean().default(false),
});

export type ProductGroupFormData = z.infer<typeof productGroupSchema>; 