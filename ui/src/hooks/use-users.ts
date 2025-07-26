import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import { User, CreateUserData, UpdateUserData, UserRole } from '../types/user';

// --- API Functions ---

const getUsers = async (): Promise<User[]> => {
  const { data } = await api.get('/users');
  return data;
};

const getUserById = async (id: string): Promise<User | null> => {
  if (!id) return null;
  const { data } = await api.get(`/users/${id}`);
  return data;
};

const createUser = async (userData: CreateUserData): Promise<User> => {
  const { data } = await api.post('/users', userData);
  return data;
};

const updateUser = async ({ id, ...userData }: { id: string; data: UpdateUserData }): Promise<User> => {
  const { data } = await api.put(`/users/${id}`, userData.data);
  return data;
};

const deleteUser = async (id: string): Promise<void> => {
  await api.delete(`/users/${id}`);
};

const getUserRoles = async (id: string): Promise<UserRole[]> => {
  const { data } = await api.get(`/users/${id}/roles`);
  return data;
};

const assignUserRole = async (id: string, roleId: number, assignedBy?: number, isActive: boolean = true): Promise<void> => {
  await api.post(`/users/${id}/assign-role`, { roleId, assignedBy, isActive });
};

const removeUserRole = async (id: string, roleId: string): Promise<void> => {
  await api.delete(`/users/${id}/roles/${roleId}`);
};
// --- Custom Hooks ---

export const useUsers = ({ pageNumber = 1, pageSize = 10, status, search, company, columnFilters, sorting, globalFilter }: any = {}) => {
  return useQuery<User[], Error>({
    queryKey: ['users'],
    queryFn: getUsers,
  });
};

export const useUserById = (id: string) => {
  return useQuery<User | null, Error>({
    queryKey: ['user', id],
    queryFn: () => getUserById(id),
    enabled: !!id,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation<User, Error, CreateUserData>({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation<User, Error, { id: string; data: UpdateUserData }>({ 
    mutationFn: updateUser,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', variables.id] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useGetUserRoles = (id: string) => {
  return useQuery<UserRole[], Error>({
    queryKey: ['user-roles', id],
    queryFn: () => getUserRoles(id),
    enabled: !!id,
  });
};

export function useAssignUserRole() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { id: string; roleId: number; assignedBy?: number; isActive?: boolean }>({
    mutationFn: ({ id, roleId, assignedBy, isActive }) => assignUserRole(id, roleId, assignedBy, isActive),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ 
        queryKey: ['user-roles', id] 
      });
    },
    onError: (error) => {
      console.error('Failed to assign user role:', error);
      throw error;
    }
  });
}

export function useRemoveUserRole() {
  const queryClient = useQueryClient();
  
  return useMutation<void, Error, { id: string; roleId: string }>({
    mutationFn: ({ id, roleId }) => removeUserRole(id, roleId),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ 
        queryKey: ['user-roles', id] 
      });
    },
    onError: (error) => {
      console.error('Failed to remove user role:', error);
      throw error;
    }
  });
}
