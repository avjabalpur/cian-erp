import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { ProductType, CreateProductTypeData, UpdateProductTypeData } from '../types';
import { PaginatedResponse } from '@/types/common';

// --- Filter Type ---
export interface ProductTypeFilter {
  search?: string;
  isActive?: boolean;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: string;
}

// --- API Functions ---
const getProductTypes = async (filter?: ProductTypeFilter): Promise<PaginatedResponse<ProductType>> => {
  const params = new URLSearchParams();
  if (filter?.search) params.append('search', filter.search);
  if (filter?.isActive !== undefined) params.append('isActive', filter.isActive.toString());
  if (filter?.pageNumber) params.append('pageNumber', filter.pageNumber.toString());
  if (filter?.pageSize) params.append('pageSize', filter.pageSize.toString());
  if (filter?.sortBy) params.append('sortBy', filter.sortBy);
  if (filter?.sortOrder) params.append('sortOrder', filter.sortOrder);

  const { data } = await api.get(`/product-types?${params.toString()}`);
  return data;
};

const getProductTypeById = async (id: number): Promise<ProductType> => {
  const { data } = await api.get(`/product-types/${id}`);
  return data;
};

const createProductType = async (productTypeData: CreateProductTypeData): Promise<ProductType> => {
  const { data } = await api.post('/product-types', productTypeData);
  return data;
};

const updateProductType = async (id: number, productTypeData: UpdateProductTypeData): Promise<ProductType> => {
  const { data } = await api.put(`/product-types/${id}`, productTypeData);
  return data;
};

const deleteProductType = async (id: number): Promise<void> => {
  await api.delete(`/product-types/${id}`);
};

// --- React Query Hooks ---
export const useProductTypes = (filter?: ProductTypeFilter) => {
  return useQuery<PaginatedResponse<ProductType>, Error>({
    queryKey: ['product-types', filter],
    queryFn: () => getProductTypes(filter),
  });
};

export const useProductTypeById = (id: number) => {
  return useQuery<ProductType, Error>({
    queryKey: ['product-type', id],
    queryFn: () => getProductTypeById(id),
    enabled: !!id,
  });
};

export const useCreateProductType = () => {
  const queryClient = useQueryClient();
  return useMutation<ProductType, Error, CreateProductTypeData>({
    mutationFn: createProductType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-types'] });
    },
  });
};

export const useUpdateProductType = () => {
  const queryClient = useQueryClient();
  return useMutation<ProductType, Error, { id: number; data: UpdateProductTypeData }>({
    mutationFn: ({ id, data }) => updateProductType(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['product-types'] });
      queryClient.invalidateQueries({ queryKey: ['product-type', id] });
    },
  });
};

export const useDeleteProductType = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: deleteProductType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-types'] });
    },
  });
};
