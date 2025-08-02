import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';

// Types
export interface ItemExportDetails {
  id: number;
  itemId: number;
  itemDescriptionForExports?: string;
  exportProductGroupCode?: string;
  exportProductGroupName?: string;
  depbRateListSrlNo?: string;
  depbRate?: number;
  depbValueCap?: number;
  depbRemarks?: string;
  dutyDrawbackSrlNo?: string;
  dutyDrawbackRateType?: string;
  dutyDrawbackRatePercent?: number;
  dutyDrawbackRateFixed?: number;
  dutyDrawbackValueCap?: number;
  dutyDrawbackRemarks?: string;
  createdAt: string;
  updatedAt?: string;
  createdBy?: number;
  updatedBy?: number;
}

export interface CreateItemExportDetailsData {
  itemId: number;
  itemDescriptionForExports?: string;
  exportProductGroupCode?: string;
  exportProductGroupName?: string;
  depbRateListSrlNo?: string;
  depbRate?: number;
  depbValueCap?: number;
  depbRemarks?: string;
  dutyDrawbackSrlNo?: string;
  dutyDrawbackRateType?: string;
  dutyDrawbackRatePercent?: number;
  dutyDrawbackRateFixed?: number;
  dutyDrawbackValueCap?: number;
  dutyDrawbackRemarks?: string;
}

export interface UpdateItemExportDetailsData {
  itemDescriptionForExports?: string;
  exportProductGroupCode?: string;
  exportProductGroupName?: string;
  depbRateListSrlNo?: string;
  depbRate?: number;
  depbValueCap?: number;
  depbRemarks?: string;
  dutyDrawbackSrlNo?: string;
  dutyDrawbackRateType?: string;
  dutyDrawbackRatePercent?: number;
  dutyDrawbackRateFixed?: number;
  dutyDrawbackValueCap?: number;
  dutyDrawbackRemarks?: string;
}

// API Functions
const getItemExportDetails = async (itemId: number): Promise<ItemExportDetails | null> => {
  if (!itemId) return null;
  const { data } = await api.get(`/items/${itemId}/export-details`);
  return data;
};

const createItemExportDetails = async (itemId: number, exportDetailsData: CreateItemExportDetailsData): Promise<ItemExportDetails> => {
  const { data } = await api.post(`/items/${itemId}/export-details`, exportDetailsData);
  return data;
};

const updateItemExportDetails = async (itemId: number, id: number, exportDetailsData: UpdateItemExportDetailsData): Promise<ItemExportDetails> => {
  const { data } = await api.put(`/items/${itemId}/export-details/${id}`, exportDetailsData);
  return data;
};

const deleteItemExportDetails = async (itemId: number, id: number): Promise<void> => {
  await api.delete(`/items/${itemId}/export-details/${id}`);
};

// React Query Hooks
export const useItemExportDetails = (itemId: number) => {
  return useQuery<ItemExportDetails | null, Error>({
    queryKey: ['item-export-details', itemId],
    queryFn: () => getItemExportDetails(itemId),
    enabled: !!itemId,
  });
};

export const useCreateItemExportDetails = () => {
  const queryClient = useQueryClient();
  return useMutation<ItemExportDetails, Error, { itemId: number; data: CreateItemExportDetailsData }>({
    mutationFn: ({ itemId, data }) => createItemExportDetails(itemId, data),
    onSuccess: (data, { itemId }) => {
      queryClient.invalidateQueries({ queryKey: ['item-export-details', itemId] });
      queryClient.invalidateQueries({ queryKey: ['item-master', itemId] });
    },
  });
};

export const useUpdateItemExportDetails = () => {
  const queryClient = useQueryClient();
  return useMutation<ItemExportDetails, Error, { itemId: number; id: number; data: UpdateItemExportDetailsData }>({
    mutationFn: ({ itemId, id, data }) => updateItemExportDetails(itemId, id, data),
    onSuccess: (data, { itemId, id }) => {
      queryClient.invalidateQueries({ queryKey: ['item-export-details', itemId] });
      queryClient.invalidateQueries({ queryKey: ['item-master', itemId] });
    },
  });
};

export const useDeleteItemExportDetails = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { itemId: number; id: number }>({
    mutationFn: ({ itemId, id }) => deleteItemExportDetails(itemId, id),
    onSuccess: (_, { itemId }) => {
      queryClient.invalidateQueries({ queryKey: ['item-export-details', itemId] });
      queryClient.invalidateQueries({ queryKey: ['item-master', itemId] });
    },
  });
}; 