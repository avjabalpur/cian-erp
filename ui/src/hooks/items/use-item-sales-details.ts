import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';

// Types
export interface ItemSalesDetail {
  id: number;
  itemId: number;
  itemName?: string;
  salesPrice: number;
  costPrice: number;
  margin: number;
  currency: string;
  effectiveDate: string;
  expiryDate?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
  createdBy?: number;
  createdByName?: string;
  updatedBy?: number;
  updatedByName?: string;
}

export interface CreateItemSalesDetailData {
  itemId: number;
  salesPrice: number;
  costPrice: number;
  margin: number;
  currency: string;
  effectiveDate: string;
  expiryDate?: string;
  isActive?: boolean;
}

export interface UpdateItemSalesDetailData {
  itemId: number;
  salesPrice: number;
  costPrice: number;
  margin: number;
  currency: string;
  effectiveDate: string;
  expiryDate?: string;
  isActive?: boolean;
}

export interface ItemSalesDetailFilter {
  search?: string;
  itemId?: string;
  currency?: string;
  isActive?: boolean;
  page?: number;
  pageSize?: number;
}

// API Functions
const getItemSalesDetails = async (filter?: ItemSalesDetailFilter): Promise<ItemSalesDetail[]> => {
  const params = new URLSearchParams();
  if (filter?.search) params.append('search', filter.search);
  if (filter?.itemId) params.append('itemId', filter.itemId);
  if (filter?.currency) params.append('currency', filter.currency);
  if (filter?.isActive !== undefined) params.append('isActive', filter.isActive.toString());
  if (filter?.page) params.append('page', filter.page.toString());
  if (filter?.pageSize) params.append('pageSize', filter.pageSize.toString());

  const { data } = await api.get(`/item-sales-details?${params.toString()}`);
  return data;
};

const getItemSalesDetailById = async (id: number): Promise<ItemSalesDetail> => {
  const { data } = await api.get(`/item-sales-details/${id}`);
  return data;
};

const getItemSalesDetailsByItemId = async (itemId: number): Promise<ItemSalesDetail[]> => {
  const { data } = await api.get(`/item-sales-details/item/${itemId}`);
  return data;
};

const createItemSalesDetail = async (detailData: CreateItemSalesDetailData): Promise<ItemSalesDetail> => {
  const { data } = await api.post('/item-sales-details', detailData);
  return data;
};

const updateItemSalesDetail = async (id: number, detailData: UpdateItemSalesDetailData): Promise<ItemSalesDetail> => {
  const { data } = await api.put(`/item-sales-details/${id}`, detailData);
  return data;
};

const deleteItemSalesDetail = async (id: number): Promise<void> => {
  await api.delete(`/item-sales-details/${id}`);
};

// React Query Hooks
export const useItemSalesDetails = (filter?: ItemSalesDetailFilter) => {
  return useQuery<ItemSalesDetail[], Error>({
    queryKey: ['item-sales-details', filter],
    queryFn: () => getItemSalesDetails(filter),
  });
};

export const useItemSalesDetailById = (id: number) => {
  return useQuery<ItemSalesDetail, Error>({
    queryKey: ['item-sales-detail', id],
    queryFn: () => getItemSalesDetailById(id),
    enabled: !!id,
  });
};

export const useItemSalesDetailsByItemId = (itemId: number) => {
  return useQuery<ItemSalesDetail[], Error>({
    queryKey: ['item-sales-details-by-item', itemId],
    queryFn: () => getItemSalesDetailsByItemId(itemId),
    enabled: !!itemId,
  });
};

export const useCreateItemSalesDetail = () => {
  const queryClient = useQueryClient();
  return useMutation<ItemSalesDetail, Error, CreateItemSalesDetailData>({
    mutationFn: createItemSalesDetail,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['item-sales-details'] });
    },
  });
};

export const useUpdateItemSalesDetail = () => {
  const queryClient = useQueryClient();
  return useMutation<ItemSalesDetail, Error, { id: number; data: UpdateItemSalesDetailData }>({
    mutationFn: ({ id, data }) => updateItemSalesDetail(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['item-sales-details'] });
      queryClient.invalidateQueries({ queryKey: ['item-sales-detail', id] });
    },
  });
};

export const useDeleteItemSalesDetail = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: deleteItemSalesDetail,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['item-sales-details'] });
    },
  });
}; 