import z from "zod"

// Address schema - updated to match actual database structure
export const addressSchema = z.object({
  addressLine1: z.string().optional(),
  addressLine2: z.string().optional(),
  addressLine3: z.string().optional(),
  city: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().optional(),
  stateCode: z.string().optional(),
  gstStateCode: z.string().optional(),
  contactPerson: z.string().optional(),
  telephoneNumber: z.string().optional(),
  mobileNumber: z.string().optional(),
  faxNumber: z.string().optional(),
  emailId: z.string().optional(),
  website: z.string().optional(),
  isPrimary: z.boolean().optional(),
});

// Banking details schema - updated to match actual database structure
export const bankingDetailsSchema = z.object({
  bankIfscCode: z.string().optional(),
  bankAccountNumber: z.string().optional(),
  bankName: z.string().optional(),
  customerBanker: z.string().optional(),
  customerVpa: z.string().optional(),
  bankAccountTypeCode: z.string().optional(),
  bankBranch: z.string().optional(),
  bankLocation: z.string().optional(),
  isPrimary: z.boolean().optional(),
});

// Business terms schema - updated to match actual database structure
export const businessTermsSchema = z.object({
  destinationCode: z.string().optional(),
  transportModeCode: z.string().optional(),
  transporterCode: z.string().optional(),
  leadDays: z.number().optional(),
  customerDistance: z.number().optional(),
  freightIndicator: z.string().optional(),
  supplyStockLocation: z.string().optional(),
  allowConsignmentOnBooking: z.boolean().optional(),
  customerAccountCode: z.string().optional(),
  creditLimit: z.number().optional(),
  minimumInvoiceAmount: z.number().optional(),
  customerSchemeCode: z.string().optional(),
  customerBrokerCode: z.string().optional(),
  customerBrokerRate: z.number().optional(),
  cashDiscountPercentage: z.number().optional(),
  miscChargePercentage: z.number().optional(),
  miscDiscountPercentage: z.number().optional(),
  paymentTermCode: z.string().optional(),
  creditPeriodDays: z.number().optional(),
  newPartyCreditPeriodDays: z.number().optional(),
  isOverdueCheck: z.boolean().optional(),
  numberOfBills: z.number().optional(),
  outstandingBillPeriodDays: z.number().optional(),
  outstandingBillAccountIndicator: z.string().optional(),
});

// Tax compliance schema - updated to match actual database structure
export const taxComplianceSchema = z.object({
  vatFormCode: z.string().optional(),
  centralFormCode: z.string().optional(),
  isEligibleForTcs: z.boolean().optional(),
  tcsType: z.string().optional(),
  isApplicableHigherRate: z.boolean().optional(),
  isDeemedNonResident: z.boolean().optional(),
  isDeemedPermanentEstablishment: z.boolean().optional(),
  isBillDiscount: z.boolean().optional(),
  isReverseEndOfYear: z.boolean().optional(),
  customerInterfaceCode: z.number().optional(),
  interfaceFileFormat: z.string().optional(),
  projectionRatio: z.number().optional(),
  numberOfDisplays: z.number().optional(),
  labelLayout: z.string().optional(),
  numberOfCopies: z.number().optional(),
  specialTerms: z.string().optional(),
  documentsThrough: z.string().optional(),
});

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
  // Related tables
  addresses: z.array(addressSchema).optional(),
  bankingDetails: z.array(bankingDetailsSchema).optional(),
  businessTerms: z.array(businessTermsSchema).optional(),
  taxCompliance: z.array(taxComplianceSchema).optional(),
});

export type CustomerFormData = z.infer<typeof customerSchema>

export const customerUpdateSchema = customerSchema.partial();

export type CustomerUpdateFormValues = z.infer<typeof customerUpdateSchema>; 

export type AddressFormData = z.infer<typeof addressSchema>;