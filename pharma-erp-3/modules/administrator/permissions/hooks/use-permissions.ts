import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Permission, CreatePermissionData, UpdatePermissionData } from '../types';

// Static list of available modules
export const AVAILABLE_MODULES = [
  'user',
  'role',
  'permission',
  'customer',
  'quote',
  'order',
  'invoice',
  'task',
  'sales',
  'company',
  'report',
  'email',
  'document',
  'import',
  'export',
  'department',
  'division',
  'organization',
  'item',
  'product',
  'warehouse',
] as const;

// Static list of available actions
export const AVAILABLE_ACTIONS = [
  'create',
  'read',
  'update',
  'delete',
  'approve',
  'reject',
  'export',
  'import',
  'view',
  'manage',
] as const;

// --- API Functions ---

const getPermissions = async (params?: { 
  pageNumber?: number; 
  pageSize?: number; 
  search?: string; 
  moduleName?: string;
}): Promise<{ items: Permission[]; totalCount: number }> => {
  const { data } = await api.get('/permissions', { params });
  return data;
};

const getPermissionById = async (id: string): Promise<Permission | null> => {
  if (!id) return null;
  const { data } = await api.get(`/permissions/${id}`);
  return data;
};

const createPermission = async (permissionData: CreatePermissionData): Promise<Permission> => {
  const { data } = await api.post('/permissions', permissionData);
  return data;
};

const updatePermission = async ({ id, ...permissionData }: { id: string; data: UpdatePermissionData }): Promise<Permission> => {
  const { data } = await api.put(`/permissions/${id}`, permissionData.data);
  return data;
};

const deletePermission = async (id: string): Promise<void> => {
  await api.delete(`/permissions/${id}`);
};

// --- Custom Hooks ---

export const usePermissions = ({ pageNumber = 1, pageSize = 10, moduleName, search }: any = {}) => {
  return useQuery<{ items: Permission[]; totalCount: number }, Error>({
    queryKey: ['permissions', { pageNumber, pageSize, moduleName, search }],
    queryFn: () => getPermissions({ pageNumber, pageSize, moduleName, search }),
  });
};

export const usePermissionById = (id: string) => {
  return useQuery<Permission | null, Error>({
    queryKey: ['permission', id],
    queryFn: () => getPermissionById(id),
    enabled: !!id,
  });
};

export const useCreatePermission = () => {
  const queryClient = useQueryClient();
  return useMutation<Permission, Error, CreatePermissionData>({
    mutationFn: createPermission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['permissions'] });
    },
  });
};

export const useUpdatePermission = () => {
  const queryClient = useQueryClient();
  return useMutation<Permission, Error, { id: string; data: UpdatePermissionData }>({ 
    mutationFn: updatePermission,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['permissions'] });
      queryClient.invalidateQueries({ queryKey: ['permission', variables.id] });
    },
  });
};

export const useDeletePermission = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: deletePermission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['permissions'] });
    },
  });
};

