import { useQuery } from '@tanstack/react-query';
import api from '../../lib/api';
import { Customer } from '../../types/customer';

interface CustomerResponse {
  items: Customer[];
  totalCount: number;
}

const getAllCustomers = async (): Promise<Customer[]> => {
  const { data } = await api.get<CustomerResponse>('/customers?pageSize=1000&sortBy=customerName&sortDescending=false');
  return data?.items || [];
};

export const useCustomerOptions = (excludeId?: number) => {
  return useQuery<Customer[], Error>({
    queryKey: ['customer-options', excludeId],
    queryFn: getAllCustomers,
    select: (customers) => {
      let filteredCustomers = customers.filter(customer => customer.isActive && !customer.isDeleted);
      
      if (excludeId) {
        filteredCustomers = filteredCustomers.filter(customer => customer.id !== excludeId);
      }
      
      return filteredCustomers.map(customer => ({
        label: `${customer.customerName} (${customer.customerCode})`,
        value: customer.id.toString(),
        data: customer
      }));
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}; 