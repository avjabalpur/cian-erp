import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';

// Types
export interface Item {
  id: number;
  itemCode: string;
  itemName: string;
  shortName?: string;
  itemType?: string;
  description?: string;
  composition?: string;
  dosageName?: string;
  manufactured: boolean;
  qcRequired: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
  createdBy?: number;
  createdByName?: string;
  updatedBy?: number;
  updatedByName?: string;
}

export interface CreateItemData {
  itemCode: string;
  itemName: string;
  shortName?: string;
  itemType?: string;
  description?: string;
  composition?: string;
  dosageName?: string;
  manufactured?: boolean;
  qcRequired?: boolean;
  isActive?: boolean;
}

export interface UpdateItemData {
  itemCode: string;
  itemName: string;
  shortName?: string;
  itemType?: string;
  description?: string;
  composition?: string;
  dosageName?: string;
  manufactured?: boolean;
  qcRequired?: boolean;
  isActive?: boolean;
}

export interface ItemFilter {
  search?: string;
  itemType?: string;
  status?: string;
  manufactured?: string;
  qcRequired?: string;
  page?: number;
  pageSize?: number;
}

// API Functions
const getItems = async (filter?: ItemFilter): Promise<Item[]> => {
  const params = new URLSearchParams();
  if (filter?.search) params.append('search', filter.search);
  if (filter?.itemType) params.append('itemType', filter.itemType);
  if (filter?.status) params.append('status', filter.status);
  if (filter?.manufactured) params.append('manufactured', filter.manufactured);
  if (filter?.qcRequired) params.append('qcRequired', filter.qcRequired);
  if (filter?.page) params.append('page', filter.page.toString());
  if (filter?.pageSize) params.append('pageSize', filter.pageSize.toString());

  const { data } = await api.get(`/items?${params.toString()}`);
  return data;
};

const getItemById = async (id: number): Promise<Item> => {
  const { data } = await api.get(`/items/${id}`);
  return data;
};

const createItem = async (itemData: CreateItemData): Promise<Item> => {
  const { data } = await api.post('/items', itemData);
  return data;
};

const updateItem = async (id: number, itemData: UpdateItemData): Promise<Item> => {
  const { data } = await api.put(`/items/${id}`, itemData);
  return data;
};

const deleteItem = async (id: number): Promise<void> => {
  await api.delete(`/items/${id}`);
};

// React Query Hooks
export const useItems = (filter?: ItemFilter) => {
  return useQuery<Item[], Error>({
    queryKey: ['items', filter],
    queryFn: () => getItems(filter),
  });
};

export const useItemById = (id: number) => {
  return useQuery<Item, Error>({
    queryKey: ['item', id],
    queryFn: () => getItemById(id),
    enabled: !!id,
  });
};

export const useCreateItem = () => {
  const queryClient = useQueryClient();
  return useMutation<Item, Error, CreateItemData>({
    mutationFn: createItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });
};

export const useUpdateItem = () => {
  const queryClient = useQueryClient();
  return useMutation<Item, Error, { id: number; data: UpdateItemData }>({
    mutationFn: ({ id, data }) => updateItem(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      queryClient.invalidateQueries({ queryKey: ['item', id] });
    },
  });
};

export const useDeleteItem = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: deleteItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });
}; 