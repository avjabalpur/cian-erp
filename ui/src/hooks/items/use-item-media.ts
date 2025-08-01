import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';

// Types
export interface ItemMedia {
  id: number;
  itemId: number;
  itemName?: string;
  fileName: string;
  filePath: string;
  fileSize?: number;
  mediaType: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
  createdBy?: number;
  createdByName?: string;
  updatedBy?: number;
  updatedByName?: string;
}

export interface CreateItemMediaData {
  itemId: number;
  fileName: string;
  filePath: string;
  fileSize?: number;
  mediaType: string;
  description?: string;
  isActive?: boolean;
}

export interface UpdateItemMediaData {
  itemId: number;
  fileName: string;
  filePath: string;
  fileSize?: number;
  mediaType: string;
  description?: string;
  isActive?: boolean;
}

export interface ItemMediaFilter {
  search?: string;
  itemId?: string;
  mediaType?: string;
  isActive?: boolean;
  page?: number;
  pageSize?: number;
}

// API Functions
const getItemMedia = async (filter?: ItemMediaFilter): Promise<ItemMedia[]> => {
  const params = new URLSearchParams();
  if (filter?.search) params.append('search', filter.search);
  if (filter?.itemId) params.append('itemId', filter.itemId);
  if (filter?.mediaType) params.append('mediaType', filter.mediaType);
  if (filter?.isActive !== undefined) params.append('isActive', filter.isActive.toString());
  if (filter?.page) params.append('page', filter.page.toString());
  if (filter?.pageSize) params.append('pageSize', filter.pageSize.toString());

  const { data } = await api.get(`/items/media?${params.toString()}`);
  return data;
};

const getItemMediaById = async (itemId: number, id: number): Promise<ItemMedia> => {
  const { data } = await api.get(`/items/${itemId}/media/${id}`);
  return data;
};

const getItemMediaByItemId = async (itemId: number): Promise<ItemMedia[]> => {
  const { data } = await api.get(`/items/${itemId}/media`);
  return data;
};

const createItemMedia = async (itemId: number, mediaData: CreateItemMediaData): Promise<ItemMedia> => {
  const { data } = await api.post(`/items/${itemId}/media`, mediaData);
  return data;
};

const updateItemMedia = async (itemId: number, id: number, mediaData: UpdateItemMediaData): Promise<ItemMedia> => {
  const { data } = await api.put(`/items/${itemId}/media/${id}`, mediaData);
  return data;
};

const deleteItemMedia = async (itemId: number, id: number): Promise<void> => {
  await api.delete(`/items/${itemId}/media/${id}`);
};

// React Query Hooks
export const useItemMedia = (filter?: ItemMediaFilter) => {
  return useQuery<ItemMedia[], Error>({
    queryKey: ['item-media', filter],
    queryFn: () => getItemMedia(filter),
  });
};

export const useItemMediaById = (itemId: number, id: number) => {
  return useQuery<ItemMedia, Error>({
    queryKey: ['item-media', itemId, id],
    queryFn: () => getItemMediaById(itemId, id),
    enabled: !!itemId && !!id,
  });
};

export const useItemMediaByItemId = (itemId: number) => {
  return useQuery<ItemMedia[], Error>({
    queryKey: ['item-media-by-item', itemId],
    queryFn: () => getItemMediaByItemId(itemId),
    enabled: !!itemId,
  });
};

export const useCreateItemMedia = () => {
  const queryClient = useQueryClient();
  return useMutation<ItemMedia, Error, { itemId: number; data: CreateItemMediaData }>({
    mutationFn: ({ itemId, data }) => createItemMedia(itemId, data),
    onSuccess: (data, { itemId }) => {
      queryClient.invalidateQueries({ queryKey: ['item-media', itemId] });
      queryClient.invalidateQueries({ queryKey: ['item-master', itemId] });
    },
  });
};

export const useUpdateItemMedia = () => {
  const queryClient = useQueryClient();
  return useMutation<ItemMedia, Error, { itemId: number; id: number; data: UpdateItemMediaData }>({
    mutationFn: ({ itemId, id, data }) => updateItemMedia(itemId, id, data),
    onSuccess: (data, { itemId, id }) => {
      queryClient.invalidateQueries({ queryKey: ['item-media', itemId] });
      queryClient.invalidateQueries({ queryKey: ['item-media', itemId, id] });
      queryClient.invalidateQueries({ queryKey: ['item-master', itemId] });
    },
  });
};

export const useDeleteItemMedia = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { itemId: number; id: number }>({
    mutationFn: ({ itemId, id }) => deleteItemMedia(itemId, id),
    onSuccess: (_, { itemId }) => {
      queryClient.invalidateQueries({ queryKey: ['item-media', itemId] });
      queryClient.invalidateQueries({ queryKey: ['item-master', itemId] });
    },
  });
}; 