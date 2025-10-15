import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import { LocationType, CreateLocationTypeData, UpdateLocationTypeData } from '../types/location-type';

// --- API Functions ---

const getLocationTypes = async (): Promise<LocationType[]> => {
  const { data } = await api.get('/location-types');
  return data;
};

const getLocationTypeById = async (id: number): Promise<LocationType | null> => {
  if (!id) return null;
  const { data } = await api.get(`/location-types/${id}`);
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

export const useLocationTypes = () => {
  return useQuery<LocationType[], Error>({
    queryKey: ['locationTypes'],
    queryFn: getLocationTypes,
  });
};

export const useLocationTypeById = (id: number) => {
  return useQuery<LocationType | null, Error>({
    queryKey: ['locationType', id],
    queryFn: () => getLocationTypeById(id),
    enabled: !!id,
  });
};

export const useCreateLocationType = () => {
  const queryClient = useQueryClient();
  return useMutation<LocationType, Error, CreateLocationTypeData>({
    mutationFn: createLocationType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locationTypes'] });
    },
  });
};

export const useUpdateLocationType = () => {
  const queryClient = useQueryClient();
  return useMutation<LocationType, Error, { id: number; data: UpdateLocationTypeData }>({ 
    mutationFn: updateLocationType,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['locationTypes'] });
      queryClient.invalidateQueries({ queryKey: ['locationType', variables.id] });
    },
  });
};

export const useDeleteLocationType = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: deleteLocationType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locationTypes'] });
    },
  });
};
