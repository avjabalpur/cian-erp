import z from "zod"

export const customerSchema = z.object({
  locationCode: z.string().min(1, "Location Code is required"),
  customerNumber: z.string().min(1, "Customer Number is required"),
  customerCode: z.string().min(1, "Customer Code is required"),
  customerName: z.string().min(1, "Customer Name is required"),
  shortName: z.string().optional(),
  payeeName: z.string().optional(),
  customerTypeCode: z.string().optional(),
  segmentCode: z.string().optional(),
  incomeTaxPanNumber: z.string().optional(),
  customerSaleType: z.string().optional(),
  exportType: z.string().optional(),
  gstin: z.string().optional(),
  drugLicenseNumber: z.string().optional(),
  drugLicenseExpiryDate: z.string().optional(),
  otherLicenseNumber: z.string().optional(),
  oldCode: z.string().optional(),
  customerLotNumber: z.string().optional(),
  stopInvoice: z.boolean().default(false),
  isExportCustomer: z.boolean().default(false),
  isRegisteredDealer: z.boolean().default(false),
  isRecordClosed: z.boolean().default(false),
  isActive: z.boolean().default(true),
  continent: z.string().optional(),
  rebates: z.string().optional(),
  externalInformation: z.string().optional(),
});

export type CustomerFormData = z.infer<typeof customerSchema>

export const customerUpdateSchema = customerSchema.partial();

export type CustomerUpdateFormValues = z.infer<typeof customerUpdateSchema>; 