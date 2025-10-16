import * as z from 'zod';

// Customer Schema
export const customerSchema = z.object({
  // Basic Information - Required Fields
  locationCode: z.string().min(1, 'Location code is required'),
  customerNumber: z.string().min(1, 'Customer number is required'),
  customerCode: z.string().min(1, 'Customer code is required'),
  customerName: z.string().min(1, 'Customer name is required').max(255, 'Customer name must be at most 255 characters'),
  
  // Basic Information - Optional Fields
  shortName: z.coerce.string().optional(),
  payeeName: z.coerce.string().optional(),
  customerTypeCode: z.coerce.string().optional(),
  segmentCode: z.coerce.string().optional(),
  incomeTaxPanNumber: z.coerce.string().optional(),
  customerSaleType: z.coerce.string().optional(),
  exportType: z.coerce.string().optional(),
  gstin: z.coerce.string().optional(),
  drugLicenseNumber: z.coerce.string().optional(),
  drugLicenseExpiryDate: z.coerce.string().optional(),
  otherLicenseNumber: z.coerce.string().optional(),
  oldCode: z.coerce.string().optional(),
  customerLotNumber: z.coerce.string().optional(),
  continent: z.coerce.string().optional(),
  rebates: z.coerce.string().optional(),
  externalInformation: z.coerce.string().optional(),
  
  // Flags
  stopInvoice: z.boolean().optional(),
  isExportCustomer: z.boolean().optional(),
  isRegisteredDealer: z.boolean().optional(),
  isRecordClosed: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

// Customer Address Schema
export const customerAddressSchema = z.object({
  addressLine1: z.coerce.string().optional(),
  addressLine2: z.coerce.string().optional(),
  addressLine3: z.coerce.string().optional(),
  city: z.coerce.string().optional(),
  zipCode: z.coerce.string().optional(),
  country: z.coerce.string().optional(),
  stateCode: z.coerce.string().optional(),
  gstStateCode: z.coerce.string().optional(),
  contactPerson: z.coerce.string().optional(),
  telephoneNumber: z.coerce.string().optional(),
  mobileNumber: z.coerce.string().optional(),
  faxNumber: z.string().optional(),
  emailId: z.coerce.string().email('Invalid email').optional().or(z.literal('')),
  website: z.coerce.string().url('Invalid URL').optional().or(z.literal('')),
  isPrimary: z.boolean().optional(),
});

// Customer Banking Details Schema
export const customerBankingDetailsSchema = z.object({
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

// Customer Business Terms Schema
export const customerBusinessTermsSchema = z.object({
  destinationCode: z.string().optional(),
  transportModeCode: z.string().optional(),
  transporterCode: z.string().optional(),
  leadDays: z.coerce.number().optional(),
  customerDistance: z.coerce.number().optional(),
  freightIndicator: z.string().optional(),
  supplyStockLocation: z.string().optional(),
  allowConsignmentOnBooking: z.boolean().optional(),
  customerAccountCode: z.string().optional(),
  creditLimit: z.coerce.number().optional(),
  minimumInvoiceAmount: z.coerce.number().optional(),
  customerSchemeCode: z.string().optional(),
  customerBrokerCode: z.string().optional(),
  customerBrokerRate: z.coerce.number().optional(),
  cashDiscountPercentage: z.coerce.number().optional(),
  miscChargePercentage: z.coerce.number().optional(),
  miscDiscountPercentage: z.coerce.number().optional(),
  paymentTermCode: z.string().optional(),
  creditPeriodDays: z.coerce.number().optional(),
  newPartyCreditPeriodDays: z.coerce.number().optional(),
  isOverdueCheck: z.boolean().optional(),
  numberOfBills: z.coerce.number().optional(),
  outstandingBillPeriodDays: z.coerce.number().optional(),
  outstandingBillAccountIndicator: z.string().optional(),
});

// Customer Tax Compliance Schema
export const customerTaxComplianceSchema = z.object({
  vatFormCode: z.string().optional(),
  centralFormCode: z.string().optional(),
  isEligibleForTcs: z.boolean().optional(),
  tcsType: z.string().optional(),
  isApplicableHigherRate: z.boolean().optional(),
  isDeemedNonResident: z.boolean().optional(),
  isDeemedPermanentEstablishment: z.boolean().optional(),
  isBillDiscount: z.boolean().optional(),
  isReverseEndOfYear: z.boolean().optional(),
  customerInterfaceCode: z.coerce.number().optional(),
  interfaceFileFormat: z.string().optional(),
  projectionRatio: z.coerce.number().optional(),
  numberOfDisplays: z.coerce.number().optional(),
  labelLayout: z.string().optional(),
  numberOfCopies: z.coerce.number().optional(),
  specialTerms: z.string().optional(),
  documentsThrough: z.string().optional(),
});

export type CustomerFormValues = z.infer<typeof customerSchema>;
export type CustomerAddressFormValues = z.infer<typeof customerAddressSchema>;
export type CustomerBankingDetailsFormValues = z.infer<typeof customerBankingDetailsSchema>;
export type CustomerBusinessTermsFormValues = z.infer<typeof customerBusinessTermsSchema>;
export type CustomerTaxComplianceFormValues = z.infer<typeof customerTaxComplianceSchema>;

