import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';
import { HsnMaster, CreateHsnMasterData, UpdateHsnMasterData, HsnMasterFilter, PaginatedResponse } from '@/types/hsn-master';

// API Functions
const getHsnMaster = async (filter?: HsnMasterFilter): Promise<PaginatedResponse<HsnMaster>> => {
  const params = new URLSearchParams();
  if (filter?.search) params.append('searchTerm', filter.search);
  if (filter?.hsnType) params.append('hsnType', filter.hsnType);
  if (filter?.isActive !== undefined) params.append('isActive', filter.isActive.toString());
  if (filter?.pageNumber) params.append('pageNumber', filter.pageNumber.toString());
  if (filter?.pageSize) params.append('pageSize', filter.pageSize.toString());
  if (filter?.sortBy) params.append('sortBy', filter.sortBy);
  if (filter?.sortOrder) params.append('sortOrder', filter.sortOrder);

  const { data } = await api.get(`/hsn-master?${params.toString()}`);
  return data;
};

const getHsnMasterById = async (id: number): Promise<HsnMaster> => {
  const { data } = await api.get(`/hsn-master/${id}`);
  return data;
};

const getHsnTypes = async (): Promise<string[]> => {
  const { data } = await api.get('/hsn-master/hsn-types');
  return data;
};

const createHsnMaster = async (hsnData: CreateHsnMasterData): Promise<HsnMaster> => {
  const { data } = await api.post('/hsn-master', hsnData);
  return data;
};

const updateHsnMaster = async (id: number, hsnData: UpdateHsnMasterData): Promise<HsnMaster> => {
  const { data } = await api.put(`/hsn-master/${id}`, hsnData);
  return data;
};

const deleteHsnMaster = async (id: number): Promise<void> => {
  await api.delete(`/hsn-master/${id}`);
};

// React Query Hooks
export const useHsnMaster = (filter?: HsnMasterFilter) => {
  return useQuery<PaginatedResponse<HsnMaster>, Error>({
    queryKey: ['hsn-master', filter],
    queryFn: () => getHsnMaster(filter),
  });
};

export const useHsnMasterById = (id: number) => {
  return useQuery<HsnMaster, Error>({
    queryKey: ['hsn-master', id],
    queryFn: () => getHsnMasterById(id),
    enabled: !!id,
  });
};

export const useHsnTypes = () => {
  return useQuery<string[], Error>({
    queryKey: ['hsn-types'],
    queryFn: getHsnTypes,
  });
};

export const useCreateHsnMaster = () => {
  const queryClient = useQueryClient();
  return useMutation<HsnMaster, Error, CreateHsnMasterData>({
    mutationFn: createHsnMaster,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hsn-master'] });
    },
  });
};

export const useUpdateHsnMaster = () => {
  const queryClient = useQueryClient();
  return useMutation<HsnMaster, Error, { id: number; data: UpdateHsnMasterData }>({
    mutationFn: ({ id, data }) => updateHsnMaster(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['hsn-master'] });
      queryClient.invalidateQueries({ queryKey: ['hsn-master', id] });
    },
  });
};

export const useDeleteHsnMaster = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: deleteHsnMaster,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hsn-master'] });
    },
  });
}; 