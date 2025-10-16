import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import {
  Customer,
  CreateCustomerData,
  UpdateCustomerData,
  CustomerFilter,
} from '../types';
import { PaginatedResponse } from '@/types/common';

// --- API Functions ---
const getCustomers = async (filter?: CustomerFilter): Promise<PaginatedResponse<Customer>> => {
  const params = new URLSearchParams();
  if (filter?.search) params.append('search', filter.search);
  if (filter?.customerCode) params.append('customerCode', filter.customerCode);
  if (filter?.customerName) params.append('customerName', filter.customerName);
  if (filter?.customerTypeCode) params.append('customerTypeCode', filter.customerTypeCode);
  if (filter?.gstin) params.append('gstin', filter.gstin);
  if (filter?.isActive !== undefined) params.append('isActive', filter.isActive.toString());
  if (filter?.isExportCustomer !== undefined) params.append('isExportCustomer', filter.isExportCustomer.toString());
  if (filter?.sortBy) params.append('sortBy', filter.sortBy);
  if (filter?.sortDescending !== undefined) params.append('sortDescending', filter.sortDescending.toString());
  if (filter?.pageNumber) params.append('pageNumber', filter.pageNumber.toString());
  if (filter?.pageSize) params.append('pageSize', filter.pageSize.toString());

  const { data } = await api.get(`/customers?${params.toString()}`);
  return data;
};

const getCustomerById = async (id: number): Promise<Customer> => {
  const { data } = await api.get(`/customers/${id}`);
  return data;
};

const getCustomerByCode = async (customerCode: string): Promise<Customer> => {
  const { data } = await api.get(`/customers/code/${customerCode}`);
  return data;
};

const createCustomer = async (customerData: CreateCustomerData): Promise<Customer> => {
  const { data } = await api.post('/customers', customerData);
  return data;
};

const updateCustomer = async (id: number, customerData: UpdateCustomerData): Promise<Customer> => {
  const { data } = await api.put(`/customers/${id}`, customerData);
  return data;
};

const deleteCustomer = async (id: number): Promise<void> => {
  await api.delete(`/customers/${id}`);
};

// --- React Query Hooks ---
export const useCustomers = (filter?: CustomerFilter) => {
  return useQuery<PaginatedResponse<Customer>, Error>({
    queryKey: ['customers', filter],
    queryFn: () => getCustomers(filter),
  });
};

export const useCustomerById = (id: number) => {
  return useQuery<Customer, Error>({
    queryKey: ['customer', id],
    queryFn: () => getCustomerById(id),
    enabled: !!id,
  });
};

export const useCustomerByCode = (customerCode: string) => {
  return useQuery<Customer, Error>({
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
  return useMutation<Customer, Error, { id: number; data: UpdateCustomerData }>({
    mutationFn: ({ id, data }) => updateCustomer(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['customer', id] });
    },
  });
};

export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: deleteCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
};

