import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { CustomerBankingDetails, CreateCustomerBankingDetailsData, UpdateCustomerBankingDetailsData } from '@/types/customer-banking-details';

// Get customer banking details by customer ID
export const useCustomerBankingDetails = (customerId: number) => {
  return useQuery({
    queryKey: ['customer-banking-details', customerId],
    queryFn: async (): Promise<CustomerBankingDetails[]> => {
      const response = await api.get(`/customers/${customerId}/banking-details`);
      return response.data;
    },
    enabled: customerId > 0,
  });
};

// Get customer banking detail by ID
export const useCustomerBankingDetail = (customerId: number, bankingDetailId: number) => {
  return useQuery({
    queryKey: ['customer-banking-detail', customerId, bankingDetailId],
    queryFn: async (): Promise<CustomerBankingDetails> => {
      const response = await api.get(`/customers/${customerId}/banking-details/${bankingDetailId}`);
      return response.data;
    },
    enabled: customerId > 0 && bankingDetailId > 0,
  });
};

// Create customer banking detail
export const useCreateCustomerBankingDetail = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ customerId, data }: { customerId: number; data: CreateCustomerBankingDetailsData }): Promise<CustomerBankingDetails> => {
      const response = await api.post(`/customers/${customerId}/banking-details`, data);
      return response.data;
    },
    onSuccess: (_, { customerId }) => {
      queryClient.invalidateQueries({ queryKey: ['customer-banking-details', customerId] });
    },
  });
};

// Update customer banking detail
export const useUpdateCustomerBankingDetail = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ customerId, bankingDetailId, data }: { customerId: number; bankingDetailId: number; data: UpdateCustomerBankingDetailsData }): Promise<CustomerBankingDetails> => {
      const response = await api.put(`/customers/${customerId}/banking-details/${bankingDetailId}`, data);
      return response.data;
    },
    onSuccess: (_, { customerId }) => {
      queryClient.invalidateQueries({ queryKey: ['customer-banking-details', customerId] });
    },
  });
};

// Delete customer banking detail
export const useDeleteCustomerBankingDetail = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ customerId, bankingDetailId }: { customerId: number; bankingDetailId: number }): Promise<void> => {
      await api.delete(`/customers/${customerId}/banking-details/${bankingDetailId}`);
    },
    onSuccess: (_, { customerId }) => {
      queryClient.invalidateQueries({ queryKey: ['customer-banking-details', customerId] });
    },
  });
};
