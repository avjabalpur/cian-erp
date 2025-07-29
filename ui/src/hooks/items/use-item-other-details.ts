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

  const { data } = await api.get(`/item-other-details?${params.toString()}`);
  return data;
};

const getItemOtherDetailById = async (id: number): Promise<ItemOtherDetail> => {
  const { data } = await api.get(`/item-other-details/${id}`);
  return data;
};

const getItemOtherDetailsByItemId = async (itemId: number): Promise<ItemOtherDetail[]> => {
  const { data } = await api.get(`/item-other-details/item/${itemId}`);
  return data;
};

const createItemOtherDetail = async (detailData: CreateItemOtherDetailData): Promise<ItemOtherDetail> => {
  const { data } = await api.post('/item-other-details', detailData);
  return data;
};

const updateItemOtherDetail = async (id: number, detailData: UpdateItemOtherDetailData): Promise<ItemOtherDetail> => {
  const { data } = await api.put(`/item-other-details/${id}`, detailData);
  return data;
};

const deleteItemOtherDetail = async (id: number): Promise<void> => {
  await api.delete(`/item-other-details/${id}`);
};

// React Query Hooks
export const useItemOtherDetails = (filter?: ItemOtherDetailFilter) => {
  return useQuery<ItemOtherDetail[], Error>({
    queryKey: ['item-other-details', filter],
    queryFn: () => getItemOtherDetails(filter),
  });
};

export const useItemOtherDetailById = (id: number) => {
  return useQuery<ItemOtherDetail, Error>({
    queryKey: ['item-other-detail', id],
    queryFn: () => getItemOtherDetailById(id),
    enabled: !!id,
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
  return useMutation<ItemOtherDetail, Error, CreateItemOtherDetailData>({
    mutationFn: createItemOtherDetail,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['item-other-details'] });
    },
  });
};

export const useUpdateItemOtherDetail = () => {
  const queryClient = useQueryClient();
  return useMutation<ItemOtherDetail, Error, { id: number; data: UpdateItemOtherDetailData }>({
    mutationFn: ({ id, data }) => updateItemOtherDetail(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['item-other-details'] });
      queryClient.invalidateQueries({ queryKey: ['item-other-detail', id] });
    },
  });
};

export const useDeleteItemOtherDetail = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: deleteItemOtherDetail,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['item-other-details'] });
    },
  });
}; 