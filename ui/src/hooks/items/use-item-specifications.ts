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

const createItemSpecification = async (specificationData: CreateItemSpecificationData): Promise<ItemSpecification> => {
  const { data } = await api.post('/item-specifications', specificationData);
  return data;
};

const updateItemSpecification = async (id: number, specificationData: UpdateItemSpecificationData): Promise<ItemSpecification> => {
  const { data } = await api.put(`/item-specifications/${id}`, specificationData);
  return data;
};

const deleteItemSpecification = async (id: number): Promise<void> => {
  await api.delete(`/item-specifications/${id}`);
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
  return useMutation<ItemSpecification, Error, CreateItemSpecificationData>({
    mutationFn: createItemSpecification,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['item-specification', variables.itemId] });
    },
  });
};

export const useUpdateItemSpecification = () => {
  const queryClient = useQueryClient();
  return useMutation<ItemSpecification, Error, { id: number; data: UpdateItemSpecificationData }>({
    mutationFn: ({ id, data }) => updateItemSpecification(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['item-specification'] });
    },
  });
};

export const useDeleteItemSpecification = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: deleteItemSpecification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['item-specification'] });
    },
  });
}; 