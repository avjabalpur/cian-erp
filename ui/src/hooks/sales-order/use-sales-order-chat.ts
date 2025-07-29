import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';
import type { 
  SalesOrderChat, 
  CreateSalesOrderChatData,
} from '../../types/sales-order-extended';

const getChatMessagesBySalesOrder = async (salesOrderId: number): Promise<SalesOrderChat[]> => {
  const { data } = await api.get(`/sales-order/${salesOrderId}/chat`);
  return data;
};

const createSalesOrderChatMessage = async (salesOrderId: number, chatData: CreateSalesOrderChatData): Promise<SalesOrderChat> => {
  const { data } = await api.post(`/sales-order/${salesOrderId}/chat`, chatData);
  return data;
};

const updateSalesOrderChatMessage = async (salesOrderId: number, chatId: number, chatData: CreateSalesOrderChatData): Promise<void> => {
  await api.put(`/sales-order/${salesOrderId}/chat/${chatId}`, chatData);
};

const deleteSalesOrderChatMessage = async (salesOrderId: number, chatId: number): Promise<void> => {
  await api.delete(`/sales-order/${salesOrderId}/chat/${chatId}`);
};

// --- Sales Order Chat Hooks ---

export const useChatMessagesBySalesOrder = (salesOrderId: number) => {
  return useQuery<SalesOrderChat[], Error>({
    queryKey: ['sales-order-chat-by-sales-order', salesOrderId],
    queryFn: () => getChatMessagesBySalesOrder(salesOrderId),
    enabled: !!salesOrderId,
  });
};

export const useCreateSalesOrderChatMessage = () => {
  const queryClient = useQueryClient();
  return useMutation<SalesOrderChat, Error, { salesOrderId: number; data: CreateSalesOrderChatData }>({
    mutationFn: ({ salesOrderId, data }) => createSalesOrderChatMessage(salesOrderId, data),
    onSuccess: (_, { salesOrderId }) => {
      queryClient.invalidateQueries({ queryKey: ['sales-order-chat-by-sales-order', salesOrderId] });
    },
  });
};

export const useUpdateSalesOrderChatMessage = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { salesOrderId: number; chatId: number; data: CreateSalesOrderChatData }>({ 
    mutationFn: ({ salesOrderId, chatId, data }) => updateSalesOrderChatMessage(salesOrderId, chatId, data),
    onSuccess: (_, { salesOrderId }) => {
      queryClient.invalidateQueries({ queryKey: ['sales-order-chat-by-sales-order', salesOrderId] });
    },
  });
};

export const useDeleteSalesOrderChatMessage = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { salesOrderId: number; chatId: number }>({
    mutationFn: ({ salesOrderId, chatId }) => deleteSalesOrderChatMessage(salesOrderId, chatId),
    onSuccess: (_, { salesOrderId }) => {
      queryClient.invalidateQueries({ queryKey: ['sales-order-chat-by-sales-order', salesOrderId] });
    },
  });
};