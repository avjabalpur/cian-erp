import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';
import { ItemType, CreateItemTypeData, UpdateItemTypeData, ItemTypeFilter } from '@/types/item';

// New paginated response structure
export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

// API Functions
const getItemTypes = async (filter?: ItemTypeFilter): Promise<PaginatedResponse<ItemType>> => {
  const params = new URLSearchParams();
  if (filter?.searchTerm) params.append('searchTerm', filter.searchTerm);
  if (filter?.isActive !== undefined) params.append('isActive', filter.isActive.toString());
  if (filter?.pageNumber) params.append('pageNumber', filter.pageNumber.toString());
  if (filter?.pageSize) params.append('pageSize', filter.pageSize.toString());

  const { data } = await api.get(`/item-types?${params.toString()}`);
  return data;
};

const getItemTypeById = async (id: number): Promise<ItemType> => {
  const { data } = await api.get(`/item-types/${id}`);
  return data;
};

const getParentTypes = async (): Promise<ItemType[]> => {
  const { data } = await api.get('/item-types/parent-types');
  return data;
};

const createItemType = async (itemTypeData: CreateItemTypeData): Promise<ItemType> => {
  const { data } = await api.post('/item-types', itemTypeData);
  return data;
};

const updateItemType = async (id: number, itemTypeData: UpdateItemTypeData): Promise<ItemType> => {
  const { data } = await api.put(`/item-types/${id}`, itemTypeData);
  return data;
};

const deleteItemType = async (id: number): Promise<void> => {
  await api.delete(`/item-types/${id}`);
};

// React Query Hooks
export const useItemTypes = (filter?: ItemTypeFilter) => {
  return useQuery<PaginatedResponse<ItemType>, Error>({
    queryKey: ['item-types', filter],
    queryFn: () => getItemTypes(filter),
  });
};

export const useItemTypeById = (id: number) => {
  return useQuery<ItemType, Error>({
    queryKey: ['item-type', id],
    queryFn: () => getItemTypeById(id),
    enabled: !!id,
  });
};

export const useParentTypes = () => {
  return useQuery<ItemType[], Error>({
    queryKey: ['parent-types'],
    queryFn: getParentTypes,
  });
};

export const useCreateItemType = () => {
  const queryClient = useQueryClient();
  return useMutation<ItemType, Error, CreateItemTypeData>({
    mutationFn: createItemType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['item-types'] });
    },
  });
};

export const useUpdateItemType = () => {
  const queryClient = useQueryClient();
  return useMutation<ItemType, Error, { id: number; data: UpdateItemTypeData }>({
    mutationFn: ({ id, data }) => updateItemType(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['item-types'] });
      queryClient.invalidateQueries({ queryKey: ['item-type', id] });
    },
  });
};

export const useDeleteItemType = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: deleteItemType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['item-types'] });
    },
  });
}; 