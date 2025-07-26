import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import { Department, CreateDepartmentData, UpdateDepartmentData } from '../types/department';

// --- API Functions ---

const getDepartments = async (): Promise<Department[]> => {
  const { data } = await api.get('/departments');
  return data;
};

const getDepartmentById = async (id: number): Promise<Department | null> => {
  if (!id) return null;
  const { data } = await api.get(`/departments/${id}`);
  return data;
};

const getDepartmentByCode = async (code: string): Promise<Department | null> => {
  if (!code) return null;
  const { data } = await api.get(`/departments/code/${code}`);
  return data;
};

const createDepartment = async (departmentData: CreateDepartmentData): Promise<Department> => {
  const { data } = await api.post('/departments', departmentData);
  return data;
};

const updateDepartment = async ({ id, ...departmentData }: { id: number; data: UpdateDepartmentData }): Promise<Department> => {
  const { data } = await api.put(`/departments/${id}`, departmentData.data);
  return data;
};

const deleteDepartment = async (id: number): Promise<void> => {
  await api.delete(`/departments/${id}`);
};


// --- Custom Hooks ---

export const useDepartments = () => {
  return useQuery<Department[], Error>({
    queryKey: ['departments'],
    queryFn: getDepartments,
  });
};

export const useDepartmentById = (id: number) => {
  return useQuery<Department | null, Error>({
    queryKey: ['department', id],
    queryFn: () => getDepartmentById(id),
    enabled: !!id,
  });
};

export const useDepartmentByCode = (code: string) => {
  return useQuery<Department | null, Error>({
    queryKey: ['department', code],
    queryFn: () => getDepartmentByCode(code),
    enabled: !!code,
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
  return useMutation<Department, Error, { id: number; data: UpdateDepartmentData }>({ 
    mutationFn: updateDepartment,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      queryClient.invalidateQueries({ queryKey: ['department', variables.id] });
    },
  });
};

export const useDeleteDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: deleteDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
    },
  });
};
