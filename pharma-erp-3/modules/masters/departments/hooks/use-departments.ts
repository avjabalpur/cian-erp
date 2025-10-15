import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Department, CreateDepartmentData, UpdateDepartmentData } from '../types';

// --- API Functions ---

const getDepartments = async (params?: { 
  pageNumber?: number; 
  pageSize?: number; 
  search?: string; 
  status?: string; 
}): Promise<{ items: Department[]; totalCount: number }> => {
  const { data } = await api.get('/departments', { params });
  return data;
};

const getDepartmentById = async (id: string): Promise<Department | null> => {
  if (!id) return null;
  const { data } = await api.get(`/departments/${id}`);
  return data;
};

const createDepartment = async (departmentData: CreateDepartmentData): Promise<Department> => {
  const { data } = await api.post('/departments', departmentData);
  return data;
};

const updateDepartment = async ({ id, ...departmentData }: { id: string; data: UpdateDepartmentData }): Promise<Department> => {
  const { data } = await api.put(`/departments/${id}`, departmentData.data);
  return data;
};

const deleteDepartment = async (id: string): Promise<void> => {
  await api.delete(`/departments/${id}`);
};

// --- Custom Hooks ---

export const useDepartments = ({ pageNumber = 1, pageSize = 10, status, search }: any = {}) => {
  return useQuery<{ items: Department[]; totalCount: number }, Error>({
    queryKey: ['departments', { pageNumber, pageSize, status, search }],
    queryFn: () => getDepartments({ pageNumber, pageSize, status, search }),
  });
};

export const useDepartmentById = (id: string) => {
  return useQuery<Department | null, Error>({
    queryKey: ['department', id],
    queryFn: () => getDepartmentById(id),
    enabled: !!id,
  });
};

export const useCreateDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation<Department, Error, CreateDepartmentData>({
    mutationFn: createDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
    },
  });
};

export const useUpdateDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation<Department, Error, { id: string; data: UpdateDepartmentData }>({ 
    mutationFn: updateDepartment,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      queryClient.invalidateQueries({ queryKey: ['department', variables.id] });
    },
  });
};

export const useDeleteDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: deleteDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
    },
  });
};

