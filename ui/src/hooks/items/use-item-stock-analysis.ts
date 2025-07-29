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

  const { data } = await api.get(`/item-stock-analysis?${params.toString()}`);
  return data;
};

const getItemStockAnalysisById = async (id: number): Promise<ItemStockAnalysis> => {
  const { data } = await api.get(`/item-stock-analysis/${id}`);
  return data;
};

const getItemStockAnalysisByItemId = async (itemId: number): Promise<ItemStockAnalysis[]> => {
  const { data } = await api.get(`/item-stock-analysis/item/${itemId}`);
  return data;
};

const createItemStockAnalysis = async (analysisData: CreateItemStockAnalysisData): Promise<ItemStockAnalysis> => {
  const { data } = await api.post('/item-stock-analysis', analysisData);
  return data;
};

const updateItemStockAnalysis = async (id: number, analysisData: UpdateItemStockAnalysisData): Promise<ItemStockAnalysis> => {
  const { data } = await api.put(`/item-stock-analysis/${id}`, analysisData);
  return data;
};

const deleteItemStockAnalysis = async (id: number): Promise<void> => {
  await api.delete(`/item-stock-analysis/${id}`);
};

// React Query Hooks
export const useItemStockAnalysis = (filter?: ItemStockAnalysisFilter) => {
  return useQuery<ItemStockAnalysis[], Error>({
    queryKey: ['item-stock-analysis', filter],
    queryFn: () => getItemStockAnalysis(filter),
  });
};

export const useItemStockAnalysisById = (id: number) => {
  return useQuery<ItemStockAnalysis, Error>({
    queryKey: ['item-stock-analysis', id],
    queryFn: () => getItemStockAnalysisById(id),
    enabled: !!id,
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
  return useMutation<ItemStockAnalysis, Error, CreateItemStockAnalysisData>({
    mutationFn: createItemStockAnalysis,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['item-stock-analysis'] });
    },
  });
};

export const useUpdateItemStockAnalysis = () => {
  const queryClient = useQueryClient();
  return useMutation<ItemStockAnalysis, Error, { id: number; data: UpdateItemStockAnalysisData }>({
    mutationFn: ({ id, data }) => updateItemStockAnalysis(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['item-stock-analysis'] });
      queryClient.invalidateQueries({ queryKey: ['item-stock-analysis', id] });
    },
  });
};

export const useDeleteItemStockAnalysis = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: deleteItemStockAnalysis,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['item-stock-analysis'] });
    },
  });
}; 