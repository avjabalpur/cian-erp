import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import { UnitOfMeasure, CreateUnitOfMeasureData, UpdateUnitOfMeasureData } from '../types/unit-of-measure';

// --- API Functions ---

const getUnitOfMeasures = async (): Promise<UnitOfMeasure[]> => {
  const { data } = await api.get('/UnitOfMeasure');
  return data;
};

const getUnitOfMeasureById = async (id: number): Promise<UnitOfMeasure | null> => {
  if (!id) return null;
  const { data } = await api.get(`/UnitOfMeasure/${id}`);
  return data;
};

const createUnitOfMeasure = async (unitOfMeasureData: CreateUnitOfMeasureData): Promise<UnitOfMeasure> => {
  const { data } = await api.post('/UnitOfMeasure', unitOfMeasureData);
  return data;
};

const updateUnitOfMeasure = async ({ id, ...unitOfMeasureData }: { id: number; data: UpdateUnitOfMeasureData }): Promise<UnitOfMeasure> => {
  const { data } = await api.put(`/UnitOfMeasure/${id}`, unitOfMeasureData.data);
  return data;
};

const deleteUnitOfMeasure = async (id: number): Promise<void> => {
  await api.delete(`/UnitOfMeasure/${id}`);
};


// --- Custom Hooks ---

export const useUnitOfMeasures = () => {
  return useQuery<UnitOfMeasure[], Error>({
    queryKey: ['unitOfMeasures'],
    queryFn: getUnitOfMeasures,
  });
};

export const useUnitOfMeasureById = (id: number) => {
  return useQuery<UnitOfMeasure | null, Error>({
    queryKey: ['unitOfMeasure', id],
    queryFn: () => getUnitOfMeasureById(id),
    enabled: !!id,
  });
};

export const useCreateUnitOfMeasure = () => {
  const queryClient = useQueryClient();
  return useMutation<UnitOfMeasure, Error, CreateUnitOfMeasureData>({
    mutationFn: createUnitOfMeasure,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unitOfMeasures'] });
    },
  });
};

export const useUpdateUnitOfMeasure = () => {
  const queryClient = useQueryClient();
  return useMutation<UnitOfMeasure, Error, { id: number; data: UpdateUnitOfMeasureData }>({ 
    mutationFn: updateUnitOfMeasure,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['unitOfMeasures'] });
      queryClient.invalidateQueries({ queryKey: ['unitOfMeasure', variables.id] });
    },
  });
};

export const useDeleteUnitOfMeasure = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: deleteUnitOfMeasure,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unitOfMeasures'] });
    },
  });
};
