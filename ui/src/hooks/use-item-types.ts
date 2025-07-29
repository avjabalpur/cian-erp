import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import { ItemType, CreateItemTypeData, UpdateItemTypeData } from '../types/item-type';

// --- API Functions ---

const getItemTypes = async (): Promise<ItemType[]> => {
  const { data } = await api.get('/item-types');
  return data;
};

const getItemTypeById = async (id: number): Promise<ItemType | null> => {
  if (!id) return null;
  const { data } = await api.get(`/item-types/${id}`);
  return data;
};

const createItemType = async (itemTypeData: CreateItemTypeData): Promise<ItemType> => {
  const { data } = await api.post('/item-types', itemTypeData);
  return data;
};

const updateItemType = async ({ id, ...itemTypeData }: { id: number; data: UpdateItemTypeData }): Promise<ItemType> => {
  const { data } = await api.put(`/item-types/${id}`, itemTypeData.data);
  return data;
};

const deleteItemType = async (id: number): Promise<void> => {
  await api.delete(`/item-types/${id}`);
};


// --- Custom Hooks ---

export const useItemTypes = () => {
  return useQuery<ItemType[], Error>({
    queryKey: ['itemTypes'],
    queryFn: getItemTypes,
  });
};

export const useItemTypeById = (id: number) => {
  return useQuery<ItemType | null, Error>({
    queryKey: ['itemType', id],
    queryFn: () => getItemTypeById(id),
    enabled: !!id,
  });
};

export const useCreateItemType = () => {
  const queryClient = useQueryClient();
  return useMutation<ItemType, Error, CreateItemTypeData>({
    mutationFn: createItemType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['itemTypes'] });
    },
  });
};

export const useUpdateItemType = () => {
  const queryClient = useQueryClient();
  return useMutation<ItemType, Error, { id: number; data: UpdateItemTypeData }>({ 
    mutationFn: updateItemType,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['itemTypes'] });
      queryClient.invalidateQueries({ queryKey: ['itemType', variables.id] });
    },
  });
};

export const useDeleteItemType = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: deleteItemType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['itemTypes'] });
    },
  });
};
