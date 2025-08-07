import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { 
  Customer, 
  CreateCustomerData, 
  UpdateCustomerData, 
  CustomerMasterFilter,
  PaginatedResponse 
} from "@/types/customer-master";

// Get customers with pagination and filters
export const useCustomers = (filters: CustomerMasterFilter = {}) => {
  return useQuery({
    queryKey: ["customers", filters],
    queryFn: async (): Promise<PaginatedResponse<Customer>> => {
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.append(key, value.toString());
        }
      });

      const response = await api.get(`/customers?${params.toString()}`);
      return response.data;
    },
  });
};

// Get single customer by ID
export const useCustomer = (id: number) => {
  return useQuery({
    queryKey: ["customer", id],
    queryFn: async (): Promise<Customer> => {
      const response = await api.get(`/customers/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};

// Create customer
export const useCreateCustomer = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateCustomerData): Promise<Customer> => {
      const response = await api.post("/customers", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });
};

// Update customer
export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateCustomerData }): Promise<Customer> => {
      const response = await api.put(`/customers/${id}`, data);
      return response.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      queryClient.invalidateQueries({ queryKey: ["customer", id] });
    },
  });
};

// Delete customer
export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number): Promise<void> => {
      await api.delete(`/customers/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });
}; 