import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { CustomerTaxCompliance, CreateCustomerTaxComplianceData, UpdateCustomerTaxComplianceData } from '@/types/customer-tax-compliance';

// Get customer tax compliance by customer ID
export const useCustomerTaxCompliance = (customerId: number) => {
  return useQuery({
    queryKey: ['customer-tax-compliance', customerId],
    queryFn: async (): Promise<CustomerTaxCompliance[]> => {
      const response = await api.get(`/customers/${customerId}/tax-compliance`);
      return response.data;
    },
    enabled: customerId > 0,
  });
};

// Get customer tax compliance by ID
export const useCustomerTaxComplianceById = (customerId: number, taxComplianceId: number) => {
  return useQuery({
    queryKey: ['customer-tax-compliance-by-id', customerId, taxComplianceId],
    queryFn: async (): Promise<CustomerTaxCompliance> => {
      const response = await api.get(`/customers/${customerId}/tax-compliance/${taxComplianceId}`);
      return response.data;
    },
    enabled: customerId > 0 && taxComplianceId > 0,
  });
};

// Create customer tax compliance
export const useCreateCustomerTaxCompliance = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ customerId, data }: { customerId: number; data: CreateCustomerTaxComplianceData }): Promise<CustomerTaxCompliance> => {
      const response = await api.post(`/customers/${customerId}/tax-compliance`, data);
      return response.data;
    },
    onSuccess: (_, { customerId }) => {
      queryClient.invalidateQueries({ queryKey: ['customer-tax-compliance', customerId] });
    },
  });
};

// Update customer tax compliance
export const useUpdateCustomerTaxCompliance = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ customerId, taxComplianceId, data }: { customerId: number; taxComplianceId: number; data: UpdateCustomerTaxComplianceData }): Promise<CustomerTaxCompliance> => {
      const response = await api.put(`/customers/${customerId}/tax-compliance/${taxComplianceId}`, data);
      return response.data;
    },
    onSuccess: (_, { customerId }) => {
      queryClient.invalidateQueries({ queryKey: ['customer-tax-compliance', customerId] });
    },
  });
};

// Delete customer tax compliance
export const useDeleteCustomerTaxCompliance = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ customerId, taxComplianceId }: { customerId: number; taxComplianceId: number }): Promise<void> => {
      await api.delete(`/customers/${customerId}/tax-compliance/${taxComplianceId}`);
    },
    onSuccess: (_, { customerId }) => {
      queryClient.invalidateQueries({ queryKey: ['customer-tax-compliance', customerId] });
    },
  });
};
