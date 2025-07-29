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

  const { data } = await api.get(`/item-media?${params.toString()}`);
  return data;
};

const getItemMediaById = async (id: number): Promise<ItemMedia> => {
  const { data } = await api.get(`/item-media/${id}`);
  return data;
};

const getItemMediaByItemId = async (itemId: number): Promise<ItemMedia[]> => {
  const { data } = await api.get(`/item-media/item/${itemId}`);
  return data;
};

const createItemMedia = async (mediaData: CreateItemMediaData): Promise<ItemMedia> => {
  const { data } = await api.post('/item-media', mediaData);
  return data;
};

const updateItemMedia = async (id: number, mediaData: UpdateItemMediaData): Promise<ItemMedia> => {
  const { data } = await api.put(`/item-media/${id}`, mediaData);
  return data;
};

const deleteItemMedia = async (id: number): Promise<void> => {
  await api.delete(`/item-media/${id}`);
};

// React Query Hooks
export const useItemMedia = (filter?: ItemMediaFilter) => {
  return useQuery<ItemMedia[], Error>({
    queryKey: ['item-media', filter],
    queryFn: () => getItemMedia(filter),
  });
};

export const useItemMediaById = (id: number) => {
  return useQuery<ItemMedia, Error>({
    queryKey: ['item-media', id],
    queryFn: () => getItemMediaById(id),
    enabled: !!id,
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
  return useMutation<ItemMedia, Error, CreateItemMediaData>({
    mutationFn: createItemMedia,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['item-media'] });
    },
  });
};

export const useUpdateItemMedia = () => {
  const queryClient = useQueryClient();
  return useMutation<ItemMedia, Error, { id: number; data: UpdateItemMediaData }>({
    mutationFn: ({ id, data }) => updateItemMedia(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['item-media'] });
      queryClient.invalidateQueries({ queryKey: ['item-media', id] });
    },
  });
};

export const useDeleteItemMedia = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: deleteItemMedia,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['item-media'] });
    },
  });
}; 