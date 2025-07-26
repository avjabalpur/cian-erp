import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import { Item, CreateItemData, UpdateItemData } from '../types/item';

// --- API Functions ---

const getItems = async (): Promise<Item[]> => {
  const { data } = await api.get('/items');
  return data;
};

const getItemById = async (id: number): Promise<Item | null> => {
  if (!id) return null;
  const { data } = await api.get(`/items/${id}`);
  return data;
};

const createItem = async (itemData: CreateItemData): Promise<Item> => {
  const { data } = await api.post('/items', itemData);
  return data;
};

const updateItem = async ({ id, ...itemData }: { id: number; data: UpdateItemData }): Promise<Item> => {
  const { data } = await api.put(`/items/${id}`, itemData.data);
  return data;
};

const deleteItem = async (id: number): Promise<void> => {
  await api.delete(`/items/${id}`);
};


// --- Custom Hooks ---

export const useItems = () => {
  return useQuery<Item[], Error>({
    queryKey: ['items'],
    queryFn: getItems,
  });
};

export const useItemById = (id: number) => {
  return useQuery<Item | null, Error>({
    queryKey: ['item', id],
    queryFn: () => getItemById(id),
    enabled: !!id,
  });
};

export const useCreateItem = () => {
  const queryClient = useQueryClient();
  return useMutation<Item, Error, CreateItemData>({
    mutationFn: createItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });
};

export const useUpdateItem = () => {
  const queryClient = useQueryClient();
  return useMutation<Item, Error, { id: number; data: UpdateItemData }>({
    mutationFn: updateItem,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      queryClient.invalidateQueries({ queryKey: ['item', variables.id] });
    },
  });
};

export const useDeleteItem = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: deleteItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });
};

