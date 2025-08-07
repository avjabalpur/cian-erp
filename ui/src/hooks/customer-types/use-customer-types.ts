import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';
import { CustomerType, CustomerTypeFilter, CreateCustomerTypeData, UpdateCustomerTypeData } from '../../types/customer-type';

interface CustomerTypeResponse {
  items: CustomerType[];
  totalCount: number;
}

// API functions
const getCustomerTypes = async (filter: CustomerTypeFilter): Promise<CustomerTypeResponse> => {
  const params = new URLSearchParams();
  Object.entries(filter).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, value.toString());
    }
  });
  
  const { data } = await api.get<CustomerTypeResponse>(`/customer-types?${params.toString()}`);
  return data;
};

const getCustomerTypeById = async (id: string): Promise<CustomerType> => {
  const { data } = await api.get<CustomerType>(`/customer-types/${id}`);
  return data;
};

const getCustomerTypeByCode = async (code: string): Promise<CustomerType> => {
  const { data } = await api.get<CustomerType>(`/customer-types/code/${code}`);
  return data;
};

const createCustomerType = async (customerTypeData: CreateCustomerTypeData): Promise<CustomerType> => {
  const { data } = await api.post<CustomerType>('/customer-types', customerTypeData);
  return data;
};

const updateCustomerType = async ({ id, ...customerTypeData }: { id: string } & UpdateCustomerTypeData): Promise<CustomerType> => {
  const { data } = await api.put<CustomerType>(`/customer-types/${id}`, customerTypeData);
  return data;
};

const deleteCustomerType = async (id: string): Promise<void> => {
  await api.delete(`/customer-types/${id}`);
};

// React Query hooks
export const useCustomerTypes = (filter: CustomerTypeFilter) => {
  return useQuery<CustomerTypeResponse, Error>({
    queryKey: ['customer-types', filter],
    queryFn: () => getCustomerTypes(filter),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCustomerTypeById = (id: string) => {
  return useQuery<CustomerType, Error>({
    queryKey: ['customer-type', id],
    queryFn: () => getCustomerTypeById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCustomerTypeByCode = (code: string) => {
  return useQuery<CustomerType, Error>({
    queryKey: ['customer-type', 'code', code],
    queryFn: () => getCustomerTypeByCode(code),
    enabled: !!code,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateCustomerType = () => {
  const queryClient = useQueryClient();
  
  return useMutation<CustomerType, Error, CreateCustomerTypeData>({
    mutationFn: createCustomerType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer-types'] });
    },
  });
};

export const useUpdateCustomerType = () => {
  const queryClient = useQueryClient();
  
  return useMutation<CustomerType, Error, { id: string } & UpdateCustomerTypeData>({
    mutationFn: updateCustomerType,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['customer-types'] });
      queryClient.invalidateQueries({ queryKey: ['customer-type', data.id.toString()] });
    },
  });
};

export const useDeleteCustomerType = () => {
  const queryClient = useQueryClient();
  
  return useMutation<void, Error, string>({
    mutationFn: deleteCustomerType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer-types'] });
    },
  });
}; 