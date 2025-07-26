import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import { Division, CreateDivisionData, UpdateDivisionData } from '../types/division';

// --- API Functions ---

const getDivisions = async (): Promise<Division[]> => {
  const { data } = await api.get('/divisions');
  return data;
};

const getDivisionById = async (id: number): Promise<Division | null> => {
  if (!id) return null;
  const { data } = await api.get(`/divisions/${id}`);
  return data;
};

const getDivisionByCode = async (code: string): Promise<Division | null> => {
  if (!code) return null;
  const { data } = await api.get(`/divisions/code/${code}`);
  return data;
};

const createDivision = async (divisionData: CreateDivisionData): Promise<Division> => {
  const { data } = await api.post('/divisions', divisionData);
  return data;
};

const updateDivision = async ({ id, ...divisionData }: { id: number; data: UpdateDivisionData }): Promise<Division> => {
  const { data } = await api.put(`/divisions/${id}`, divisionData.data);
  return data;
};

const deleteDivision = async (id: number): Promise<void> => {
  await api.delete(`/divisions/${id}`);
};


// --- Custom Hooks ---

export const useDivisions = () => {
  return useQuery<Division[], Error>({
    queryKey: ['divisions'],
    queryFn: getDivisions,
  });
};

export const useDivisionById = (id: number) => {
  return useQuery<Division | null, Error>({
    queryKey: ['division', id],
    queryFn: () => getDivisionById(id),
    enabled: !!id,
  });
};

export const useDivisionByCode = (code: string) => {
  return useQuery<Division | null, Error>({
    queryKey: ['division', code],
    queryFn: () => getDivisionByCode(code),
    enabled: !!code,
  });
};

export const useCreateDivision = () => {
  const queryClient = useQueryClient();
  return useMutation<Division, Error, CreateDivisionData>({
    mutationFn: createDivision,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['divisions'] });
    },
  });
};

export const useUpdateDivision = () => {
  const queryClient = useQueryClient();
  return useMutation<Division, Error, { id: number; data: UpdateDivisionData }>({ 
    mutationFn: updateDivision,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['divisions'] });
      queryClient.invalidateQueries({ queryKey: ['division', variables.id] });
    },
  });
};

export const useDeleteDivision = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: deleteDivision,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['divisions'] });
    },
  });
};
