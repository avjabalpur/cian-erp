// Main Customer Interface
export interface Customer {
  id: number;
  locationCode: string;
  customerNumber: string;
  customerCode: string;
  customerName: string;
  shortName?: string;
  payeeName?: string;
  customerTypeCode?: string;
  segmentCode?: string;
  incomeTaxPanNumber?: string;
  customerSaleType?: string;
  exportType?: string;
  gstin?: string;
  drugLicenseNumber?: string;
  drugLicenseExpiryDate?: string;
  otherLicenseNumber?: string;
  oldCode?: string;
  customerLotNumber?: string;
  stopInvoice: boolean;
  isExportCustomer: boolean;
  isRegisteredDealer: boolean;
  isRecordClosed: boolean;
  isActive: boolean;
  continent?: string;
  rebates?: string;
  externalInformation?: string;
  createdAt: string;
  updatedAt?: string;
  createdBy?: number;
  updatedBy?: number;
  isDeleted: boolean;
  addresses?: CustomerAddress[];
  bankingDetails?: CustomerBankingDetails[];
  businessTerms?: CustomerBusinessTerms[];
  taxCompliance?: CustomerTaxCompliance[];
}

// Customer Address
export interface CustomerAddress {
  id: number;
  customerId: number;
  addressLine1?: string;
  addressLine2?: string;
  addressLine3?: string;
  city?: string;
  zipCode?: string;
  country?: string;
  stateCode?: string;
  gstStateCode?: string;
  contactPerson?: string;
  telephoneNumber?: string;
  mobileNumber?: string;
  faxNumber?: string;
  emailId?: string;
  website?: string;
  isPrimary: boolean;
  createdAt: string;
  updatedAt?: string;
}

// Customer Banking Details
export interface CustomerBankingDetails {
  id: number;
  customerId: number;
  bankIfscCode?: string;
  bankAccountNumber?: string;
  bankName?: string;
  customerBanker?: string;
  customerVpa?: string;
  bankAccountTypeCode?: string;
  bankBranch?: string;
  bankLocation?: string;
  isPrimary: boolean;
  createdAt: string;
  updatedAt?: string;
}

// Customer Business Terms
export interface CustomerBusinessTerms {
  id: number;
  customerId: number;
  destinationCode?: string;
  transportModeCode?: string;
  transporterCode?: string;
  leadDays?: number;
  customerDistance?: number;
  freightIndicator?: string;
  supplyStockLocation?: string;
  allowConsignmentOnBooking: boolean;
  customerAccountCode?: string;
  creditLimit?: number;
  minimumInvoiceAmount?: number;
  customerSchemeCode?: string;
  customerBrokerCode?: string;
  customerBrokerRate?: number;
  cashDiscountPercentage?: number;
  miscChargePercentage?: number;
  miscDiscountPercentage?: number;
  paymentTermCode?: string;
  creditPeriodDays?: number;
  newPartyCreditPeriodDays?: number;
  isOverdueCheck: boolean;
  numberOfBills?: number;
  outstandingBillPeriodDays?: number;
  outstandingBillAccountIndicator?: string;
  createdAt: string;
  updatedAt?: string;
}

// Customer Tax Compliance
export interface CustomerTaxCompliance {
  id: number;
  customerId: number;
  vatFormCode?: string;
  centralFormCode?: string;
  isEligibleForTcs: boolean;
  tcsType?: string;
  isApplicableHigherRate: boolean;
  isDeemedNonResident: boolean;
  isDeemedPermanentEstablishment: boolean;
  isBillDiscount: boolean;
  isReverseEndOfYear: boolean;
  customerInterfaceCode?: number;
  interfaceFileFormat?: string;
  projectionRatio?: number;
  numberOfDisplays?: number;
  labelLayout?: string;
  numberOfCopies?: number;
  specialTerms?: string;
  documentsThrough?: string;
  createdAt: string;
  updatedAt?: string;
}

// Create/Update Types
export interface CreateCustomerData {
  locationCode: string;
  customerNumber: string;
  customerCode: string;
  customerName: string;
  shortName?: string;
  payeeName?: string;
  customerTypeCode?: string;
  segmentCode?: string;
  incomeTaxPanNumber?: string;
  customerSaleType?: string;
  exportType?: string;
  gstin?: string;
  drugLicenseNumber?: string;
  drugLicenseExpiryDate?: string;
  otherLicenseNumber?: string;
  oldCode?: string;
  customerLotNumber?: string;
  stopInvoice: boolean;
  isExportCustomer: boolean;
  isRegisteredDealer: boolean;
  isRecordClosed: boolean;
  isActive: boolean;
  continent?: string;
  rebates?: string;
  externalInformation?: string;
}

export type UpdateCustomerData = Partial<CreateCustomerData>;

export interface CustomerFilter {
  search?: string;
  customerCode?: string;
  customerName?: string;
  customerTypeCode?: string;
  gstin?: string;
  isActive?: boolean;
  isExportCustomer?: boolean;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortDescending?: boolean;
}

