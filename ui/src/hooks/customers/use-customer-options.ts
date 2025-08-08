import { useQuery } from '@tanstack/react-query';
import api from '../../lib/api';
import { Customer } from '../../types/customer';

interface CustomerOption {
  data: Customer;
  label: string;
  value: number;
}

const getCustomerOptions = async (excludeId?: number): Promise<CustomerOption[]> => {
  const { data } = await api.get<Customer[]>('/customers', {
    params: {
      pageNumber: 1,
      pageSize: 1000, // Get all customers for lookup
      isActive: true, // Only active customers
    }
  });

  return data
    .filter(customer => !excludeId || customer.id !== excludeId)
    .map(customer => ({
      data: customer,
      label: `${customer.customerCode} - ${customer.customerName}`,
      value: customer.id,
    }));
};

export const useCustomerOptions = (excludeId?: number) => {
  return useQuery<CustomerOption[], Error>({
    queryKey: ['customer-options', excludeId],
    queryFn: () => getCustomerOptions(excludeId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
