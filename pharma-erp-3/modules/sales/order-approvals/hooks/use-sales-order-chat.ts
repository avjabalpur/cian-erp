import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { SalesOrderChat, CreateSalesOrderChatData } from '../types/sales-order-extended.types';

// Get all chat messages for a sales order
const getChatMessagesBySalesOrder = async (salesOrderId: number): Promise<SalesOrderChat[]> => {
  const { data } = await api.get(`/sales-order/${salesOrderId}/chat`);
  return data;
};

// Create a new chat message
const createSalesOrderChatMessage = async (salesOrderId: number, chatData: CreateSalesOrderChatData): Promise<SalesOrderChat> => {
  const { data } = await api.post(`/sales-order/${salesOrderId}/chat`, chatData);
  return data;
};

// Delete a chat message
const deleteSalesOrderChatMessage = async (salesOrderId: number, chatId: number): Promise<void> => {
  await api.delete(`/sales-order/${salesOrderId}/chat/${chatId}`);
};

// Custom Hooks

export const useChatMessagesBySalesOrder = (salesOrderId: number) => {
  return useQuery<SalesOrderChat[], Error>({
    queryKey: ['sales-order-chat', salesOrderId],
    queryFn: () => getChatMessagesBySalesOrder(salesOrderId),
    enabled: !!salesOrderId,
  });
};

export const useCreateSalesOrderChatMessage = () => {
  const queryClient = useQueryClient();
  return useMutation<SalesOrderChat, Error, { salesOrderId: number; data: CreateSalesOrderChatData }>({
    mutationFn: ({ salesOrderId, data }) => createSalesOrderChatMessage(salesOrderId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['sales-order-chat', variables.salesOrderId] });
    },
  });
};

export const useDeleteSalesOrderChatMessage = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { salesOrderId: number; chatId: number }>({
    mutationFn: ({ salesOrderId, chatId }) => deleteSalesOrderChatMessage(salesOrderId, chatId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['sales-order-chat', variables.salesOrderId] });
    },
  });
};

