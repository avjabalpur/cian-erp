import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import { Dosage, CreateDosageRequest, UpdateDosageRequest, DosageFilter, DosageResponse } from '../types/dosage';

// --- API Functions ---

const getDosages = async (filters: DosageFilter = {}): Promise<DosageResponse> => {
  const params = new URLSearchParams()
  
  if (filters.name) params.append('name', filters.name)
  if (filters.isActive !== undefined) params.append('isActive', filters.isActive.toString())
  if (filters.page) params.append('page', filters.page.toString())
  if (filters.pageSize) params.append('pageSize', filters.pageSize.toString())
  if (filters.sortBy) params.append('sortBy', filters.sortBy)
  if (filters.sortDirection) params.append('sortDirection', filters.sortDirection)

  const { data } = await api.get(`/dosages?${params.toString()}`);
  return data;
};

const getDosageById = async (id: number): Promise<Dosage | null> => {
  if (!id) return null;
  const { data } = await api.get(`/dosages/${id}`);
  return data;
};

const getAllDosages = async (): Promise<Dosage[]> => {
  const { data } = await api.get('/dosages/all');
  return data;
};

const createDosage = async (dosageData: CreateDosageRequest): Promise<Dosage> => {
  const { data } = await api.post('/dosages', dosageData);
  return data;
};

const updateDosage = async ({ id, data: dosageData }: { id: number; data: UpdateDosageRequest }): Promise<Dosage> => {
  const { data } = await api.put(`/dosages/${id}`, dosageData);
  return data;
};

const deleteDosage = async (id: number): Promise<void> => {
  await api.delete(`/dosages/${id}`);
};

// --- Custom Hooks ---

export const useDosages = (filters: DosageFilter = {}) => {
  return useQuery<DosageResponse, Error>({
    queryKey: ['dosages', filters],
    queryFn: () => getDosages(filters),
  });
};

export const useDosage = (id: number) => {
  return useQuery<Dosage | null, Error>({
    queryKey: ['dosage', id],
    queryFn: () => getDosageById(id),
    enabled: !!id,
  });
};

export const useAllDosages = () => {
  return useQuery<Dosage[], Error>({
    queryKey: ['dosages', 'all'],
    queryFn: getAllDosages,
  });
};

export const useCreateDosage = () => {
  const queryClient = useQueryClient();
  return useMutation<Dosage, Error, CreateDosageRequest>({
    mutationFn: createDosage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dosages'] });
    },
  });
};

export const useUpdateDosage = () => {
  const queryClient = useQueryClient();
  return useMutation<Dosage, Error, { id: number; data: UpdateDosageRequest }>({ 
    mutationFn: updateDosage,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['dosages'] });
      queryClient.invalidateQueries({ queryKey: ['dosage', variables.id] });
    },
  });
};

export const useDeleteDosage = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: deleteDosage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dosages'] });
    },
  });
}; 