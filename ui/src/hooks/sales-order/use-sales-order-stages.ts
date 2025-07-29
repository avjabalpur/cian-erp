import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';
import type { 
  SalesOrderStage,
  CreateSalesOrderStageData
} from '../../types/sales-order-extended';

// --- Sales Order Stages API Functions ---

const getStagesBySalesOrder = async (salesOrderId: number): Promise<SalesOrderStage[]> => {
  const { data } = await api.get(`/sales-order/${salesOrderId}/stages`);
  return data;
};

const createSalesOrderStage = async (salesOrderId: number, stageData: CreateSalesOrderStageData): Promise<SalesOrderStage> => {
  const { data } = await api.post(`/sales-order/${salesOrderId}/stages`, stageData);
  return data;
};

const updateSalesOrderStage = async (salesOrderId: number, stageId: number, stageData: CreateSalesOrderStageData): Promise<void> => {
  await api.put(`/sales-order/${salesOrderId}/stages/${stageId}`, stageData);
};

const deleteSalesOrderStage = async (salesOrderId: number, stageId: number): Promise<void> => {
  await api.delete(`/sales-order/${salesOrderId}/stages/${stageId}`);
};

const approveStage = async (salesOrderId: number, stageName: string): Promise<void> => {
  await api.post(`/sales-order/${salesOrderId}/stages/${encodeURIComponent(stageName)}/approve`);
};

const rejectStage = async (salesOrderId: number, stageName: string): Promise<void> => {
  await api.post(`/sales-order/${salesOrderId}/stages/${encodeURIComponent(stageName)}/reject`);
};


// --- Sales Order Stages Hooks ---

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
    onSuccess: (_, { salesOrderId }) => {
      queryClient.invalidateQueries({ queryKey: ['sales-order-stages', salesOrderId] });
    },
  });
};

export const useUpdateSalesOrderStage = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { salesOrderId: number; stageId: number; data: CreateSalesOrderStageData }>({
    mutationFn: ({ salesOrderId, stageId, data }) => updateSalesOrderStage(salesOrderId, stageId, data),
    onSuccess: (_, { salesOrderId }) => {
      queryClient.invalidateQueries({ queryKey: ['sales-order-stages', salesOrderId] });
    },
  });
};

export const useDeleteSalesOrderStage = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { salesOrderId: number; stageId: number }>({
    mutationFn: ({ salesOrderId, stageId }) => deleteSalesOrderStage(salesOrderId, stageId),
    onSuccess: (_, { salesOrderId }) => {
      queryClient.invalidateQueries({ queryKey: ['sales-order-stages', salesOrderId] });
    },
  });
};

export const useApproveStage = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { salesOrderId: number; stageName: string }>({
    mutationFn: ({ salesOrderId, stageName }) => approveStage(salesOrderId, stageName),
    onSuccess: (_, { salesOrderId }) => {
      queryClient.invalidateQueries({ queryKey: ['sales-order-stages', salesOrderId] });
    },
  });
};

export const useRejectStage = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { salesOrderId: number; stageName: string }>({
    mutationFn: ({ salesOrderId, stageName }) => rejectStage(salesOrderId, stageName),
    onSuccess: (_, { salesOrderId }) => {
      queryClient.invalidateQueries({ queryKey: ['sales-order-stages', salesOrderId] });
    },
  });
}; 