import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';
import { ProductGroup, CreateProductGroupData, UpdateProductGroupData, ProductGroupFilter } from '../../types/product-group';

// API Functions
const getProductGroups = async (filter?: ProductGroupFilter): Promise<ProductGroup[]> => {
  const params = new URLSearchParams();
  if (filter?.search) params.append('search', filter.search);
  if (filter?.level) params.append('level', filter.level);
  if (filter?.isActive !== undefined) params.append('isActive', filter.isActive.toString());
  if (filter?.page) params.append('page', filter.page.toString());
  if (filter?.pageSize) params.append('pageSize', filter.pageSize.toString());

  const { data } = await api.get(`/product-groups?${params.toString()}`);
  return data;
};

const getProductGroupById = async (id: number): Promise<ProductGroup> => {
  const { data } = await api.get(`/product-groups/${id}`);
  return data;
};

const getProductGroupByCode = async (code: string): Promise<ProductGroup> => {
  const { data } = await api.get(`/product-groups/code/${code}`);
  return data;
};

const createProductGroup = async (productGroupData: CreateProductGroupData): Promise<ProductGroup> => {
  const { data } = await api.post('/product-groups', productGroupData);
  return data;
};

const updateProductGroup = async ({ id, data }: { id: number; data: UpdateProductGroupData }): Promise<ProductGroup> => {
  const { data: responseData } = await api.put(`/product-groups/${id}`, data);
  return responseData;
};

const deleteProductGroup = async (id: number): Promise<void> => {
  await api.delete(`/product-groups/${id}`);
};

// React Query Hooks
export const useProductGroups = (filter?: ProductGroupFilter) => {
  return useQuery<ProductGroup[], Error>({
    queryKey: ['product-groups', filter],
    queryFn: () => getProductGroups(filter),
  });
};

export const useProductGroupById = (id: number) => {
  return useQuery<ProductGroup, Error>({
    queryKey: ['product-group', id],
    queryFn: () => getProductGroupById(id),
    enabled: !!id,
  });
};

export const useProductGroupByCode = (code: string) => {
  return useQuery<ProductGroup, Error>({
    queryKey: ['product-group-by-code', code],
    queryFn: () => getProductGroupByCode(code),
    enabled: !!code,
  });
};

export const useCreateProductGroup = () => {
  const queryClient = useQueryClient();
  return useMutation<ProductGroup, Error, CreateProductGroupData>({
    mutationFn: createProductGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-groups'] });
    },
  });
};

export const useUpdateProductGroup = () => {
  const queryClient = useQueryClient();
  return useMutation<ProductGroup, Error, { id: number; data: UpdateProductGroupData }>({
    mutationFn: updateProductGroup,
    onSuccess: (data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['product-groups'] });
      queryClient.invalidateQueries({ queryKey: ['product-group', id] });
    },
  });
};

export const useDeleteProductGroup = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: deleteProductGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-groups'] });
    },
  });
}; 