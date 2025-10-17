import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import {
  SalesOrder,
  SalesOrderWithApprovals,
  SalesOrderStage,
  CreateSalesOrderData,
  UpdateSalesOrderData,
  SalesOrderFilter,
} from '../types';
import { PaginatedResponse } from '@/types/common';

// --- API Functions ---
const getSalesOrdersWithApprovals = async (filter?: SalesOrderFilter): Promise<PaginatedResponse<SalesOrderWithApprovals>> => {
  const params = new URLSearchParams();
  if (filter?.search) params.append('search', filter.search);
  if (filter?.soStatus) params.append('soStatus', filter.soStatus);
  if (filter?.paymentTerm) params.append('paymentTerm', filter.paymentTerm);
  if (filter?.currentStatus) params.append('currentStatus', filter.currentStatus);
  if (filter?.isSubmitted !== undefined) params.append('isSubmitted', filter.isSubmitted.toString());
  if (filter?.fromDate) params.append('fromDate', filter.fromDate);
  if (filter?.toDate) params.append('toDate', filter.toDate);
  if (filter?.sortBy) params.append('sortBy', filter.sortBy);
  if (filter?.sortOrder) params.append('sortOrder', filter.sortOrder);
  if (filter?.pageNumber) params.append('page', filter.pageNumber.toString());
  if (filter?.pageSize) params.append('pageSize', filter.pageSize.toString());

  const { data } = await api.get(`/sales-order?${params.toString()}`);
  
  // Fetch approval stages for each sales order
  const salesOrdersWithApprovals = await Promise.all(
    data.items.map(async (salesOrder: SalesOrder) => {
      try {
        const { data: stages } = await api.get(`/sales-order/${salesOrder.id}/stages`);
        
        const approvalData: Partial<SalesOrderWithApprovals> = {
          costingApproved: null,
          qaApproved: null,
          isFinalAuthorized: null,
          designerApproved: null,
          finalQaApproved: null,
          pmApproved: null,
        };
        
        stages.forEach((stage: SalesOrderStage) => {
          switch (stage.stageName.toLowerCase()) {
            case 'costing':
            case 'costing approval':
              approvalData.costingApproved = stage.isApproved;
              break;
            case 'qa':
            case 'qa approval':
              approvalData.qaApproved = stage.isApproved;
              break;
            case 'final authorization':
            case 'final authorized':
              approvalData.isFinalAuthorized = stage.isApproved;
              break;
            case 'designer':
            case 'designer approval':
              approvalData.designerApproved = stage.isApproved;
              break;
            case 'final qa':
            case 'qa final':
            case 'final qa approval':
              approvalData.finalQaApproved = stage.isApproved;
              break;
            case 'pm':
            case 'pm approval':
              approvalData.pmApproved = stage.isApproved;
              break;
          }
        });
        
        return { ...salesOrder, ...approvalData };
      } catch (error) {
        console.error(`Failed to fetch stages for sales order ${salesOrder.id}:`, error);
        return { ...salesOrder, costingApproved: null, qaApproved: null, isFinalAuthorized: null, designerApproved: null, finalQaApproved: null, pmApproved: null };
      }
    })
  );
  
  return {
    ...data,
    items: salesOrdersWithApprovals,
  };
};

const getSalesOrderById = async (id: number): Promise<SalesOrder> => {
  const { data } = await api.get(`/sales-order/${id}`);
  return data;
};

const createSalesOrder = async (salesOrderData: CreateSalesOrderData): Promise<SalesOrder> => {
  const { data } = await api.post('/sales-order', salesOrderData);
  return data;
};

const updateSalesOrder = async (id: number, salesOrderData: UpdateSalesOrderData): Promise<SalesOrder> => {
  const { data } = await api.put(`/sales-order/${id}`, salesOrderData);
  return data;
};

const deleteSalesOrder = async (id: number): Promise<void> => {
  await api.delete(`/sales-order/${id}`);
};

// --- React Query Hooks ---
export const useSalesOrdersWithApprovals = (filter?: SalesOrderFilter) => {
  return useQuery<PaginatedResponse<SalesOrderWithApprovals>, Error>({
    queryKey: ['sales-orders-with-approvals', filter],
    queryFn: () => getSalesOrdersWithApprovals(filter),
  });
};

export const useSalesOrderById = (id: number) => {
  return useQuery<SalesOrder, Error>({
    queryKey: ['sales-order', id],
    queryFn: () => getSalesOrderById(id),
    enabled: !!id,
  });
};

export const useCreateSalesOrder = () => {
  const queryClient = useQueryClient();
  return useMutation<SalesOrder, Error, CreateSalesOrderData>({
    mutationFn: createSalesOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales-orders-with-approvals'] });
    },
  });
};

export const useUpdateSalesOrder = () => {
  const queryClient = useQueryClient();
  return useMutation<SalesOrder, Error, { id: number; data: UpdateSalesOrderData }>({
    mutationFn: ({ id, data }) => updateSalesOrder(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['sales-orders-with-approvals'] });
      queryClient.invalidateQueries({ queryKey: ['sales-order', id] });
    },
  });
};

export const useDeleteSalesOrder = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: deleteSalesOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales-orders-with-approvals'] });
    },
  });
};

