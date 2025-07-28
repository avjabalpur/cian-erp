import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';
import type { 
 
  SalesOrderSaveTransaction,
  CreateSalesOrderSaveTransactionData,
} from '../../types/sales-order-extended';

// --- Sales Order Save Transactions API Functions ---
const getSalesOrderSaveTransactions = async (): Promise<SalesOrderSaveTransaction[]> => {
  const { data } = await api.get('/salesordersavetransaction');
  return data;
};

const getSalesOrderSaveTransactionById = async (id: number): Promise<SalesOrderSaveTransaction | null> => {
  if (!id) return null;
  const { data } = await api.get(`/salesordersavetransaction/${id}`);
  return data;
};

const createSalesOrderSaveTransaction = async (saveTransactionData: CreateSalesOrderSaveTransactionData): Promise<SalesOrderSaveTransaction> => {
  const { data } = await api.post('/salesordersavetransaction', saveTransactionData);
  return data;
};

const updateSalesOrderSaveTransaction = async ({ id, ...saveTransactionData }: { id: number; data: CreateSalesOrderSaveTransactionData }): Promise<void> => {
  await api.put(`/salesordersavetransaction/${id}`, saveTransactionData.data);
};

const deleteSalesOrderSaveTransaction = async (id: number): Promise<void> => {
  await api.delete(`/salesordersavetransaction/${id}`);
};

const getSaveTransactionsBySalesOrder = async (salesOrderId: number): Promise<SalesOrderSaveTransaction[]> => {
  const { data } = await api.get(`/salesordersavetransaction/sales-order/${salesOrderId}`);
  return data;
};


// --- Sales Order Save Transactions Hooks ---

export const useSalesOrderSaveTransactions = () => {
  return useQuery<SalesOrderSaveTransaction[], Error>({
    queryKey: ['sales-order-save-transactions'],
    queryFn: getSalesOrderSaveTransactions,
  });
};

export const useSalesOrderSaveTransactionById = (id: number) => {
  return useQuery<SalesOrderSaveTransaction | null, Error>({
    queryKey: ['sales-order-save-transaction', id],
    queryFn: () => getSalesOrderSaveTransactionById(id),
    enabled: !!id,
  });
};

export const useCreateSalesOrderSaveTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation<SalesOrderSaveTransaction, Error, CreateSalesOrderSaveTransactionData>({
    mutationFn: createSalesOrderSaveTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales-order-save-transactions'] });
    },
  });
};

export const useUpdateSalesOrderSaveTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { id: number; data: CreateSalesOrderSaveTransactionData }>({ 
    mutationFn: updateSalesOrderSaveTransaction,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['sales-order-save-transactions'] });
      queryClient.invalidateQueries({ queryKey: ['sales-order-save-transaction', variables.id] });
    },
  });
};

export const useDeleteSalesOrderSaveTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: deleteSalesOrderSaveTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales-order-save-transactions'] });
    },
  });
};

export const useSaveTransactionsBySalesOrder = (salesOrderId: number) => {
  return useQuery<SalesOrderSaveTransaction[], Error>({
    queryKey: ['sales-order-save-transactions', salesOrderId],
    queryFn: () => getSaveTransactionsBySalesOrder(salesOrderId),
    enabled: !!salesOrderId,
  });
};

