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

export interface CustomerAddressFilter {
  customerId: number;
  isPrimary?: boolean;
  page: number;
  pageSize: number;
  sortBy: string;
  sortDescending: boolean;
}

export type CreateCustomerAddressData = Omit<CustomerAddress, 'id' | 'createdAt' | 'updatedAt'>;

export type UpdateCustomerAddressData = Partial<Omit<CustomerAddress, 'id' | 'createdAt' | 'updatedAt'>> & {
  id: number;
};
