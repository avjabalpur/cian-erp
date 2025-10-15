import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Role, CreateRoleData, UpdateRoleData } from '../types';

// --- API Functions ---

const getRoles = async (params?: { 
  pageNumber?: number; 
  pageSize?: number; 
  search?: string; 
  status?: string; 
}): Promise<{ items: Role[]; totalCount: number }> => {
  const { data } = await api.get('/roles', { params });
  return data;
};

const getRoleById = async (id: string): Promise<Role | null> => {
  if (!id) return null;
  const { data } = await api.get(`/roles/${id}`);
  return data;
};

const createRole = async (roleData: CreateRoleData): Promise<Role> => {
  const { data } = await api.post('/roles', roleData);
  return data;
};

const updateRole = async ({ id, ...roleData }: { id: string; data: UpdateRoleData }): Promise<Role> => {
  const { data } = await api.put(`/roles/${id}`, roleData.data);
  return data;
};

const deleteRole = async (id: string): Promise<void> => {
  await api.delete(`/roles/${id}`);
};

// --- Custom Hooks ---

export const useRoles = ({ pageNumber = 1, pageSize = 10, status, search }: any = {}) => {
  return useQuery<{ items: Role[]; totalCount: number }, Error>({
    queryKey: ['roles', { pageNumber, pageSize, status, search }],
    queryFn: () => getRoles({ pageNumber, pageSize, status, search }),
  });
};

export const useRoleById = (id: string) => {
  return useQuery<Role | null, Error>({
    queryKey: ['role', id],
    queryFn: () => getRoleById(id),
    enabled: !!id,
  });
};

export const useCreateRole = () => {
  const queryClient = useQueryClient();
  return useMutation<Role, Error, CreateRoleData>({
    mutationFn: createRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
  });
};

export const useUpdateRole = () => {
  const queryClient = useQueryClient();
  return useMutation<Role, Error, { id: string; data: UpdateRoleData }>({ 
    mutationFn: updateRole,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      queryClient.invalidateQueries({ queryKey: ['role', variables.id] });
    },
  });
};

export const useDeleteRole = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: deleteRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
  });
};

