import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';

// Types
export interface ItemStockAnalysis {
  id: number;
  itemId: number;
  itemName?: string;
  currentStock: number;
  minimumStock: number;
  maximumStock: number;
  reorderPoint: number;
  averageConsumption: number;
  leadTime: number;
  analysisDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
  createdBy?: number;
  createdByName?: string;
  updatedBy?: number;
  updatedByName?: string;
}

export interface CreateItemStockAnalysisData {
  itemId: number;
  currentStock: number;
  minimumStock: number;
  maximumStock: number;
  reorderPoint: number;
  averageConsumption: number;
  leadTime: number;
  analysisDate: string;
  isActive?: boolean;
}

export interface UpdateItemStockAnalysisData {
  itemId: number;
  currentStock: number;
  minimumStock: number;
  maximumStock: number;
  reorderPoint: number;
  averageConsumption: number;
  leadTime: number;
  analysisDate: string;
  isActive?: boolean;
}

export interface ItemStockAnalysisFilter {
  search?: string;
  itemId?: string;
  isActive?: boolean;
  page?: number;
  pageSize?: number;
}

// API Functions
const getItemStockAnalysis = async (filter?: ItemStockAnalysisFilter): Promise<ItemStockAnalysis[]> => {
  const params = new URLSearchParams();
  if (filter?.search) params.append('search', filter.search);
  if (filter?.itemId) params.append('itemId', filter.itemId);
  if (filter?.isActive !== undefined) params.append('isActive', filter.isActive.toString());
  if (filter?.page) params.append('page', filter.page.toString());
  if (filter?.pageSize) params.append('pageSize', filter.pageSize.toString());

  const { data } = await api.get(`/items/stock-analysis?${params.toString()}`);
  return data;
};

const getItemStockAnalysisById = async (itemId: number, id: number): Promise<ItemStockAnalysis> => {
  const { data } = await api.get(`/items/${itemId}/stock-analysis/${id}`);
  return data;
};

const getItemStockAnalysisByItemId = async (itemId: number): Promise<ItemStockAnalysis[]> => {
  const { data } = await api.get(`/items/${itemId}/stock-analysis`);
  return data;
};

const createItemStockAnalysis = async (itemId: number, analysisData: CreateItemStockAnalysisData): Promise<ItemStockAnalysis> => {
  const { data } = await api.post(`/items/${itemId}/stock-analysis`, analysisData);
  return data;
};

const updateItemStockAnalysis = async (itemId: number, id: number, analysisData: UpdateItemStockAnalysisData): Promise<ItemStockAnalysis> => {
  const { data } = await api.put(`/items/${itemId}/stock-analysis/${id}`, analysisData);
  return data;
};

const deleteItemStockAnalysis = async (itemId: number, id: number): Promise<void> => {
  await api.delete(`/items/${itemId}/stock-analysis/${id}`);
};

// React Query Hooks
export const useItemStockAnalysis = (filter?: ItemStockAnalysisFilter) => {
  return useQuery<ItemStockAnalysis[], Error>({
    queryKey: ['item-stock-analysis', filter],
    queryFn: () => getItemStockAnalysis(filter),
  });
};

export const useItemStockAnalysisById = (itemId: number, id: number) => {
  return useQuery<ItemStockAnalysis, Error>({
    queryKey: ['item-stock-analysis', itemId, id],
    queryFn: () => getItemStockAnalysisById(itemId, id),
    enabled: !!itemId && !!id,
  });
};

export const useItemStockAnalysisByItemId = (itemId: number) => {
  return useQuery<ItemStockAnalysis[], Error>({
    queryKey: ['item-stock-analysis-by-item', itemId],
    queryFn: () => getItemStockAnalysisByItemId(itemId),
    enabled: !!itemId,
  });
};

export const useCreateItemStockAnalysis = () => {
  const queryClient = useQueryClient();
  return useMutation<ItemStockAnalysis, Error, { itemId: number; data: CreateItemStockAnalysisData }>({
    mutationFn: ({ itemId, data }) => createItemStockAnalysis(itemId, data),
    onSuccess: (data, { itemId }) => {
      queryClient.invalidateQueries({ queryKey: ['item-stock-analysis'] });
      queryClient.invalidateQueries({ queryKey: ['item-stock-analysis-by-item', itemId] });
      queryClient.invalidateQueries({ queryKey: ['item-master', itemId] });
    },
  });
};

export const useUpdateItemStockAnalysis = () => {
  const queryClient = useQueryClient();
  return useMutation<ItemStockAnalysis, Error, { itemId: number; id: number; data: UpdateItemStockAnalysisData }>({
    mutationFn: ({ itemId, id, data }) => updateItemStockAnalysis(itemId, id, data),
    onSuccess: (data, { itemId, id }) => {
      queryClient.invalidateQueries({ queryKey: ['item-stock-analysis'] });
      queryClient.invalidateQueries({ queryKey: ['item-stock-analysis', itemId, id] });
      queryClient.invalidateQueries({ queryKey: ['item-stock-analysis-by-item', itemId] });
      queryClient.invalidateQueries({ queryKey: ['item-master', itemId] });
    },
  });
};

export const useDeleteItemStockAnalysis = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { itemId: number; id: number }>({
    mutationFn: ({ itemId, id }) => deleteItemStockAnalysis(itemId, id),
    onSuccess: (_, { itemId }) => {
      queryClient.invalidateQueries({ queryKey: ['item-stock-analysis'] });
      queryClient.invalidateQueries({ queryKey: ['item-stock-analysis-by-item', itemId] });
      queryClient.invalidateQueries({ queryKey: ['item-master', itemId] });
    },
  });
}; 