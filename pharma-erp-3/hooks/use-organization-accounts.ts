import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import { OrganizationAccount, CreateOrganizationAccountData, UpdateOrganizationAccountData } from '../types/organization-account';

// --- API Functions ---

const getOrganizationAccounts = async (): Promise<OrganizationAccount[]> => {
  const { data } = await api.get('/OrganizationAccount');
  return data;
};

const getOrganizationAccountById = async (id: number): Promise<OrganizationAccount | null> => {
  if (!id) return null;
  const { data } = await api.get(`/OrganizationAccount/${id}`);
  return data;
};

const createOrganizationAccount = async (organizationAccountData: CreateOrganizationAccountData): Promise<OrganizationAccount> => {
  const { data } = await api.post('/OrganizationAccount', organizationAccountData);
  return data;
};

const updateOrganizationAccount = async ({ id, ...organizationAccountData }: { id: number; data: UpdateOrganizationAccountData }): Promise<OrganizationAccount> => {
  const { data } = await api.put(`/OrganizationAccount/${id}`, organizationAccountData.data);
  return data;
};

const deleteOrganizationAccount = async (id: number): Promise<void> => {
  await api.delete(`/OrganizationAccount/${id}`);
};


// --- Custom Hooks ---

export const useOrganizationAccounts = () => {
  return useQuery<OrganizationAccount[], Error>({
    queryKey: ['organizationAccounts'],
    queryFn: getOrganizationAccounts,
  });
};

export const useOrganizationAccountById = (id: number) => {
  return useQuery<OrganizationAccount | null, Error>({
    queryKey: ['organizationAccount', id],
    queryFn: () => getOrganizationAccountById(id),
    enabled: !!id,
  });
};

export const useCreateOrganizationAccount = () => {
  const queryClient = useQueryClient();
  return useMutation<OrganizationAccount, Error, CreateOrganizationAccountData>({
    mutationFn: createOrganizationAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizationAccounts'] });
    },
  });
};

export const useUpdateOrganizationAccount = () => {
  const queryClient = useQueryClient();
  return useMutation<OrganizationAccount, Error, { id: number; data: UpdateOrganizationAccountData }>({ 
    mutationFn: updateOrganizationAccount,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['organizationAccounts'] });
      queryClient.invalidateQueries({ queryKey: ['organizationAccount', variables.id] });
    },
  });
};

export const useDeleteOrganizationAccount = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: deleteOrganizationAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizationAccounts'] });
    },
  });
};
