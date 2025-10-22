import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { SalesOrderComment, CreateSalesOrderCommentData } from '../types/sales-order-extended.types';

// Get all comments for a sales order
const getCommentsBySalesOrder = async (salesOrderId: number): Promise<SalesOrderComment[]> => {
  const { data } = await api.get(`/sales-order/${salesOrderId}/comments`);
  return data;
};

// Create a new comment
const createSalesOrderComment = async (salesOrderId: number, commentData: CreateSalesOrderCommentData): Promise<SalesOrderComment> => {
  const { data } = await api.post(`/sales-order/${salesOrderId}/comments`, commentData);
  return data;
};

// Delete a comment
const deleteSalesOrderComment = async (salesOrderId: number, commentId: number): Promise<void> => {
  await api.delete(`/sales-order/${salesOrderId}/comments/${commentId}`);
};

// Custom Hooks

export const useCommentsBySalesOrder = (salesOrderId: number) => {
  return useQuery<SalesOrderComment[], Error>({
    queryKey: ['sales-order-comments', salesOrderId],
    queryFn: () => getCommentsBySalesOrder(salesOrderId),
    enabled: !!salesOrderId,
  });
};

export const useCreateSalesOrderComment = () => {
  const queryClient = useQueryClient();
  return useMutation<SalesOrderComment, Error, { salesOrderId: number; data: CreateSalesOrderCommentData }>({
    mutationFn: ({ salesOrderId, data }) => createSalesOrderComment(salesOrderId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['sales-order-comments', variables.salesOrderId] });
    },
  });
};

export const useDeleteSalesOrderComment = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { salesOrderId: number; commentId: number }>({
    mutationFn: ({ salesOrderId, commentId }) => deleteSalesOrderComment(salesOrderId, commentId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['sales-order-comments', variables.salesOrderId] });
    },
  });
};

