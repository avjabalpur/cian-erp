import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';

// Types
export interface ItemSpecification {
  id: number;
  itemId: number;
  specification?: string;
  substituteItemFor?: string;
  customTariffNo?: string;
  exciseTariffNo?: string;
  vatCommCode?: string;
  convFactor?: number;
  oldCode?: string;
  standardWeight?: number;
  standardConversionCostFactor?: number;
  standardPackingCostFactor?: number;
  costFactorPercent?: number;
  packingCostRs?: number;
  createdAt: string;
  updatedAt?: string;
  createdBy?: number;
  updatedBy?: number;
}

export interface CreateItemSpecificationData {
  itemId: number;
  specification?: string;
  substituteItemFor?: string;
  customTariffNo?: string;
  exciseTariffNo?: string;
  vatCommCode?: string;
  convFactor?: number;
  oldCode?: string;
  standardWeight?: number;
  standardConversionCostFactor?: number;
  standardPackingCostFactor?: number;
  costFactorPercent?: number;
  packingCostRs?: number;
}

export interface UpdateItemSpecificationData {
  specification?: string;
  substituteItemFor?: string;
  customTariffNo?: string;
  exciseTariffNo?: string;
  vatCommCode?: string;
  convFactor?: number;
  oldCode?: string;
  standardWeight?: number;
  standardConversionCostFactor?: number;
  standardPackingCostFactor?: number;
  costFactorPercent?: number;
  packingCostRs?: number;
}

// API Functions
const getItemSpecification = async (itemId: number): Promise<ItemSpecification | null> => {
  if (!itemId) return null;
  const { data } = await api.get(`/items/${itemId}/specification`);
  return data;
};

const createItemSpecification = async (itemId: number, specificationData: CreateItemSpecificationData): Promise<ItemSpecification> => {
  const { data } = await api.post(`/items/${itemId}/specification`, specificationData);
  return data;
};

const updateItemSpecification = async (itemId: number, specificationData: UpdateItemSpecificationData): Promise<ItemSpecification> => {
  const { data } = await api.put(`/items/${itemId}/specification`, specificationData);
  return data;
};

const deleteItemSpecification = async (itemId: number): Promise<void> => {
  await api.delete(`/items/${itemId}/specification`);
};

// React Query Hooks
export const useItemSpecification = (itemId: number) => {
  return useQuery<ItemSpecification | null, Error>({
    queryKey: ['item-specification', itemId],
    queryFn: () => getItemSpecification(itemId),
    enabled: !!itemId,
  });
};

export const useCreateItemSpecification = () => {
  const queryClient = useQueryClient();
  return useMutation<ItemSpecification, Error, { itemId: number; data: CreateItemSpecificationData }>({
    mutationFn: ({ itemId, data }) => createItemSpecification(itemId, data),
    onSuccess: (data, { itemId }) => {
      queryClient.invalidateQueries({ queryKey: ['item-specification', itemId] });
      queryClient.invalidateQueries({ queryKey: ['item-master', itemId] });
    },
  });
};

export const useUpdateItemSpecification = () => {
  const queryClient = useQueryClient();
  return useMutation<ItemSpecification, Error, { itemId: number; data: UpdateItemSpecificationData }>({
    mutationFn: ({ itemId, data }) => updateItemSpecification(itemId, data),
    onSuccess: (data, { itemId }) => {
      queryClient.invalidateQueries({ queryKey: ['item-specification', itemId] });
      queryClient.invalidateQueries({ queryKey: ['item-master', itemId] });
    },
  });
};

export const useDeleteItemSpecification = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { itemId: number }>({
    mutationFn: ({ itemId }) => deleteItemSpecification(itemId),
    onSuccess: (_, { itemId }) => {
      queryClient.invalidateQueries({ queryKey: ['item-specification', itemId] });
      queryClient.invalidateQueries({ queryKey: ['item-master', itemId] });
    },
  });
}; 