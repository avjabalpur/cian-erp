export interface Customer {
  id: number;
  customerNumber: string;
  customerName: string;
  shortName: string;
  customerType: string;
  gstin: string;
  panNumber: string;
  phone: string;
  email: string;
  city: string;
  state: string;
  creditLimit: number;
  creditDays: number;
  isActive: boolean;
  totalOrders: number;
  address?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CustomerFilters {
  search: string;
  customerType: string;
  status: string;
  city: string;
}

export type CreateCustomerData = Omit<Customer, 'id' | 'totalOrders' | 'createdAt' | 'updatedAt'>;

export type UpdateCustomerData = Partial<CreateCustomerData>;
