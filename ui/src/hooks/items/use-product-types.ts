import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { ProductType, CreateProductTypeData, UpdateProductTypeData } from "@/types/product-type";

// Get all product types
export function useProductTypes() {
  return useQuery({
    queryKey: ["product-types"],
    queryFn: async () => {
      const response = await apiClient.get<ProductType[]>("/product-types");
      return response.data;
    },
  });
}

// Get active product types
export function useActiveProductTypes() {
  return useQuery({
    queryKey: ["product-types", "active"],
    queryFn: async () => {
      const response = await apiClient.get<ProductType[]>("/product-types/active");
      return response.data;
    },
  });
}

// Get parent product types
export function useParentProductTypes() {
  return useQuery({
    queryKey: ["product-types", "parent-types"],
    queryFn: async () => {
      const response = await apiClient.get<ProductType[]>("/product-types/parent-types");
      return response.data;
    },
  });
}

// Get product type by ID
export function useProductTypeById(id: string) {
  return useQuery({
    queryKey: ["product-types", id],
    queryFn: async () => {
      const response = await apiClient.get<ProductType>(`/product-types/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

// Create product type
export function useCreateProductType() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateProductTypeData) => {
      const response = await apiClient.post<ProductType>("/product-types", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-types"] });
    },
  });
}

// Update product type
export function useUpdateProductType() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateProductTypeData }) => {
      const response = await apiClient.put<ProductType>(`/product-types/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-types"] });
    },
  });
}

// Delete product type
export function useDeleteProductType() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      await apiClient.delete(`/product-types/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-types"] });
    },
  });
} 