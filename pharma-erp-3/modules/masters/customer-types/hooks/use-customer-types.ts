import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import {
  CustomerType,
  CreateCustomerTypeData,
  UpdateCustomerTypeData,
  CustomerTypeFilter,
} from '../types';
import { PaginatedResponse } from '@/types/common';

// --- API Functions ---
const getCustomerTypes = async (filter?: CustomerTypeFilter): Promise<PaginatedResponse<CustomerType>> => {
  const params = new URLSearchParams();
  if (filter?.search) params.append('search', filter.search);
  if (filter?.code) params.append('code', filter.code);
  if (filter?.name) params.append('name', filter.name);
  if (filter?.isExportType !== undefined) params.append('isExportType', filter.isExportType.toString());
  if (filter?.isDomesticType !== undefined) params.append('isDomesticType', filter.isDomesticType.toString());
  if (filter?.requiresDrugLicense !== undefined) params.append('requiresDrugLicense', filter.requiresDrugLicense.toString());
  if (filter?.creditTermsApplicable !== undefined) params.append('creditTermsApplicable', filter.creditTermsApplicable.toString());
  if (filter?.isActive !== undefined) params.append('isActive', filter.isActive.toString());
  if (filter?.sortBy) params.append('sortBy', filter.sortBy);
  if (filter?.sortDescending !== undefined) params.append('sortDescending', filter.sortDescending.toString());
  if (filter?.pageNumber) params.append('pageNumber', filter.pageNumber.toString());
  if (filter?.pageSize) params.append('pageSize', filter.pageSize.toString());

  const { data } = await api.get(`/customer-types?${params.toString()}`);
  return data;
};

const getCustomerTypeById = async (id: number): Promise<CustomerType> => {
  const { data } = await api.get(`/customer-types/${id}`);
  return data;
};

const getCustomerTypeByCode = async (code: string): Promise<CustomerType> => {
  const { data } = await api.get(`/customer-types/code/${code}`);
  return data;
};

const createCustomerType = async (customerTypeData: CreateCustomerTypeData): Promise<CustomerType> => {
  const { data } = await api.post('/customer-types', customerTypeData);
  return data;
};

const updateCustomerType = async (id: number, customerTypeData: UpdateCustomerTypeData): Promise<CustomerType> => {
  const { data } = await api.put(`/customer-types/${id}`, customerTypeData);
  return data;
};

const deleteCustomerType = async (id: number): Promise<void> => {
  await api.delete(`/customer-types/${id}`);
};

// --- React Query Hooks ---
export const useCustomerTypes = (filter?: CustomerTypeFilter) => {
  return useQuery<PaginatedResponse<CustomerType>, Error>({
    queryKey: ['customer-types', filter],
    queryFn: () => getCustomerTypes(filter),
  });
};

export const useCustomerTypeById = (id: number) => {
  return useQuery<CustomerType, Error>({
    queryKey: ['customer-type', id],
    queryFn: () => getCustomerTypeById(id),
    enabled: !!id,
  });
};

export const useCustomerTypeByCode = (code: string) => {
  return useQuery<CustomerType, Error>({
    queryKey: ['customer-type', 'code', code],
    queryFn: () => getCustomerTypeByCode(code),
    enabled: !!code,
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
  return useMutation<CustomerType, Error, { id: number; data: UpdateCustomerTypeData }>({
    mutationFn: ({ id, data }) => updateCustomerType(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['customer-types'] });
      queryClient.invalidateQueries({ queryKey: ['customer-type', id] });
    },
  });
};

export const useDeleteCustomerType = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: deleteCustomerType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer-types'] });
    },
  });
};

