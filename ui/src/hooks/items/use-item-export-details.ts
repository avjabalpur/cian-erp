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

const createItemExportDetails = async (exportDetailsData: CreateItemExportDetailsData): Promise<ItemExportDetails> => {
  const { data } = await api.post('/item-export-details', exportDetailsData);
  return data;
};

const updateItemExportDetails = async (id: number, exportDetailsData: UpdateItemExportDetailsData): Promise<ItemExportDetails> => {
  const { data } = await api.put(`/item-export-details/${id}`, exportDetailsData);
  return data;
};

const deleteItemExportDetails = async (id: number): Promise<void> => {
  await api.delete(`/item-export-details/${id}`);
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
  return useMutation<ItemExportDetails, Error, CreateItemExportDetailsData>({
    mutationFn: createItemExportDetails,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['item-export-details', variables.itemId] });
    },
  });
};

export const useUpdateItemExportDetails = () => {
  const queryClient = useQueryClient();
  return useMutation<ItemExportDetails, Error, { id: number; data: UpdateItemExportDetailsData }>({
    mutationFn: ({ id, data }) => updateItemExportDetails(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['item-export-details'] });
    },
  });
};

export const useDeleteItemExportDetails = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: deleteItemExportDetails,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['item-export-details'] });
    },
  });
}; 