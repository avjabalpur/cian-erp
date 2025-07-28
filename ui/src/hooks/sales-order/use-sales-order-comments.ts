import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';
import type { 
  SalesOrderComment, 
  CreateSalesOrderCommentData,
} from '../../types/sales-order-extended';

// --- Sales Order Comments API Functions ---
const getCommentsBySalesOrder = async (salesOrderId: number): Promise<SalesOrderComment[]> => {
  const { data } = await api.get(`/sales-order/${salesOrderId}/comments`);
  return data;
};

const createSalesOrderComment = async (salesOrderId: number, commentData: CreateSalesOrderCommentData): Promise<SalesOrderComment> => {
  const { data } = await api.post(`/sales-order/${salesOrderId}/comments`, commentData);
  return data;
};

const updateSalesOrderComment = async (salesOrderId: number, commentId: number, commentData: CreateSalesOrderCommentData): Promise<void> => {
  await api.put(`/sales-order/${salesOrderId}/comments/${commentId}`, commentData);
};

const deleteSalesOrderComment = async (salesOrderId: number, commentId: number): Promise<void> => {
  await api.delete(`/sales-order/${salesOrderId}/comments/${commentId}`);
};

// --- Sales Order Comments Hooks ---
export const useCommentsBySalesOrder = (salesOrderId: number) => {
  return useQuery<SalesOrderComment[], Error>({
    queryKey: ['sales-order-comments-by-sales-order', salesOrderId],
    queryFn: () => getCommentsBySalesOrder(salesOrderId),
    enabled: !!salesOrderId,
  });
};

export const useCreateSalesOrderComment = () => {
  const queryClient = useQueryClient();
  return useMutation<SalesOrderComment, Error, { salesOrderId: number; data: CreateSalesOrderCommentData }>({
    mutationFn: ({ salesOrderId, data }) => createSalesOrderComment(salesOrderId, data),
    onSuccess: (_, { salesOrderId }) => {
      queryClient.invalidateQueries({ queryKey: ['sales-order-comments-by-sales-order', salesOrderId] });
    },
  });
};

export const useUpdateSalesOrderComment = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { salesOrderId: number; commentId: number; data: CreateSalesOrderCommentData }>({ 
    mutationFn: ({ salesOrderId, commentId, data }) => updateSalesOrderComment(salesOrderId, commentId, data),
    onSuccess: (_, { salesOrderId }) => {
      queryClient.invalidateQueries({ queryKey: ['sales-order-comments-by-sales-order', salesOrderId] });
    },
  });
};

export const useDeleteSalesOrderComment = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { salesOrderId: number; commentId: number }>({
    mutationFn: ({ salesOrderId, commentId }) => deleteSalesOrderComment(salesOrderId, commentId),
    onSuccess: (_, { salesOrderId }) => {
      queryClient.invalidateQueries({ queryKey: ['sales-order-comments-by-sales-order', salesOrderId] });
    },
  });
};

