import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';
import { ItemMaster, CreateItemMasterData, UpdateItemMasterData, ItemMasterFilter, PaginatedResponse } from '@/types/item-master';

// API Functions
const getItemMasters = async (filter?: ItemMasterFilter): Promise<PaginatedResponse<ItemMaster>> => {
  const params = new URLSearchParams();
  if (filter?.search) params.append('search', filter.search);
  if (filter?.itemCode) params.append('itemCode', filter.itemCode);
  if (filter?.itemName) params.append('itemName', filter.itemName);
  if (filter?.shortName) params.append('shortName', filter.shortName);
  if (filter?.revNo) params.append('revNo', filter.revNo);
  if (filter?.itemTypeId) params.append('itemTypeId', filter.itemTypeId.toString());
  
  if (filter?.sortBy) params.append('sortBy', filter.sortBy);
  if (filter?.sortDescending !== undefined) params.append('sortDescending', filter.sortDescending.toString());
  if (filter?.pageNumber) params.append('pageNumber', filter.pageNumber.toString());
  if (filter?.pageSize) params.append('pageSize', filter.pageSize.toString());

  const { data } = await api.get(`/items?${params.toString()}`);
  return data;
};

const getItemMasterById = async (id: number): Promise<ItemMaster> => {
  const { data } = await api.get(`/items/${id}`);
  return data;
};

const getItemMasterByCode = async (itemCode: string): Promise<ItemMaster> => {
  const { data } = await api.get(`/items/code/${itemCode}`);
  return data;
};

const createItemMaster = async (itemMasterData: CreateItemMasterData): Promise<ItemMaster> => {
  const { data } = await api.post('/items', itemMasterData);
  return data;
};

const updateItemMaster = async (id: number, itemMasterData: UpdateItemMasterData): Promise<ItemMaster> => {
  const { data } = await api.put(`/items/${id}`, itemMasterData);
  return data;
};

const deleteItemMaster = async (id: number): Promise<void> => {
  await api.delete(`/items/${id}`);
};

// React Query Hooks
export const useItemMasters = (filter?: ItemMasterFilter) => {
  return useQuery<PaginatedResponse<ItemMaster>, Error>({
    queryKey: ['item-masters', filter],
    queryFn: () => getItemMasters(filter),
  });
};

export const useItemMasterById = (id: number) => {
  return useQuery<ItemMaster, Error>({
    queryKey: ['item-master', id],
    queryFn: () => getItemMasterById(id),
    enabled: !!id,
  });
};

export const useItemMasterByCode = (itemCode: string) => {
  return useQuery<ItemMaster, Error>({
    queryKey: ['item-master', 'code', itemCode],
    queryFn: () => getItemMasterByCode(itemCode),
    enabled: !!itemCode,
  });
};

export const useCreateItemMaster = () => {
  const queryClient = useQueryClient();
  return useMutation<ItemMaster, Error, CreateItemMasterData>({
    mutationFn: createItemMaster,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['item-masters'] });
    },
  });
};

export const useUpdateItemMaster = () => {
  const queryClient = useQueryClient();
  return useMutation<ItemMaster, Error, { id: number; data: UpdateItemMasterData }>({
    mutationFn: ({ id, data }) => updateItemMaster(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['item-masters'] });
      queryClient.invalidateQueries({ queryKey: ['item-master', id] });
    },
  });
};

export const useDeleteItemMaster = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: deleteItemMaster,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['item-masters'] });
    },
  });
}; 