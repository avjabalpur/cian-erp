import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';
import { Customer, CreateCustomerData, UpdateCustomerData, CustomerFilter } from '../../types/customer';

// --- API Functions ---

const getCustomers = async (params: CustomerFilter): Promise<{ items: Customer[]; totalCount: number }> => {
  const queryParams = new URLSearchParams();
  
  if (params.page) queryParams.append('pageNumber', params.page.toString());
  if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString());
  if (params.search) queryParams.append('search', params.search);
  if (params.customerCode) queryParams.append('customerCode', params.customerCode);
  if (params.customerName) queryParams.append('customerName', params.customerName);
  if (params.customerTypeCode) queryParams.append('customerTypeCode', params.customerTypeCode);
  if (params.gstin) queryParams.append('gstin', params.gstin);
  if (params.isActive !== undefined) queryParams.append('isActive', params.isActive.toString());
  if (params.isExportCustomer !== undefined) queryParams.append('isExportCustomer', params.isExportCustomer.toString());
  if (params.sortBy) queryParams.append('sortBy', params.sortBy);
  if (params.sortDescending !== undefined) queryParams.append('sortDescending', params.sortDescending.toString());
  
  const queryString = queryParams.toString();
  const url = queryString ? `/customers?${queryString}` : '/customers';
  
  const { data } = await api.get(url);
  return data;
};

const getCustomerById = async (id: string): Promise<Customer | null> => {
  if (!id) return null;
  const { data } = await api.get(`/customers/${id}`);
  return data;
};

const getCustomerByCode = async (customerCode: string): Promise<Customer | null> => {
  if (!customerCode) return null;
  const { data } = await api.get(`/customers/code/${customerCode}`);
  return data;
};

const createCustomer = async (customerData: CreateCustomerData): Promise<Customer> => {
  const { data } = await api.post('/customers', customerData);
  return data;
};

const updateCustomer = async ({ id, data }: { id: string; data: UpdateCustomerData }): Promise<Customer> => {
  const { data: responseData } = await api.put(`/customers/${id}`, data);
  return responseData;
};

const deleteCustomer = async (id: string): Promise<void> => {
  await api.delete(`/customers/${id}`);
};

// --- Custom Hooks ---

export const useCustomers = (params: CustomerFilter) => {
  return useQuery<{ items: Customer[]; totalCount: number }, Error>({
    queryKey: ['customers', params],
    queryFn: () => getCustomers(params),
  });
};

export const useCustomerById = (id: string) => {
  return useQuery<Customer | null, Error>({
    queryKey: ['customer', id],
    queryFn: () => getCustomerById(id),
    enabled: !!id,
  });
};

export const useCustomerByCode = (customerCode: string) => {
  return useQuery<Customer | null, Error>({
    queryKey: ['customer', 'code', customerCode],
    queryFn: () => getCustomerByCode(customerCode),
    enabled: !!customerCode,
  });
};

export const useCreateCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation<Customer, Error, CreateCustomerData>({
    mutationFn: createCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
};

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation<Customer, Error, { id: string; data: UpdateCustomerData }>({ 
    mutationFn: updateCustomer,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['customer', variables.id] });
    },
  });
};

export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: deleteCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
}; 