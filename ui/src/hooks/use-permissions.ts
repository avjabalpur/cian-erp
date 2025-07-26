import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import { Permission } from '../types/permission';

// --- API Function ---

const getPermissions = async (): Promise<Permission[]> => {
  const { data } = await api.get('/permissions');
  return data;
};

const createPermission = async (permissionData: any): Promise<Permission> => {
  const { data } = await api.post('/permissions', permissionData);
  return data;
};

const updatePermission = async (permissionData: any): Promise<Permission> => {
  const { id, ...rest } = permissionData;
  const { data } = await api.put(`/permissions/${id}`, rest);
  return data;
};

const deletePermission = async (id: number): Promise<void> => {
  await api.delete(`/permissions/${id}`);
};

// --- Custom Hooks ---

export const usePermissions = () => {
  return useQuery<Permission[], Error>({
    queryKey: ['permissions'],
    queryFn: getPermissions,
  });
};

export const useCreatePermission = () => {
  const queryClient = useQueryClient();
  return useMutation<Permission, Error, any>({
    mutationFn: createPermission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['permissions'] });
    },
  });
};

export const useUpdatePermission = () => {
  const queryClient = useQueryClient();
  return useMutation<Permission, Error, any>({
    mutationFn: updatePermission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['permissions'] });
    },
  });
};

export const useDeletePermission = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: deletePermission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['permissions'] });
    },
  });
};