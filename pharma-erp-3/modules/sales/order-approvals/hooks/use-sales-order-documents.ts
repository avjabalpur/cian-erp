import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { SalesOrderDocument, CreateSalesOrderDocumentData } from '../types/sales-order-extended.types';

// Get all documents for a sales order
const getDocumentsBySalesOrder = async (salesOrderId: number): Promise<SalesOrderDocument[]> => {
  const { data } = await api.get(`/sales-order/${salesOrderId}/documents`);
  return data;
};

// Upload a new document
const uploadSalesOrderDocument = async (salesOrderId: number, formData: FormData): Promise<SalesOrderDocument> => {
  const { data } = await api.post(`/sales-order/${salesOrderId}/documents`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};

// Delete a document
const deleteSalesOrderDocument = async (salesOrderId: number, documentId: number): Promise<void> => {
  await api.delete(`/sales-order/${salesOrderId}/documents/${documentId}`);
};

// Custom Hooks

export const useDocumentsBySalesOrder = (salesOrderId: number) => {
  return useQuery<SalesOrderDocument[], Error>({
    queryKey: ['sales-order-documents', salesOrderId],
    queryFn: () => getDocumentsBySalesOrder(salesOrderId),
    enabled: !!salesOrderId,
  });
};

export const useUploadSalesOrderDocument = () => {
  const queryClient = useQueryClient();
  return useMutation<SalesOrderDocument, Error, { salesOrderId: number; formData: FormData }>({
    mutationFn: ({ salesOrderId, formData }) => uploadSalesOrderDocument(salesOrderId, formData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['sales-order-documents', variables.salesOrderId] });
    },
  });
};

export const useDeleteSalesOrderDocument = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { salesOrderId: number; documentId: number }>({
    mutationFn: ({ salesOrderId, documentId }) => deleteSalesOrderDocument(salesOrderId, documentId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['sales-order-documents', variables.salesOrderId] });
    },
  });
};

