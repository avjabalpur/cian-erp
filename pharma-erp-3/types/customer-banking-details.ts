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

export interface CustomerBankingDetailsFilter {
  customerId: number;
  isPrimary?: boolean;
  page: number;
  pageSize: number;
  sortBy: string;
  sortDescending: boolean;
}

export type CreateCustomerBankingDetailsData = Omit<CustomerBankingDetails, 'id' | 'createdAt' | 'updatedAt'>;

export type UpdateCustomerBankingDetailsData = Partial<Omit<CustomerBankingDetails, 'id' | 'createdAt' | 'updatedAt'>> & {
  id: number;
};
