import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';
import { ProductType, CreateProductTypeData, UpdateProductTypeData } from '@/types/product-type';

// API Functions
const getProductTypes = async (): Promise<ProductType[]> => {
  const { data } = await api.get('/product-types');
  return data;
};

const getActiveProductTypes = async (): Promise<ProductType[]> => {
  const { data } = await api.get('/product-types/active');
  return data;
};

const getParentProductTypes = async (): Promise<ProductType[]> => {
  const { data } = await api.get('/product-types/parent-types');
  return data;
};

const getProductTypeById = async (id: string): Promise<ProductType> => {
  const { data } = await api.get(`/product-types/${id}`);
  return data;
};

const createProductType = async (productTypeData: CreateProductTypeData): Promise<ProductType> => {
  const { data } = await api.post('/product-types', productTypeData);
  return data;
};

const updateProductType = async ({ id, data }: { id: number; data: UpdateProductTypeData }): Promise<ProductType> => {
  const { data: responseData } = await api.put(`/product-types/${id}`, data);
  return responseData;
};

const deleteProductType = async (id: number): Promise<void> => {
  await api.delete(`/product-types/${id}`);
};

// React Query Hooks
export const useProductTypes = () => {
  return useQuery<ProductType[], Error>({
    queryKey: ['product-types'],
    queryFn: getProductTypes,
  });
};

export const useActiveProductTypes = () => {
  return useQuery<ProductType[], Error>({
    queryKey: ['product-types', 'active'],
    queryFn: getActiveProductTypes,
  });
};

export const useParentProductTypes = () => {
  return useQuery<ProductType[], Error>({
    queryKey: ['product-types', 'parent-types'],
    queryFn: getParentProductTypes,
  });
};

export const useProductTypeById = (id: string) => {
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
    mutationFn: updateProductType,
    onSuccess: (data, { id }) => {
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