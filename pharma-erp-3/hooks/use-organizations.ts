import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import { Organization, CreateOrganizationData, UpdateOrganizationData, OrganizationFilter } from '../types/organization';

// --- API Functions ---

const getOrganizations = async (params?: { 
  pageNumber?: number; 
  pageSize?: number; 
  search?: string; 
  isActive?: boolean; 
  locationTypeId?: number; 
  columnFilters?: any[];
  sorting?: any[];
  globalFilter?: string;
}): Promise<{ items: Organization[]; totalCount: number; pageCount: number }> => {
  const { data } = await api.get('/organizations', { params });
  return data;
};

const getOrganizationById = async (id: number): Promise<Organization | null> => {
  if (!id) return null;
  const { data } = await api.get(`/organizations/${id}`);
  return data;
};

const getOrganizationByCode = async (code: string): Promise<Organization | null> => {
  if (!code) return null;
  const { data } = await api.get(`/organizations/code/${code}`);
  return data;
};

const createOrganization = async (organizationData: CreateOrganizationData): Promise<Organization> => {
  const { data } = await api.post('/organizations', organizationData);
  return data;
};

const updateOrganization = async ({ id, data: organizationData }: { id: number; data: UpdateOrganizationData }): Promise<Organization> => {
  const { data } = await api.put(`/organizations/${id}`, organizationData);
  return data;
};

const deleteOrganization = async (id: number): Promise<void> => {
  await api.delete(`/organizations/${id}`);
};

// --- Custom Hooks ---

export const useOrganizations = ({ 
  pageNumber = 1, 
  pageSize = 10, 
  search, 
  isActive, 
  locationTypeId, 
  columnFilters, 
  sorting, 
  globalFilter 
}: any = {}) => {
  return useQuery<{ items: Organization[]; totalCount: number; pageCount: number }, Error>({
    queryKey: ['organizations', { pageNumber, pageSize, search, isActive, locationTypeId, columnFilters, sorting, globalFilter }],
    queryFn: () => getOrganizations({ pageNumber, pageSize, search, isActive, locationTypeId, columnFilters, sorting, globalFilter }),
  });
};

export const useOrganizationById = (id: number) => {
  return useQuery<Organization | null, Error>({
    queryKey: ['organization', id],
    queryFn: () => getOrganizationById(id),
    enabled: !!id,
  });
};

export const useOrganizationByCode = (code: string) => {
  return useQuery<Organization | null, Error>({
    queryKey: ['organization-by-code', code],
    queryFn: () => getOrganizationByCode(code),
    enabled: !!code,
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
