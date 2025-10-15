import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { LocationType, CreateLocationTypeData, UpdateLocationTypeData } from '../types';

// --- API Functions ---
const getLocationTypes = async (params?: {
  pageNumber?: number;
  pageSize?: number;
  search?: string;
  status?: string;
}): Promise<LocationType[]> => {
  const { data } = await api.get('/location-types', { params });
  return data;
};

const getLocationTypeById = async (id: number): Promise<LocationType | null> => {
  if (!id) return null;
  const { data } = await api.get(`/location-types/${id}`);
  return data;
};

const getLocationTypeByCode = async (code: string): Promise<LocationType | null> => {
  if (!code) return null;
  const { data } = await api.get(`/location-types/code/${code}`);
  return data;
};

const createLocationType = async (locationTypeData: CreateLocationTypeData): Promise<LocationType> => {
  const { data } = await api.post('/location-types', locationTypeData);
  return data;
};

const updateLocationType = async ({ id, data: locationTypeData }: { id: number; data: UpdateLocationTypeData }): Promise<LocationType> => {
  const { data } = await api.put(`/location-types/${id}`, locationTypeData);
  return data;
};

const deleteLocationType = async (id: number): Promise<void> => {
  await api.delete(`/location-types/${id}`);
};

// --- Custom Hooks ---
export const useLocationTypes = (params?: any) => {
  return useQuery<LocationType[], Error>({
    queryKey: ['location-types', params],
    queryFn: () => getLocationTypes(params),
  });
};

export const useLocationTypeById = (id: number) => {
  return useQuery<LocationType | null, Error>({
    queryKey: ['location-type', id],
    queryFn: () => getLocationTypeById(id),
    enabled: !!id,
  });
};

export const useLocationTypeByCode = (code: string) => {
  return useQuery<LocationType | null, Error>({
    queryKey: ['location-type', code],
    queryFn: () => getLocationTypeByCode(code),
    enabled: !!code,
  });
};

export const useCreateLocationType = () => {
  const queryClient = useQueryClient();
  return useMutation<LocationType, Error, CreateLocationTypeData>({
    mutationFn: createLocationType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['location-types'] });
    },
  });
};

export const useUpdateLocationType = () => {
  const queryClient = useQueryClient();
  return useMutation<LocationType, Error, { id: number; data: UpdateLocationTypeData }>({
    mutationFn: updateLocationType,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['location-types'] });
      queryClient.invalidateQueries({ queryKey: ['location-type', variables.id] });
    },
  });
};

export const useDeleteLocationType = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: deleteLocationType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['location-types'] });
    },
  });
};
