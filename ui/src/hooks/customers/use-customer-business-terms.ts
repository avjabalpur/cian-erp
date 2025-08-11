import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { CustomerBusinessTerms, CreateCustomerBusinessTermsData, UpdateCustomerBusinessTermsData } from '@/types/customer-business-terms';

// Get customer business terms by customer ID
export const useCustomerBusinessTerms = (customerId: number) => {
  return useQuery({
    queryKey: ['customer-business-terms', customerId],
    queryFn: async (): Promise<CustomerBusinessTerms[]> => {
      const response = await api.get(`/customers/${customerId}/business-terms`);
      return response.data;
    },
    enabled: customerId > 0,
  });
};

// Get customer business term by ID
export const useCustomerBusinessTerm = (customerId: number, businessTermId: number) => {
  return useQuery({
    queryKey: ['customer-business-term', customerId, businessTermId],
    queryFn: async (): Promise<CustomerBusinessTerms> => {
      const response = await api.get(`/customers/${customerId}/business-terms/${businessTermId}`);
      return response.data;
    },
    enabled: customerId > 0 && businessTermId > 0,
  });
};

// Create customer business term
export const useCreateCustomerBusinessTerm = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ customerId, data }: { customerId: number; data: CreateCustomerBusinessTermsData }): Promise<CustomerBusinessTerms> => {
      const response = await api.post(`/customers/${customerId}/business-terms`, data);
      return response.data;
    },
    onSuccess: (_, { customerId }) => {
      queryClient.invalidateQueries({ queryKey: ['customer-business-terms', customerId] });
    },
  });
};

// Update customer business term
export const useUpdateCustomerBusinessTerm = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ customerId, businessTermId, data }: { customerId: number; businessTermId: number; data: UpdateCustomerBusinessTermsData }): Promise<CustomerBusinessTerms> => {
      const response = await api.put(`/customers/${customerId}/business-terms/${businessTermId}`, data);
      return response.data;
    },
    onSuccess: (_, { customerId }) => {
      queryClient.invalidateQueries({ queryKey: ['customer-business-terms', customerId] });
    },
  });
};

// Delete customer business term
export const useDeleteCustomerBusinessTerm = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ customerId, businessTermId }: { customerId: number; businessTermId: number }): Promise<void> => {
      await api.delete(`/customers/${customerId}/business-terms/${businessTermId}`);
    },
    onSuccess: (_, { customerId }) => {
      queryClient.invalidateQueries({ queryKey: ['customer-business-terms', customerId] });
    },
  });
};
