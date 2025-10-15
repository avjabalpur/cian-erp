import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';
import { ItemSalesDetail, CreateItemSalesDetailData, UpdateItemSalesDetailData } from '../../types/item-sales-detail';

export interface ItemSalesDetailFilter {
  search?: string;
  itemId?: string;
  isActive?: boolean;
  page?: number;
  pageSize?: number;
}

// API Functions
const getItemSalesDetails = async (filter?: ItemSalesDetailFilter): Promise<ItemSalesDetail[]> => {
  const params = new URLSearchParams();
  if (filter?.search) params.append('search', filter.search);
  if (filter?.itemId) params.append('itemId', filter.itemId);
  if (filter?.isActive !== undefined) params.append('isActive', filter.isActive.toString());
  if (filter?.page) params.append('page', filter.page.toString());
  if (filter?.pageSize) params.append('pageSize', filter.pageSize.toString());

  const { data } = await api.get(`/items/sales-details?${params.toString()}`);
  return data;
};

const getItemSalesDetailById = async (itemId: number, id: number): Promise<ItemSalesDetail> => {
  const { data } = await api.get(`/items/${itemId}/sales-details/${id}`);
  return data;
};

const getItemSalesDetailsByItemId = async (itemId: number): Promise<ItemSalesDetail[]> => {
  const { data } = await api.get(`/items/${itemId}/sales-details`);
  return data;
};

const createItemSalesDetail = async (itemId: number, detailData: CreateItemSalesDetailData): Promise<ItemSalesDetail> => {
  const { data } = await api.post(`/items/${itemId}/sales-details`, detailData);
  return data;
};

const updateItemSalesDetail = async (itemId: number, id: number, detailData: UpdateItemSalesDetailData): Promise<ItemSalesDetail> => {
  const { data } = await api.put(`/items/${itemId}/sales-details/${id}`, detailData);
  return data;
};

const deleteItemSalesDetail = async (itemId: number, id: number): Promise<void> => {
  await api.delete(`/items/${itemId}/sales-details/${id}`);
};

// React Query Hooks
export const useItemSalesDetails = (filter?: ItemSalesDetailFilter) => {
  return useQuery<ItemSalesDetail[], Error>({
    queryKey: ['item-sales-details', filter],
    queryFn: () => getItemSalesDetails(filter),
  });
};

export const useItemSalesDetailById = (itemId: number, id: number) => {
  return useQuery<ItemSalesDetail, Error>({
    queryKey: ['item-sales-detail', itemId, id],
    queryFn: () => getItemSalesDetailById(itemId, id),
    enabled: !!itemId && !!id,
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
  return useMutation<ItemSalesDetail, Error, { itemId: number; data: CreateItemSalesDetailData }>({
    mutationFn: ({ itemId, data }) => createItemSalesDetail(itemId, data),
    onSuccess: (data, { itemId }) => {
      queryClient.invalidateQueries({ queryKey: ['item-sales-details'] });
      queryClient.invalidateQueries({ queryKey: ['item-sales-details-by-item', itemId] });
      queryClient.invalidateQueries({ queryKey: ['item-master', itemId] });
    },
  });
};

export const useUpdateItemSalesDetail = () => {
  const queryClient = useQueryClient();
  return useMutation<ItemSalesDetail, Error, { itemId: number; id: number; data: UpdateItemSalesDetailData }>({
    mutationFn: ({ itemId, id, data }) => updateItemSalesDetail(itemId, id, data),
    onSuccess: (data, { itemId, id }) => {
      queryClient.invalidateQueries({ queryKey: ['item-sales-details'] });
      queryClient.invalidateQueries({ queryKey: ['item-sales-detail', itemId, id] });
      queryClient.invalidateQueries({ queryKey: ['item-sales-details-by-item', itemId] });
      queryClient.invalidateQueries({ queryKey: ['item-master', itemId] });
    },
  });
};

export const useDeleteItemSalesDetail = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { itemId: number; id: number }>({
    mutationFn: ({ itemId, id }) => deleteItemSalesDetail(itemId, id),
    onSuccess: (_, { itemId }) => {
      queryClient.invalidateQueries({ queryKey: ['item-sales-details'] });
      queryClient.invalidateQueries({ queryKey: ['item-sales-details-by-item', itemId] });
      queryClient.invalidateQueries({ queryKey: ['item-master', itemId] });
    },
  });
}; 