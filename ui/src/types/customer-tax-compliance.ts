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

export interface CustomerTaxComplianceFilter {
  customerId: number;
  page: number;
  pageSize: number;
  sortBy: string;
  sortDescending: boolean;
}

export type CreateCustomerTaxComplianceData = Omit<CustomerTaxCompliance, 'id' | 'createdAt' | 'updatedAt'>;

export type UpdateCustomerTaxComplianceData = Partial<Omit<CustomerTaxCompliance, 'id' | 'createdAt' | 'updatedAt'>> & {
  id: number;
};
