import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { 
  CustomerType, 
  CreateCustomerTypeData, 
  UpdateCustomerTypeData,
  PaginatedResponse 
} from "@/types/customer-master";

// Get customer types with pagination
export const useCustomerTypes = (filters: any = {}) => {
  return useQuery({
    queryKey: ["customer-types", filters],
    queryFn: async (): Promise<PaginatedResponse<CustomerType>> => {
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.append(key, value.toString());
        }
      });

      const response = await api.get(`/customer-types?${params.toString()}`);
      return response.data;
    },
  });
};

// Get single customer type by ID
export const useCustomerType = (id: number) => {
  return useQuery({
    queryKey: ["customer-type", id],
    queryFn: async (): Promise<CustomerType> => {
      const response = await api.get(`/customer-types/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};

// Create customer type
export const useCreateCustomerType = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateCustomerTypeData): Promise<CustomerType> => {
      const response = await api.post("/customer-types", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer-types"] });
    },
  });
};

// Update customer type
export const useUpdateCustomerType = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateCustomerTypeData }): Promise<CustomerType> => {
      const response = await api.put(`/customer-types/${id}`, data);
      return response.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["customer-types"] });
      queryClient.invalidateQueries({ queryKey: ["customer-type", id] });
    },
  });
};

// Delete customer type
export const useDeleteCustomerType = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number): Promise<void> => {
      await api.delete(`/customer-types/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer-types"] });
    },
  });
}; 