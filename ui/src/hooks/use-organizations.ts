import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import { Organization, CreateOrganizationData, UpdateOrganizationData } from '../types/organization';

// --- API Functions ---

const getOrganizations = async (): Promise<Organization[]> => {
  const { data } = await api.get('/Organization');
  return data;
};

const getOrganizationById = async (id: number): Promise<Organization | null> => {
  if (!id) return null;
  const { data } = await api.get(`/Organization/${id}`);
  return data;
};

const createOrganization = async (organizationData: CreateOrganizationData): Promise<Organization> => {
  const { data } = await api.post('/Organization', organizationData);
  return data;
};

const updateOrganization = async ({ id, ...organizationData }: { id: number; data: UpdateOrganizationData }): Promise<Organization> => {
  const { data } = await api.put(`/Organization/${id}`, organizationData.data);
  return data;
};

const deleteOrganization = async (id: number): Promise<void> => {
  await api.delete(`/Organization/${id}`);
};


// --- Custom Hooks ---

export const useOrganizations = () => {
  return useQuery<Organization[], Error>({
    queryKey: ['organizations'],
    queryFn: getOrganizations,
  });
};

export const useOrganizationById = (id: number) => {
  return useQuery<Organization | null, Error>({
    queryKey: ['organization', id],
    queryFn: () => getOrganizationById(id),
    enabled: !!id,
  });
};

export const useCreateOrganization = () => {
  const queryClient = useQueryClient();
  return useMutation<Organization, Error, CreateOrganizationData>({
    mutationFn: createOrganization,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
    },
  });
};

export const useUpdateOrganization = () => {
  const queryClient = useQueryClient();
  return useMutation<Organization, Error, { id: number; data: UpdateOrganizationData }>({ 
    mutationFn: updateOrganization,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      queryClient.invalidateQueries({ queryKey: ['organization', variables.id] });
    },
  });
};

export const useDeleteOrganization = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: deleteOrganization,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
    },
  });
};
