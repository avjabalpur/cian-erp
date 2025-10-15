import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import { Role, CreateRoleInput, UpdateRoleInput } from '../types/role';

// --- API Functions ---

const getRoles = async (): Promise<Role[]> => {
  const { data } = await api.get('/roles');
  return data;
};

const getRoleById = async (id: number): Promise<Role | null> => {
  if (!id) return null;
  const { data } = await api.get(`/roles/${id}`);
  return data;
};

const createRole = async (roleData: CreateRoleInput): Promise<Role> => {
  const { data } = await api.post('/roles', roleData);
  return data;
};

const updateRole = async ({ id, ...roleData }: { id: number; data: UpdateRoleInput }): Promise<Role> => {
  const { data } = await api.put(`/roles/${id}`, roleData.data);
  return data;
};

const deleteRole = async (id: number): Promise<void> => {
  await api.delete(`/roles/${id}`);
};

// --- Role Permission API Functions ---

const getRolePermissions = async (roleId: number): Promise<number[]> => {
  const { data } = await api.get(`/roles/${roleId}/permissions`);
  return data;
};

const assignRolePermission = async (roleId: number, permissionId: number): Promise<void> => {
  await api.post(`/roles/${roleId}/permissions`, { roleId, permissionId });
};

const removeRolePermission = async (roleId: number, permissionId: number): Promise<void> => {
  await api.request({
    url: `/roles/${roleId}/permissions/${permissionId}`,
    method: 'DELETE',
    data: { roleId, permissionId },
  });
};

// --- Custom Hooks ---

export const useRoles = () => {
  return useQuery<any, Error>({
    queryKey: ['roles'],
    queryFn: getRoles,
  });
};

export const useRoleById = (id: number) => {
  return useQuery<Role | null, Error>({
    queryKey: ['role', id],
    queryFn: () => getRoleById(id),
    enabled: !!id,
  });
};

export const useCreateRole = () => {
  const queryClient = useQueryClient();
  return useMutation<Role, Error, CreateRoleInput>({
    mutationFn: createRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
  });
};

export const useUpdateRole = () => {
  const queryClient = useQueryClient();
  return useMutation<Role, Error, { id: number; data: UpdateRoleInput }>({ 
    mutationFn: updateRole,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      queryClient.invalidateQueries({ queryKey: ['role', variables.id] });
    },
  });
};

export const useDeleteRole = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: deleteRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
  });
};

export const useGetRolePermissions = (roleId: number) => {
  return useQuery<number[], Error>({
    queryKey: ['role-permissions', roleId],
    queryFn: () => getRolePermissions(roleId),
    enabled: !!roleId,
  });
};

export const useAssignRolePermission = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { roleId: number; permissionId: number }>({
    mutationFn: ({ roleId, permissionId }) => assignRolePermission(roleId, permissionId),
    onSuccess: (_, { roleId }) => {
      queryClient.invalidateQueries({ queryKey: ['role-permissions', roleId] });
      queryClient.invalidateQueries({ queryKey: ['role', roleId] });
    },
    onError: (error) => {
      console.error('Failed to assign role permission:', error);
      throw error;
    }
  });
};

export const useRemoveRolePermission = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { roleId: number; permissionId: number }>({
    mutationFn: ({ roleId, permissionId }) => removeRolePermission(roleId, permissionId),
    onSuccess: (_, { roleId }) => {
      queryClient.invalidateQueries({ queryKey: ['role-permissions', roleId] });
      queryClient.invalidateQueries({ queryKey: ['role', roleId] });
    },
    onError: (error) => {
      console.error('Failed to remove role permission:', error);
      throw error;
    }
  });
};
