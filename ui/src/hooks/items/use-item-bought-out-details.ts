import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { ItemBoughtOutDetails } from '@/types/item-master';

// Types
export interface CreateItemBoughtOutDetailsData {
  itemId: number;
  purchaseBasedOn?: string;
  excessPlanningPercent?: number;
  reorderLevel?: number;
  minStockLevel?: number;
  maxStockLevel?: number;
  minBalanceShelfLifeDays?: number;
  customDutyPercent?: number;
  igstPercent?: number;
  swsPercent?: number;
  maxPurchaseRate?: number;
  stopProcurement: boolean;
}

export interface UpdateItemBoughtOutDetailsData extends CreateItemBoughtOutDetailsData {
  id: number;
}

// API functions
const getItemBoughtOutDetails = async (itemId: number): Promise<ItemBoughtOutDetails | null> => {
  if (!itemId) return null;
  const { data } = await api.get(`/items/${itemId}/bought-out-details`);
  return data;
};

const getItemBoughtOutDetailsById = async (itemId: number, id: number): Promise<ItemBoughtOutDetails | null> => {
  if (!itemId || !id) return null;
  const { data } = await api.get(`/items/${itemId}/bought-out-details/${id}`);
  return data;
};

const createItemBoughtOutDetails = async (itemId: number, data: CreateItemBoughtOutDetailsData): Promise<ItemBoughtOutDetails> => {
  const { data: response } = await api.post(`/items/${itemId}/bought-out-details`, data);
  return response;
};

const updateItemBoughtOutDetails = async (itemId: number, id: number, data: UpdateItemBoughtOutDetailsData): Promise<ItemBoughtOutDetails> => {
  const { data: response } = await api.put(`/items/${itemId}/bought-out-details/${id}`, data);
  return response;
};

const deleteItemBoughtOutDetails = async (itemId: number, id: number): Promise<void> => {
  await api.delete(`/items/${itemId}/bought-out-details/${id}`);
};

// Hooks
export const useItemBoughtOutDetails = (itemId: number) => {
  return useQuery<ItemBoughtOutDetails | null, Error>({
    queryKey: ['item-bought-out-details', itemId],
    queryFn: () => getItemBoughtOutDetails(itemId),
    enabled: !!itemId,
  });
};

export const useItemBoughtOutDetailsById = (itemId: number, id: number) => {
  return useQuery<ItemBoughtOutDetails | null, Error>({
    queryKey: ['item-bought-out-details', itemId, id],
    queryFn: () => getItemBoughtOutDetailsById(itemId, id),
    enabled: !!itemId && !!id,
  });
};

export const useCreateItemBoughtOutDetails = () => {
  const queryClient = useQueryClient();

  return useMutation<ItemBoughtOutDetails, Error, { itemId: number; data: CreateItemBoughtOutDetailsData }>({
    mutationFn: ({ itemId, data }) => createItemBoughtOutDetails(itemId, data),
    onSuccess: (data, { itemId }) => {
      // Invalidate and refetch item bought out details
      queryClient.invalidateQueries({ queryKey: ['item-bought-out-details', itemId] });
      queryClient.invalidateQueries({ queryKey: ['item-master', itemId] });
    },
  });
};

export const useUpdateItemBoughtOutDetails = () => {
  const queryClient = useQueryClient();

  return useMutation<ItemBoughtOutDetails, Error, { itemId: number; id: number; data: UpdateItemBoughtOutDetailsData }>({
    mutationFn: ({ itemId, id, data }) => updateItemBoughtOutDetails(itemId, id, data),
    onSuccess: (data, { itemId, id }) => {
      // Invalidate and refetch item bought out details
      queryClient.invalidateQueries({ queryKey: ['item-bought-out-details', itemId] });
      queryClient.invalidateQueries({ queryKey: ['item-bought-out-details', itemId, id] });
      queryClient.invalidateQueries({ queryKey: ['item-master', itemId] });
    },
  });
};

export const useDeleteItemBoughtOutDetails = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { itemId: number; id: number }>({
    mutationFn: ({ itemId, id }) => deleteItemBoughtOutDetails(itemId, id),
    onSuccess: (_, { itemId }) => {
      // Invalidate and refetch item bought out details
      queryClient.invalidateQueries({ queryKey: ['item-bought-out-details', itemId] });
      queryClient.invalidateQueries({ queryKey: ['item-master', itemId] });
    },
  });
}; 