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

export interface CustomerBusinessTermsFilter {
  customerId: number;
  page: number;
  pageSize: number;
  sortBy: string;
  sortDescending: boolean;
}

export type CreateCustomerBusinessTermsData = Omit<CustomerBusinessTerms, 'id' | 'createdAt' | 'updatedAt'>;

export type UpdateCustomerBusinessTermsData = Partial<Omit<CustomerBusinessTerms, 'id' | 'createdAt' | 'updatedAt'>> & {
  id: number;
};
