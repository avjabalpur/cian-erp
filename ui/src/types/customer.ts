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
  // Related tables
  addresses?: CustomerAddress[];
  bankingDetails?: CustomerBankingDetails[];
  businessTerms?: CustomerBusinessTerms[];
  taxCompliance?: CustomerTaxCompliance[];
}

export interface CustomerFilter {
  search?: string;
  customerCode?: string;
  customerName?: string;
  customerTypeCode?: string;
  gstin?: string;
  isActive?: boolean;
  isExportCustomer?: boolean;
  page: number;
  pageSize: number;
  sortBy: string;
  sortDescending: boolean;
}

export type CreateCustomerData = Omit<Customer, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy' | 'isDeleted' | 'addresses' | 'bankingDetails' | 'businessTerms' | 'taxCompliance'>;

export type UpdateCustomerData = Partial<Omit<Customer, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy' | 'isDeleted' | 'addresses' | 'bankingDetails' | 'businessTerms' | 'taxCompliance'>> & {
  id: number;
};
