import z from "zod";

// Customer Type Schema
export const customerTypeSchema = z.object({
  code: z.string().min(1, "Code is required"),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  isExportType: z.coerce.boolean().default(false),
  isDomesticType: z.coerce.boolean().default(true),
  requiresDrugLicense: z.coerce.boolean().default(false),
  creditTermsApplicable: z.coerce.boolean().default(true),
  isActive: z.coerce.boolean().default(true),
});

// Customer Address Schema
export const customerAddressSchema = z.object({
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
  emailId: z.string().email("Invalid email format").optional().or(z.literal("")),
  website: z.string().optional(),
  isPrimary: z.coerce.boolean().default(true),
});

// Customer Banking Detail Schema
export const customerBankingDetailSchema = z.object({
  bankIfscCode: z.string().optional(),
  bankAccountNumber: z.string().optional(),
  bankName: z.string().optional(),
  customerBanker: z.string().optional(),
  customerVpa: z.string().optional(),
  bankAccountTypeCode: z.string().optional(),
  bankBranch: z.string().optional(),
  bankLocation: z.string().optional(),
  isPrimary: z.coerce.boolean().default(true),
});

// Customer Business Terms Schema
export const customerBusinessTermSchema = z.object({
  // Shipping & Logistics
  destinationCode: z.string().optional(),
  transportModeCode: z.string().optional(),
  transporterCode: z.string().optional(),
  leadDays: z.string()
    .optional()
    .transform((val) => {
      if (!val || val === "") return undefined;
      const num = parseInt(val);
      return isNaN(num) ? undefined : num;
    }),
  customerDistance: z.string()
    .optional()
    .transform((val) => {
      if (!val || val === "") return undefined;
      const num = parseFloat(val);
      return isNaN(num) ? undefined : num;
    }),
  freightIndicator: z.string().optional(),
  supplyStockLocation: z.string().optional(),
  allowConsignmentOnBooking: z.coerce.boolean().default(false),
  // Financial Terms
  customerAccountCode: z.string().optional(),
  creditLimit: z.string()
    .optional()
    .transform((val) => {
      if (!val || val === "") return undefined;
      const num = parseFloat(val);
      return isNaN(num) ? undefined : num;
    }),
  minimumInvoiceAmount: z.string()
    .optional()
    .transform((val) => {
      if (!val || val === "") return undefined;
      const num = parseFloat(val);
      return isNaN(num) ? undefined : num;
    }),
  customerSchemeCode: z.string().optional(),
  customerBrokerCode: z.string().optional(),
  customerBrokerRate: z.string()
    .optional()
    .transform((val) => {
      if (!val || val === "") return undefined;
      const num = parseFloat(val);
      return isNaN(num) ? undefined : num;
    }),
  cashDiscountPercentage: z.string()
    .optional()
    .transform((val) => {
      if (!val || val === "") return undefined;
      const num = parseFloat(val);
      return isNaN(num) ? undefined : num;
    }),
  miscChargePercentage: z.string()
    .optional()
    .transform((val) => {
      if (!val || val === "") return undefined;
      const num = parseFloat(val);
      return isNaN(num) ? undefined : num;
    }),
  miscDiscountPercentage: z.string()
    .optional()
    .transform((val) => {
      if (!val || val === "") return undefined;
      const num = parseFloat(val);
      return isNaN(num) ? undefined : num;
    }),
  paymentTermCode: z.string().optional(),
  creditPeriodDays: z.string()
    .optional()
    .transform((val) => {
      if (!val || val === "") return undefined;
      const num = parseInt(val);
      return isNaN(num) ? undefined : num;
    }),
  newPartyCreditPeriodDays: z.string()
    .optional()
    .transform((val) => {
      if (!val || val === "") return undefined;
      const num = parseInt(val);
      return isNaN(num) ? undefined : num;
    }),
  isOverdueCheck: z.coerce.boolean().default(true),
  numberOfBills: z.string()
    .optional()
    .transform((val) => {
      if (!val || val === "") return undefined;
      const num = parseInt(val);
      return isNaN(num) ? undefined : num;
    }),
  outstandingBillPeriodDays: z.string()
    .optional()
    .transform((val) => {
      if (!val || val === "") return undefined;
      const num = parseInt(val);
      return isNaN(num) ? undefined : num;
    }),
  outstandingBillAccountIndicator: z.string().optional(),
});

// Customer Tax Compliance Schema
export const customerTaxComplianceSchema = z.object({
  // Tax Configuration
  vatFormCode: z.string().optional(),
  centralFormCode: z.string().optional(),
  isEligibleForTcs: z.coerce.boolean().default(false),
  tcsType: z.string().optional(),
  isApplicableHigherRate: z.coerce.boolean().default(false),
  isDeemedNonResident: z.coerce.boolean().default(false),
  isDeemedPermanentEstablishment: z.coerce.boolean().default(false),
  isBillDiscount: z.coerce.boolean().default(false),
  isReverseEndOfYear: z.coerce.boolean().default(false),
  // Interface & Document Configuration
  customerInterfaceCode: z.string()
    .optional()
    .transform((val) => {
      if (!val || val === "") return undefined;
      const num = parseInt(val);
      return isNaN(num) ? undefined : num;
    }),
  interfaceFileFormat: z.string().optional(),
  projectionRatio: z.string()
    .optional()
    .transform((val) => {
      if (!val || val === "") return undefined;
      const num = parseFloat(val);
      return isNaN(num) ? undefined : num;
    }),
  numberOfDisplays: z.string()
    .optional()
    .transform((val) => {
      if (!val || val === "") return undefined;
      const num = parseInt(val);
      return isNaN(num) ? undefined : num;
    }),
  labelLayout: z.string().optional(),
  numberOfCopies: z.string()
    .optional()
    .transform((val) => {
      if (!val || val === "") return undefined;
      const num = parseInt(val);
      return isNaN(num) ? undefined : num;
    }),
  specialTerms: z.string().optional(),
  documentsThrough: z.string().optional(),
});

// Main Customer Master Schema
export const customerMasterSchema = z.object({
  // Basic Info
  locationCode: z.string().optional(),
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
  stopInvoice: z.coerce.boolean().default(false),
  isExportCustomer: z.coerce.boolean().default(false),
  isRegisteredDealer: z.coerce.boolean().default(false),
  isRecordClosed: z.coerce.boolean().default(false),
  isActive: z.coerce.boolean().default(true),
  continent: z.string().optional(),
  rebates: z.string().optional(),
  externalInformation: z.string().optional(),
  
  // Related Data
  addresses: z.array(customerAddressSchema).optional(),
  bankingDetails: z.array(customerBankingDetailSchema).optional(),
  businessTerms: customerBusinessTermSchema.optional(),
  taxCompliance: customerTaxComplianceSchema.optional(),
});

// Form Data Types
export type CustomerTypeFormData = z.infer<typeof customerTypeSchema>;
export type CustomerAddressFormData = z.infer<typeof customerAddressSchema>;
export type CustomerBankingDetailFormData = z.infer<typeof customerBankingDetailSchema>;
export type CustomerBusinessTermFormData = z.infer<typeof customerBusinessTermSchema>;
export type CustomerTaxComplianceFormData = z.infer<typeof customerTaxComplianceSchema>;
export type CustomerMasterFormData = z.infer<typeof customerMasterSchema>; 