import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import { Customer, CreateCustomerData, UpdateCustomerData } from '../types/customer';

// --- API Functions ---

const getCustomers = async (): Promise<Customer[]> => {
  const { data } = await api.get('/customers');
  return data;
};

const getCustomerById = async (id: number): Promise<Customer | null> => {
  if (!id) return null;
  const { data } = await api.get(`/customers/${id}`);
  return data;
};

const createCustomer = async (customerData: CreateCustomerData): Promise<Customer> => {
  const { data } = await api.post('/customers', customerData);
  return data;
};

const updateCustomer = async ({ id, ...customerData }: { id: number; data: UpdateCustomerData }): Promise<Customer> => {
  const { data } = await api.put(`/customers/${id}`, customerData.data);
  return data;
};

const deleteCustomer = async (id: number): Promise<void> => {
  await api.delete(`/customers/${id}`);
};


// --- Custom Hooks ---

export const useCustomers = () => {
  return useQuery<Customer[], Error>({
    queryKey: ['customers'],
    queryFn: getCustomers,
  });
};

export const useCustomerById = (id: number) => {
  return useQuery<Customer | null, Error>({
    queryKey: ['customer', id],
    queryFn: () => getCustomerById(id),
    enabled: !!id,
  });
};

export const useCreateCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation<Customer, Error, CreateCustomerData>({
    mutationFn: createCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
};

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation<Customer, Error, { id: number; data: UpdateCustomerData }>({
    mutationFn: updateCustomer,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['customer', variables.id] });
    },
  });
};

export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: deleteCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
};

