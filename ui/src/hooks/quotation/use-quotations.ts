"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useQueryState } from "nuqs";
import api from "@/lib/api";
import { SalesOrderQuotation, CreateSalesOrderQuotationData } from "@/types/sales-order-extended";

export interface QuotationFilters {
  from_time?: string;
  to_time?: string;
  created_by?: number;
  customer_name?: string;
  company_name?: string;
  search?: string;
  status?: string;
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

// --- API Functions ---

const getQuotations = async (params: QuotationFilters): Promise<QuotationsResponse> => {
  // Build query parameters
  const queryParams = new URLSearchParams();
  
  if (params.search) queryParams.append('search', params.search);
  if (params.company_name && params.company_name !== "ANY") queryParams.append('companyName', params.company_name);
  if (params.customer_name) queryParams.append('customerName', params.customer_name);
  if (params.status) queryParams.append('status', params.status);
  if (params.created_by) queryParams.append('createdBy', params.created_by.toString());
  if (params.from_time) queryParams.append('fromDate', params.from_time);
  if (params.to_time) queryParams.append('toDate', params.to_time);
  if (params.sortBy) queryParams.append('sortBy', params.sortBy);
  if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString());
  
  const queryString = queryParams.toString();
  const url = queryString ? `/sales-order-quotation?${queryString}` : '/sales-order-quotation';
  
  const response = await api.get(url);
  
  // Transform the data to match our interface
  const transformedData = response.data.Items.map((item: any) => ({
    id: item.id,
    organizationName: item.companyName,
    quotationNumber: item.quotationNumber,
    quotationDate: item.quotationDate,
    customerName: item.customerName,
    totalAmount: item.totalAmount,
    advanceAmount: item.advanceAmount,
    createdByName: item.createdByName || "Unknown",
    createdAt: item.createdAt,
    isDeleted: false,
  }));

  return {
    data: transformedData,
    totalCount: response.data.TotalCount || 0,
    pageCount: Math.ceil((response.data.TotalCount || 0) / (params.pageSize || 10)),
  };
};

const getQuotationById = async (quotationId: string): Promise<SalesOrderQuotation> => {
  if (!quotationId || quotationId === "0") {
    throw new Error("Invalid quotation ID");
  }
  
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
};

const getQuotationsBySalesOrder = async (salesOrderId: number): Promise<SalesOrderQuotation[]> => {
  if (!salesOrderId) {
    throw new Error("Invalid sales order ID");
  }
  
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
};

const createQuotation = async (data: any): Promise<any> => {
  const response = await api.post("/create-quotation", data);
  return response.data;
};

const updateQuotation = async ({ id, data }: { id: string; data: Partial<SalesOrderQuotation> }): Promise<any> => {
  const response = await api.put(`/quotations/${id}`, data);
  return response.data;
};

const deleteQuotation = async (id: string): Promise<void> => {
  await api.delete(`/quotations/${id}`);
};

// --- Custom Hooks ---

export const useQuotations = () => {
  // Get filter values from URL
  const [search] = useQueryState("search");
  const [companyName] = useQueryState("companyName");
  const [customerName] = useQueryState("customerName");
  const [status] = useQueryState("status");
  const [createdBy] = useQueryState("createdBy");
  const [fromDate] = useQueryState("fromDate");
  const [toDate] = useQueryState("toDate");
  const [sortBy] = useQueryState("sortBy");
  const [sortOrder] = useQueryState("sortOrder");
  const [page] = useQueryState("page", { defaultValue: 1, parse: parseInt });
  const [pageSize] = useQueryState("pageSize", { defaultValue: 10, parse: parseInt });

  const filters: QuotationFilters = {
    from_time: fromDate ? new Date(fromDate).toISOString().split('T')[0] : "",
    to_time: toDate ? new Date(toDate).toISOString().split('T')[0] : "",
    created_by: createdBy ? parseInt(createdBy) : undefined,
    customer_name: customerName || "",
    company_name: companyName || "ANY",
    search: search || "",
    status: status || "",
    sortBy: sortBy || "created_at",
    sortOrder: (sortOrder as "asc" | "desc") || "desc",
    page: page || 1,
    pageSize: pageSize || 10,
  };

  return useQuery<QuotationsResponse, Error>({
    queryKey: ['quotations', filters],
    queryFn: () => getQuotations(filters),
  });
};

export const useQuotationById = (quotationId: string) => {
  return useQuery<SalesOrderQuotation, Error>({
    queryKey: ['quotation', quotationId],
    queryFn: () => getQuotationById(quotationId),
    enabled: !!quotationId && quotationId !== "0",
  });
};

export const useQuotationsBySalesOrder = (salesOrderId: number) => {
  return useQuery<SalesOrderQuotation[], Error>({
    queryKey: ['quotations', 'sales-order', salesOrderId],
    queryFn: () => getQuotationsBySalesOrder(salesOrderId),
    enabled: !!salesOrderId,
  });
};

export const useCreateQuotation = () => {
  const queryClient = useQueryClient();
  
  return useMutation<any, Error, any>({
    mutationFn: createQuotation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotations'] });
    },
  });
};

export const useUpdateQuotation = () => {
  const queryClient = useQueryClient();
  
  return useMutation<any, Error, { id: string; data: Partial<SalesOrderQuotation> }>({
    mutationFn: updateQuotation,
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['quotations'] });
      queryClient.invalidateQueries({ queryKey: ['quotation', id] });
    },
  });
};

export const useDeleteQuotation = () => {
  const queryClient = useQueryClient();
  
  return useMutation<void, Error, string>({
    mutationFn: deleteQuotation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotations'] });
    },
  });
};
