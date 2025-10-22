import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { SalesOrderSaveTransaction } from '../types/sales-order-extended.types';

// Get all save transactions for a sales order
const getSaveTransactionsBySalesOrder = async (salesOrderId: number): Promise<SalesOrderSaveTransaction[]> => {
  const { data } = await api.get(`/sales-order/${salesOrderId}/save-transactions`);
  return data;
};

// Custom Hook

export const useSaveTransactionsBySalesOrder = (salesOrderId: number) => {
  return useQuery<SalesOrderSaveTransaction[], Error>({
    queryKey: ['sales-order-transactions', salesOrderId],
    queryFn: () => getSaveTransactionsBySalesOrder(salesOrderId),
    enabled: !!salesOrderId,
  });
};

