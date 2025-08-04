import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';
import { CreateItemOtherDetailData, ItemOtherDetail, UpdateItemOtherDetailData } from '@/types/item-master';

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
    mutationFn: async ({ itemId, data }) => {
      try {
        return await createItemOtherDetail(itemId, data);
      } catch (error: any) {
        console.error('CreateItemOtherDetail error:', error);
        throw new Error(error?.response?.data?.message || error?.message || 'Failed to create item other detail');
      }
    },
    onSuccess: (data, { itemId }) => {
      queryClient.invalidateQueries({ queryKey: ['item-other-details'] });
      queryClient.invalidateQueries({ queryKey: ['item-other-details-by-item', itemId] });
      queryClient.invalidateQueries({ queryKey: ['item-master', itemId] });
    },
    onError: (error) => {
      console.error('useCreateItemOtherDetail mutation error:', error);
    },
  });
};

export const useUpdateItemOtherDetail = () => {
  const queryClient = useQueryClient();
  return useMutation<ItemOtherDetail, Error, { itemId: number; id: number; data: UpdateItemOtherDetailData }>({
    mutationFn: async ({ itemId, id, data }) => {
      try {
        return await updateItemOtherDetail(itemId, id, data);
      } catch (error: any) {
        console.error('UpdateItemOtherDetail error:', error);
        throw new Error(error?.response?.data?.message || error?.message || 'Failed to update item other detail');
      }
    },
    onSuccess: (data, { itemId, id }) => {
      queryClient.invalidateQueries({ queryKey: ['item-other-details'] });
      queryClient.invalidateQueries({ queryKey: ['item-other-detail', itemId, id] });
      queryClient.invalidateQueries({ queryKey: ['item-other-details-by-item', itemId] });
      queryClient.invalidateQueries({ queryKey: ['item-master', itemId] });
    },
    onError: (error) => {
      console.error('useUpdateItemOtherDetail mutation error:', error);
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