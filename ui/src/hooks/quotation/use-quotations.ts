"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { SalesOrderQuotation, CreateSalesOrderQuotationData } from "@/types/sales-order-extended";

export interface QuotationFilters {
  from_time?: string;
  to_time?: string;
  created_by?: number[];
  customer_name?: string;
  company_name?: string;
  search?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface QuotationsResponse {
  data: SalesOrderQuotation[];
  totalCount?: number;
  pageCount?: number;
}

// Get all quotations with filters
export function useQuotations(filters: QuotationFilters = {}) {
  return useQuery({
    queryKey: ["quotations", filters],
    queryFn: async (): Promise<QuotationsResponse> => {
      const response = await api.post("/get-all-quotations", {
        from_time: filters.from_time || "",
        to_time: filters.to_time || "",
        created_by: filters.created_by || [],
        customer_name: filters.customer_name || "",
        company_name: filters.company_name || "ANY",
      });
      
      // Transform the data to match our interface
      const transformedData = response.data.data.map((item: any) => ({
        id: item.quotation_id,
        organizationName: item.company_name,
        quotationNumber: item.quotation_number,
        quotationDate: item.quotation_date,
        customerName: item.customer_name,
        totalAmount: item.total_amount,
        advanceAmount: item.advance_amount,
        createdByName: item.created_by_username,
        createdAt: item.created_time,
        isDeleted: false,
      }));

      return {
        data: transformedData,
        totalCount: transformedData.length,
        pageCount: Math.ceil(transformedData.length / (filters.pageSize || 10)),
      };
    },
  });
}

// Get quotation by ID
export function useQuotationById(quotationId: string) {
  return useQuery({
    queryKey: ["quotation", quotationId],
    queryFn: async (): Promise<SalesOrderQuotation> => {
      const response = await api.get(`/get-sales-order-approval-quotation-by-id?quotation_id=${quotationId}`);
      
      const item = response.data.data;
      // Transform charges from JSON string if needed
      const charges = typeof item.charges === 'string' ? JSON.parse(item.charges || '{}') : item.charges;
      
      return {
        id: item.quotation_id,
        organizationId: item.organization_id,
        organizationName: item.company_name,
        quotationNumber: item.quotation_number,
        quotationDate: item.quotation_date,
        customerId: item.customer_id,
        customerName: item.customer_name,
        advancePercentage: item.advance_percentage,
        charges: JSON.stringify(charges),
        totalAmount: item.total_amount,
        advanceAmount: item.advance_amount,
        prevCopyQuotationId: item.prev_copy_quotation_id,
        products: item.products || [],
        isDeleted: false,
        createdAt: item.created_time,
        createdBy: item.created_by,
      };
    },
    enabled: !!quotationId && quotationId !== "0",
  });
}

// Get quotations related to a sales order
export function useQuotationsBySalesOrder(salesOrderId: number) {
  return useQuery({
    queryKey: ["quotations", "sales-order", salesOrderId],
    queryFn: async (): Promise<SalesOrderQuotation[]> => {
      const response = await api.get(`/get-related-quotations-by-so-approval-id?sales_order_approval_id=${salesOrderId}`);
      
      return response.data.data.map((item: any) => ({
        id: item.quotation_id,
        quotationNumber: item.quotation_number,
        quotationDate: item.quotation_date,
        customerName: item.customer_name,
        totalAmount: item.total_amount,
        advanceAmount: item.advance_amount,
        createdByName: item.created_by_username,
        createdAt: item.created_time,
        isDeleted: false,
      }));
    },
    enabled: !!salesOrderId,
  });
}

// Create quotation
export function useCreateQuotation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post("/create-quotation", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quotations"] });
    },
  });
}

// Update quotation
export function useUpdateQuotation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<SalesOrderQuotation> }) => {
      const response = await api.put(`/quotations/${id}`, data);
      return response.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["quotations"] });
      queryClient.invalidateQueries({ queryKey: ["quotation", id] });
    },
  });
}

// Delete quotation
export function useDeleteQuotation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/quotations/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quotations"] });
    },
  });
}
