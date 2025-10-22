import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { SalesOrderStage, CreateSalesOrderStageData } from '../types/sales-order-extended.types';

// Get all stages for a sales order
const getStagesBySalesOrder = async (salesOrderId: number): Promise<SalesOrderStage[]> => {
  const { data } = await api.get(`/sales-order/${salesOrderId}/stages`);
  return data;
};

// Create a new stage
const createSalesOrderStage = async (salesOrderId: number, stageData: CreateSalesOrderStageData): Promise<SalesOrderStage> => {
  const { data } = await api.post(`/sales-order/${salesOrderId}/stages`, stageData);
  return data;
};

// Delete a stage
const deleteSalesOrderStage = async (salesOrderId: number, stageId: number): Promise<void> => {
  await api.delete(`/sales-order/${salesOrderId}/stages/${stageId}`);
};

// Approve a stage
const approveStage = async (salesOrderId: number, stageName: string): Promise<void> => {
  await api.post(`/sales-order/${salesOrderId}/stages/${encodeURIComponent(stageName)}/approve`);
};

// Reject a stage
const rejectStage = async (salesOrderId: number, stageName: string): Promise<void> => {
  await api.post(`/sales-order/${salesOrderId}/stages/${encodeURIComponent(stageName)}/reject`);
};

// Custom Hooks

export const useSalesOrderStages = (salesOrderId: number) => {
  return useQuery<SalesOrderStage[], Error>({
    queryKey: ['sales-order-stages', salesOrderId],
    queryFn: () => getStagesBySalesOrder(salesOrderId),
    enabled: !!salesOrderId,
  });
};

export const useCreateSalesOrderStage = () => {
  const queryClient = useQueryClient();
  return useMutation<SalesOrderStage, Error, { salesOrderId: number; data: CreateSalesOrderStageData }>({
    mutationFn: ({ salesOrderId, data }) => createSalesOrderStage(salesOrderId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['sales-order-stages', variables.salesOrderId] });
    },
  });
};

export const useDeleteSalesOrderStage = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { salesOrderId: number; stageId: number }>({
    mutationFn: ({ salesOrderId, stageId }) => deleteSalesOrderStage(salesOrderId, stageId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['sales-order-stages', variables.salesOrderId] });
    },
  });
};

export const useApproveStage = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { salesOrderId: number; stageName: string }>({
    mutationFn: ({ salesOrderId, stageName }) => approveStage(salesOrderId, stageName),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['sales-order-stages', variables.salesOrderId] });
      queryClient.invalidateQueries({ queryKey: ['sales-orders-with-approvals'] });
    },
  });
};

export const useRejectStage = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { salesOrderId: number; stageName: string }>({
    mutationFn: ({ salesOrderId, stageName }) => rejectStage(salesOrderId, stageName),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['sales-order-stages', variables.salesOrderId] });
      queryClient.invalidateQueries({ queryKey: ['sales-orders-with-approvals'] });
    },
  });
};

