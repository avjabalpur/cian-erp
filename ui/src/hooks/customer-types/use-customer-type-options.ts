import { useQuery } from '@tanstack/react-query';
import api from '../../lib/api';
import { CustomerType } from '../../types/customer-type';

interface CustomerTypeResponse {
  items: CustomerType[];
  totalCount: number;
}

const getAllCustomerTypes = async (): Promise<CustomerType[]> => {
  const { data } = await api.get<CustomerTypeResponse>('/customer-types?pageSize=1000&sortBy=name&sortDescending=false');
  return data?.items || [];
};

export const useCustomerTypeOptions = (excludeId?: number) => {
  return useQuery<CustomerType[], Error>({
    queryKey: ['customer-type-options', excludeId],
    queryFn: getAllCustomerTypes,
    select: (customerTypes) => {
      let filteredCustomerTypes = customerTypes.filter(customerType => customerType.isActive && !customerType.isDeleted);
      
      if (excludeId) {
        filteredCustomerTypes = filteredCustomerTypes.filter(customerType => customerType.id !== excludeId);
      }
      
      return filteredCustomerTypes.map(customerType => ({
        label: `${customerType.name} (${customerType.code})`,
        value: customerType.id.toString(),
        data: customerType
      }));
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}; 