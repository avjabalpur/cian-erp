import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';

// Types
export interface HsnCode {
  id: number;
  hsnCode: string;
  description?: string;
  hsnType?: string;
  taxRate?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
  createdBy?: number;
  createdByName?: string;
  updatedBy?: number;
  updatedByName?: string;
}

export interface CreateHsnMasterData {
  hsnCode: string;
  description?: string;
  hsnType?: string;
  taxRate?: number;
  isActive?: boolean;
}

export interface UpdateHsnMasterData {
  hsnCode: string;
  description?: string;
  hsnType?: string;
  taxRate?: number;
  isActive?: boolean;
}

export interface HsnMasterFilter {
  search?: string;
  hsnType?: string;
  isActive?: boolean;
  page?: number;
  pageSize?: number;
}

// API Functions
const getHsnMaster = async (filter?: HsnMasterFilter): Promise<HsnCode[]> => {
  const params = new URLSearchParams();
  if (filter?.search) params.append('search', filter.search);
  if (filter?.hsnType) params.append('hsnType', filter.hsnType);
  if (filter?.isActive !== undefined) params.append('isActive', filter.isActive.toString());
  if (filter?.page) params.append('page', filter.page.toString());
  if (filter?.pageSize) params.append('pageSize', filter.pageSize.toString());

  const { data } = await api.get(`/hsn-master?${params.toString()}`);
  return data;
};

const getHsnMasterById = async (id: number): Promise<HsnCode> => {
  const { data } = await api.get(`/hsn-master/${id}`);
  return data;
};

const getHsnTypes = async (): Promise<string[]> => {
  const { data } = await api.get('/hsn-master/hsn-types');
  return data;
};

const createHsnMaster = async (hsnData: CreateHsnMasterData): Promise<HsnCode> => {
  const { data } = await api.post('/hsn-master', hsnData);
  return data;
};

const updateHsnMaster = async (id: number, hsnData: UpdateHsnMasterData): Promise<HsnCode> => {
  const { data } = await api.put(`/hsn-master/${id}`, hsnData);
  return data;
};

const deleteHsnMaster = async (id: number): Promise<void> => {
  await api.delete(`/hsn-master/${id}`);
};

// React Query Hooks
export const useHsnMaster = (filter?: HsnMasterFilter) => {
  return useQuery<HsnCode[], Error>({
    queryKey: ['hsn-master', filter],
    queryFn: () => getHsnMaster(filter),
  });
};

export const useHsnMasterById = (id: number) => {
  return useQuery<HsnCode, Error>({
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
  return useMutation<HsnCode, Error, CreateHsnMasterData>({
    mutationFn: createHsnMaster,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hsn-master'] });
    },
  });
};

export const useUpdateHsnMaster = () => {
  const queryClient = useQueryClient();
  return useMutation<HsnCode, Error, { id: number; data: UpdateHsnMasterData }>({
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