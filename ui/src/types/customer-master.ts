export interface CustomerType {
  id: number;
  code: string;
  name: string;
  description?: string;
  isExportType: boolean;
  isDomesticType: boolean;
  requiresDrugLicense: boolean;
  creditTermsApplicable: boolean;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: number;
  updatedBy?: number;
}

export interface CreateCustomerTypeData {
  code: string;
  name: string;
  description?: string;
  isExportType?: boolean;
  isDomesticType?: boolean;
  requiresDrugLicense?: boolean;
  creditTermsApplicable?: boolean;
  isActive?: boolean;
}

export interface UpdateCustomerTypeData {
  code?: string;
  name?: string;
  description?: string;
  isExportType?: boolean;
  isDomesticType?: boolean;
  requiresDrugLicense?: boolean;
  creditTermsApplicable?: boolean;
  isActive?: boolean;
}

export interface Customer {
  id: number;
  locationCode?: string;
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
  createdAt?: string;
  updatedAt?: string;
  createdBy?: number;
  updatedBy?: number;
  isDeleted: boolean;
  addresses?: CustomerAddress[];
  bankingDetails?: CustomerBankingDetail[];
  businessTerms?: CustomerBusinessTerm[];
  taxCompliance?: CustomerTaxCompliance;
}

export interface CreateCustomerData {
  locationCode?: string;
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
  stopInvoice?: boolean;
  isExportCustomer?: boolean;
  isRegisteredDealer?: boolean;
  isRecordClosed?: boolean;
  isActive?: boolean;
  continent?: string;
  rebates?: string;
  externalInformation?: string;
  addresses?: CreateCustomerAddressData[];
  bankingDetails?: CreateCustomerBankingDetailData[];
  businessTerms?: CreateCustomerBusinessTermData;
  taxCompliance?: CreateCustomerTaxComplianceData;
}

export interface UpdateCustomerData {
  locationCode?: string;
  customerNumber?: string;
  customerCode?: string;
  customerName?: string;
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
  stopInvoice?: boolean;
  isExportCustomer?: boolean;
  isRegisteredDealer?: boolean;
  isRecordClosed?: boolean;
  isActive?: boolean;
  continent?: string;
  rebates?: string;
  externalInformation?: string;
  addresses?: UpdateCustomerAddressData[];
  bankingDetails?: UpdateCustomerBankingDetailData[];
  businessTerms?: UpdateCustomerBusinessTermData;
  taxCompliance?: UpdateCustomerTaxComplianceData;
}

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
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCustomerAddressData {
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
  isPrimary?: boolean;
}

export interface UpdateCustomerAddressData {
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
  isPrimary?: boolean;
}

export interface CustomerBankingDetail {
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
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCustomerBankingDetailData {
  bankIfscCode?: string;
  bankAccountNumber?: string;
  bankName?: string;
  customerBanker?: string;
  customerVpa?: string;
  bankAccountTypeCode?: string;
  bankBranch?: string;
  bankLocation?: string;
  isPrimary?: boolean;
}

export interface UpdateCustomerBankingDetailData {
  bankIfscCode?: string;
  bankAccountNumber?: string;
  bankName?: string;
  customerBanker?: string;
  customerVpa?: string;
  bankAccountTypeCode?: string;
  bankBranch?: string;
  bankLocation?: string;
  isPrimary?: boolean;
}

export interface CustomerBusinessTerm {
  id: number;
  customerId: number;
  // Shipping & Logistics
  destinationCode?: string;
  transportModeCode?: string;
  transporterCode?: string;
  leadDays?: number;
  customerDistance?: number;
  freightIndicator?: string;
  supplyStockLocation?: string;
  allowConsignmentOnBooking: boolean;
  // Financial Terms
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
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCustomerBusinessTermData {
  destinationCode?: string;
  transportModeCode?: string;
  transporterCode?: string;
  leadDays?: number;
  customerDistance?: number;
  freightIndicator?: string;
  supplyStockLocation?: string;
  allowConsignmentOnBooking?: boolean;
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
  isOverdueCheck?: boolean;
  numberOfBills?: number;
  outstandingBillPeriodDays?: number;
  outstandingBillAccountIndicator?: string;
}

export interface UpdateCustomerBusinessTermData {
  destinationCode?: string;
  transportModeCode?: string;
  transporterCode?: string;
  leadDays?: number;
  customerDistance?: number;
  freightIndicator?: string;
  supplyStockLocation?: string;
  allowConsignmentOnBooking?: boolean;
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
  isOverdueCheck?: boolean;
  numberOfBills?: number;
  outstandingBillPeriodDays?: number;
  outstandingBillAccountIndicator?: string;
}

export interface CustomerTaxCompliance {
  id: number;
  customerId: number;
  // Tax Configuration
  vatFormCode?: string;
  centralFormCode?: string;
  isEligibleForTcs: boolean;
  tcsType?: string;
  isApplicableHigherRate: boolean;
  isDeemedNonResident: boolean;
  isDeemedPermanentEstablishment: boolean;
  isBillDiscount: boolean;
  isReverseEndOfYear: boolean;
  // Interface & Document Configuration
  customerInterfaceCode?: number;
  interfaceFileFormat?: string;
  projectionRatio?: number;
  numberOfDisplays?: number;
  labelLayout?: string;
  numberOfCopies?: number;
  specialTerms?: string;
  documentsThrough?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCustomerTaxComplianceData {
  vatFormCode?: string;
  centralFormCode?: string;
  isEligibleForTcs?: boolean;
  tcsType?: string;
  isApplicableHigherRate?: boolean;
  isDeemedNonResident?: boolean;
  isDeemedPermanentEstablishment?: boolean;
  isBillDiscount?: boolean;
  isReverseEndOfYear?: boolean;
  customerInterfaceCode?: number;
  interfaceFileFormat?: string;
  projectionRatio?: number;
  numberOfDisplays?: number;
  labelLayout?: string;
  numberOfCopies?: number;
  specialTerms?: string;
  documentsThrough?: string;
}

export interface UpdateCustomerTaxComplianceData {
  vatFormCode?: string;
  centralFormCode?: string;
  isEligibleForTcs?: boolean;
  tcsType?: string;
  isApplicableHigherRate?: boolean;
  isDeemedNonResident?: boolean;
  isDeemedPermanentEstablishment?: boolean;
  isBillDiscount?: boolean;
  isReverseEndOfYear?: boolean;
  customerInterfaceCode?: number;
  interfaceFileFormat?: string;
  projectionRatio?: number;
  numberOfDisplays?: number;
  labelLayout?: string;
  numberOfCopies?: number;
  specialTerms?: string;
  documentsThrough?: string;
}

export interface CustomerMasterFilter {
  search?: string;
  customerNumber?: string;
  customerCode?: string;
  customerName?: string;
  shortName?: string;
  customerTypeCode?: string;
  segmentCode?: string;
  gstin?: string;
  isExportCustomer?: boolean;
  isRegisteredDealer?: boolean;
  isRecordClosed?: boolean;
  isActive?: boolean;
  continent?: string;
  createdFrom?: string;
  createdTo?: string;
  updatedFrom?: string;
  updatedTo?: string;
  sortBy?: string;
  sortDescending?: boolean;
  pageNumber?: number;
  pageSize?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
} 