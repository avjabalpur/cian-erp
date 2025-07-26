import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import { ItemExportDetails, CreateItemExportDetailsData, UpdateItemExportDetailsData } from '../types/item-export-details';

// --- API Functions ---

const getItemExportDetails = async (): Promise<ItemExportDetails[]> => {
  const { data } = await api.get('/ItemExportDetails');
  return data;
};

const getItemExportDetailById = async (id: number): Promise<ItemExportDetails | null> => {
  if (!id) return null;
  const { data } = await api.get(`/ItemExportDetails/${id}`);
  return data;
};

const createItemExportDetail = async (itemExportDetailsData: CreateItemExportDetailsData): Promise<ItemExportDetails> => {
  const { data } = await api.post('/ItemExportDetails', itemExportDetailsData);
  return data;
};

const updateItemExportDetail = async ({ id, ...itemExportDetailsData }: { id: number; data: UpdateItemExportDetailsData }): Promise<ItemExportDetails> => {
  const { data } = await api.put(`/ItemExportDetails/${id}`, itemExportDetailsData.data);
  return data;
};

const deleteItemExportDetail = async (id: number): Promise<void> => {
  await api.delete(`/ItemExportDetails/${id}`);
};


// --- Custom Hooks ---

export const useItemExportDetails = () => {
  return useQuery<ItemExportDetails[], Error>({
    queryKey: ['itemExportDetails'],
    queryFn: getItemExportDetails,
  });
};

export const useItemExportDetailById = (id: number) => {
  return useQuery<ItemExportDetails | null, Error>({
    queryKey: ['itemExportDetail', id],
    queryFn: () => getItemExportDetailById(id),
    enabled: !!id,
  });
};

export const useCreateItemExportDetail = () => {
  const queryClient = useQueryClient();
  return useMutation<ItemExportDetails, Error, CreateItemExportDetailsData>({
    mutationFn: createItemExportDetail,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['itemExportDetails'] });
    },
  });
};

export const useUpdateItemExportDetail = () => {
  const queryClient = useQueryClient();
  return useMutation<ItemExportDetails, Error, { id: number; data: UpdateItemExportDetailsData }>({ 
    mutationFn: updateItemExportDetail,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['itemExportDetails'] });
      queryClient.invalidateQueries({ queryKey: ['itemExportDetail', variables.id] });
    },
  });
};

export const useDeleteItemExportDetail = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: deleteItemExportDetail,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['itemExportDetails'] });
    },
  });
};
