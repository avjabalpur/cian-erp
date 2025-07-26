import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import { HsnMaster, CreateHsnMasterData, UpdateHsnMasterData } from '../types/hsn-master';

// --- API Functions ---

const getHsnMasters = async (): Promise<HsnMaster[]> => {
  const { data } = await api.get('/HsnMaster');
  return data;
};

const getHsnMasterById = async (id: number): Promise<HsnMaster | null> => {
  if (!id) return null;
  const { data } = await api.get(`/HsnMaster/${id}`);
  return data;
};

const createHsnMaster = async (hsnMasterData: CreateHsnMasterData): Promise<HsnMaster> => {
  const { data } = await api.post('/HsnMaster', hsnMasterData);
  return data;
};

const updateHsnMaster = async ({ id, ...hsnMasterData }: { id: number; data: UpdateHsnMasterData }): Promise<HsnMaster> => {
  const { data } = await api.put(`/HsnMaster/${id}`, hsnMasterData.data);
  return data;
};

const deleteHsnMaster = async (id: number): Promise<void> => {
  await api.delete(`/HsnMaster/${id}`);
};


// --- Custom Hooks ---

export const useHsnMasters = () => {
  return useQuery<HsnMaster[], Error>({
    queryKey: ['hsnMasters'],
    queryFn: getHsnMasters,
  });
};

export const useHsnMasterById = (id: number) => {
  return useQuery<HsnMaster | null, Error>({
    queryKey: ['hsnMaster', id],
    queryFn: () => getHsnMasterById(id),
    enabled: !!id,
  });
};

export const useCreateHsnMaster = () => {
  const queryClient = useQueryClient();
  return useMutation<HsnMaster, Error, CreateHsnMasterData>({
    mutationFn: createHsnMaster,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hsnMasters'] });
    },
  });
};

export const useUpdateHsnMaster = () => {
  const queryClient = useQueryClient();
  return useMutation<HsnMaster, Error, { id: number; data: UpdateHsnMasterData }>({ 
    mutationFn: updateHsnMaster,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['hsnMasters'] });
      queryClient.invalidateQueries({ queryKey: ['hsnMaster', variables.id] });
    },
  });
};

export const useDeleteHsnMaster = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: deleteHsnMaster,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hsnMasters'] });
    },
  });
};
