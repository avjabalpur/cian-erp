import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Dosage, CreateDosageData, UpdateDosageData } from '../types';
import { PaginatedResponse } from '@/types/common';

// --- API Functions ---
const getDosages = async (params?: {
  pageNumber?: number;
  pageSize?: number;
  search?: string;
  status?: string;
}): Promise<PaginatedResponse<Dosage>> => {
  const { data } = await api.get('/dosages', { params });
  return data;
};

const getDosageById = async (id: number): Promise<Dosage | null> => {
  if (!id) return null;
  const { data } = await api.get(`/dosages/${id}`);
  return data;
};

const createDosage = async (dosageData: CreateDosageData): Promise<Dosage> => {
  const { data } = await api.post('/dosages', dosageData);
  return data;
};

const updateDosage = async ({ id, data: dosageData }: { id: number; data: UpdateDosageData }): Promise<Dosage> => {
  const { data } = await api.put(`/dosages/${id}`, dosageData);
  return data;
};

const deleteDosage = async (id: number): Promise<void> => {
  await api.delete(`/dosages/${id}`);
};

// --- Custom Hooks ---
export const useDosages = (params?: any) => {
  return useQuery<PaginatedResponse<Dosage>, Error>({
    queryKey: ['dosages', params],
    queryFn: () => getDosages(params),
  });
};

export const useDosageById = (id: number) => {
  return useQuery<Dosage | null, Error>({
    queryKey: ['dosage', id],
    queryFn: () => getDosageById(id),
    enabled: !!id,
  });
};

export const useCreateDosage = () => {
  const queryClient = useQueryClient();
  return useMutation<Dosage, Error, CreateDosageData>({
    mutationFn: createDosage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dosages'] });
    },
  });
};

export const useUpdateDosage = () => {
  const queryClient = useQueryClient();
  return useMutation<Dosage, Error, { id: number; data: UpdateDosageData }>({
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
