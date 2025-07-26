import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import { ItemSalesDetail, CreateItemSalesDetailData, UpdateItemSalesDetailData } from '../types/item-sales-detail';

// --- API Functions ---

const getItemSalesDetails = async (): Promise<ItemSalesDetail[]> => {
  const { data } = await api.get('/ItemSalesDetail');
  return data;
};

const getItemSalesDetailById = async (id: number): Promise<ItemSalesDetail | null> => {
  if (!id) return null;
  const { data } = await api.get(`/ItemSalesDetail/${id}`);
  return data;
};

const createItemSalesDetail = async (itemSalesDetailData: CreateItemSalesDetailData): Promise<ItemSalesDetail> => {
  const { data } = await api.post('/ItemSalesDetail', itemSalesDetailData);
  return data;
};

const updateItemSalesDetail = async ({ id, ...itemSalesDetailData }: { id: number; data: UpdateItemSalesDetailData }): Promise<ItemSalesDetail> => {
  const { data } = await api.put(`/ItemSalesDetail/${id}`, itemSalesDetailData.data);
  return data;
};

const deleteItemSalesDetail = async (id: number): Promise<void> => {
  await api.delete(`/ItemSalesDetail/${id}`);
};


// --- Custom Hooks ---

export const useItemSalesDetails = () => {
  return useQuery<ItemSalesDetail[], Error>({
    queryKey: ['itemSalesDetails'],
    queryFn: getItemSalesDetails,
  });
};

export const useItemSalesDetailById = (id: number) => {
  return useQuery<ItemSalesDetail | null, Error>({
    queryKey: ['itemSalesDetail', id],
    queryFn: () => getItemSalesDetailById(id),
    enabled: !!id,
  });
};

export const useCreateItemSalesDetail = () => {
  const queryClient = useQueryClient();
  return useMutation<ItemSalesDetail, Error, CreateItemSalesDetailData>({
    mutationFn: createItemSalesDetail,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['itemSalesDetails'] });
    },
  });
};

export const useUpdateItemSalesDetail = () => {
  const queryClient = useQueryClient();
  return useMutation<ItemSalesDetail, Error, { id: number; data: UpdateItemSalesDetailData }>({ 
    mutationFn: updateItemSalesDetail,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['itemSalesDetails'] });
      queryClient.invalidateQueries({ queryKey: ['itemSalesDetail', variables.id] });
    },
  });
};

export const useDeleteItemSalesDetail = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: deleteItemSalesDetail,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['itemSalesDetails'] });
    },
  });
};
