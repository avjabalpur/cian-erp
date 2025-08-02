import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';

// Types
export interface ItemOtherDetail {
  id: number;
  itemId: number;
  itemName?: string;
  detailName: string;
  detailValue?: string;
  detailType: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
  createdBy?: number;
  createdByName?: string;
  updatedBy?: number;
  updatedByName?: string;
}

export interface CreateItemOtherDetailData {
  itemId: number;
  detailName: string;
  detailValue?: string;
  detailType: string;
  description?: string;
  isActive?: boolean;
}

export interface UpdateItemOtherDetailData {
  itemId: number;
  detailName: string;
  detailValue?: string;
  detailType: string;
  description?: string;
  isActive?: boolean;
}

export interface ItemOtherDetailFilter {
  search?: string;
  itemId?: string;
  detailType?: string;
  isActive?: boolean;
  page?: number;
  pageSize?: number;
}

// API Functions
const getItemOtherDetails = async (filter?: ItemOtherDetailFilter): Promise<ItemOtherDetail[]> => {
  const params = new URLSearchParams();
  if (filter?.search) params.append('search', filter.search);
  if (filter?.itemId) params.append('itemId', filter.itemId);
  if (filter?.detailType) params.append('detailType', filter.detailType);
  if (filter?.isActive !== undefined) params.append('isActive', filter.isActive.toString());
  if (filter?.page) params.append('page', filter.page.toString());
  if (filter?.pageSize) params.append('pageSize', filter.pageSize.toString());

  const { data } = await api.get(`/items/other-details?${params.toString()}`);
  return data;
};

const getItemOtherDetailById = async (itemId: number, id: number): Promise<ItemOtherDetail> => {
  const { data } = await api.get(`/items/${itemId}/other-details/${id}`);
  return data;
};

const getItemOtherDetailsByItemId = async (itemId: number): Promise<ItemOtherDetail[]> => {
  const { data } = await api.get(`/items/${itemId}/other-details`);
  return data;
};

const createItemOtherDetail = async (itemId: number, detailData: CreateItemOtherDetailData): Promise<ItemOtherDetail> => {
  const { data } = await api.post(`/items/${itemId}/other-details`, detailData);
  return data;
};

const updateItemOtherDetail = async (itemId: number, id: number, detailData: UpdateItemOtherDetailData): Promise<ItemOtherDetail> => {
  const { data } = await api.put(`/items/${itemId}/other-details/${id}`, detailData);
  return data;
};

const deleteItemOtherDetail = async (itemId: number, id: number): Promise<void> => {
  await api.delete(`/items/${itemId}/other-details/${id}`);
};

// React Query Hooks
export const useItemOtherDetails = (filter?: ItemOtherDetailFilter) => {
  return useQuery<ItemOtherDetail[], Error>({
    queryKey: ['item-other-details', filter],
    queryFn: () => getItemOtherDetails(filter),
  });
};

export const useItemOtherDetailById = (itemId: number, id: number) => {
  return useQuery<ItemOtherDetail, Error>({
    queryKey: ['item-other-detail', itemId, id],
    queryFn: () => getItemOtherDetailById(itemId, id),
    enabled: !!itemId && !!id,
  });
};

export const useItemOtherDetailsByItemId = (itemId: number) => {
  return useQuery<ItemOtherDetail[], Error>({
    queryKey: ['item-other-details-by-item', itemId],
    queryFn: () => getItemOtherDetailsByItemId(itemId),
    enabled: !!itemId,
  });
};

export const useCreateItemOtherDetail = () => {
  const queryClient = useQueryClient();
  return useMutation<ItemOtherDetail, Error, { itemId: number; data: CreateItemOtherDetailData }>({
    mutationFn: ({ itemId, data }) => createItemOtherDetail(itemId, data),
    onSuccess: (data, { itemId }) => {
      queryClient.invalidateQueries({ queryKey: ['item-other-details'] });
      queryClient.invalidateQueries({ queryKey: ['item-other-details-by-item', itemId] });
      queryClient.invalidateQueries({ queryKey: ['item-master', itemId] });
    },
  });
};

export const useUpdateItemOtherDetail = () => {
  const queryClient = useQueryClient();
  return useMutation<ItemOtherDetail, Error, { itemId: number; id: number; data: UpdateItemOtherDetailData }>({
    mutationFn: ({ itemId, id, data }) => updateItemOtherDetail(itemId, id, data),
    onSuccess: (data, { itemId, id }) => {
      queryClient.invalidateQueries({ queryKey: ['item-other-details'] });
      queryClient.invalidateQueries({ queryKey: ['item-other-detail', itemId, id] });
      queryClient.invalidateQueries({ queryKey: ['item-other-details-by-item', itemId] });
      queryClient.invalidateQueries({ queryKey: ['item-master', itemId] });
    },
  });
};

export const useDeleteItemOtherDetail = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { itemId: number; id: number }>({
    mutationFn: ({ itemId, id }) => deleteItemOtherDetail(itemId, id),
    onSuccess: (_, { itemId }) => {
      queryClient.invalidateQueries({ queryKey: ['item-other-details'] });
      queryClient.invalidateQueries({ queryKey: ['item-other-details-by-item', itemId] });
      queryClient.invalidateQueries({ queryKey: ['item-master', itemId] });
    },
  });
}; 