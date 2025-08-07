import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { CustomerAddress, CreateCustomerAddressData, UpdateCustomerAddressData } from '@/types/customer-address';

// Get customer addresses by customer ID
export const useCustomerAddresses = (customerId: number) => {
  return useQuery({
    queryKey: ['customer-addresses', customerId],
    queryFn: async (): Promise<CustomerAddress[]> => {
      const response = await api.get(`/customers/${customerId}/addresses`);
      return response.data;
    },
    enabled: customerId > 0,
  });
};

// Get customer address by ID
export const useCustomerAddress = (customerId: number, addressId: number) => {
  return useQuery({
    queryKey: ['customer-address', customerId, addressId],
    queryFn: async (): Promise<CustomerAddress> => {
      const response = await api.get(`/customers/${customerId}/addresses/${addressId}`);
      return response.data;
    },
    enabled: customerId > 0 && addressId > 0,
  });
};

// Create customer address
export const useCreateCustomerAddress = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ customerId, data }: { customerId: number; data: CreateCustomerAddressData }): Promise<CustomerAddress> => {
      const response = await api.post(`/customers/${customerId}/addresses`, data);
      return response.data;
    },
    onSuccess: (_, { customerId }) => {
      queryClient.invalidateQueries({ queryKey: ['customer-addresses', customerId] });
    },
  });
};

// Update customer address
export const useUpdateCustomerAddress = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ customerId, addressId, data }: { customerId: number; addressId: number; data: UpdateCustomerAddressData }): Promise<CustomerAddress> => {
      const response = await api.put(`/customers/${customerId}/addresses/${addressId}`, data);
      return response.data;
    },
    onSuccess: (_, { customerId }) => {
      queryClient.invalidateQueries({ queryKey: ['customer-addresses', customerId] });
    },
  });
};

// Delete customer address
export const useDeleteCustomerAddress = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ customerId, addressId }: { customerId: number; addressId: number }): Promise<void> => {
      await api.delete(`/customers/${customerId}/addresses/${addressId}`);
    },
    onSuccess: (_, { customerId }) => {
      queryClient.invalidateQueries({ queryKey: ['customer-addresses', customerId] });
    },
  });
};
