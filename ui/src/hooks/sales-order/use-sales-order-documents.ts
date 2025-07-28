import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';
import type { 
  
  SalesOrderDocument,
  CreateSalesOrderDocumentData,
} from '../../types/sales-order-extended';

const getDocumentsBySalesOrder = async (salesOrderId: number): Promise<SalesOrderDocument[]> => {
  const { data } = await api.get(`/sales-order/${salesOrderId}/documents`);
  return data;
};

const createSalesOrderDocument = async (salesOrderId: number, documentData: CreateSalesOrderDocumentData): Promise<SalesOrderDocument> => {
  const { data } = await api.post(`/sales-order/${salesOrderId}/documents`, documentData);
  return data;
};

const updateSalesOrderDocument = async (salesOrderId: number, documentId: number, documentData: CreateSalesOrderDocumentData): Promise<void> => {
  await api.put(`/sales-order/${salesOrderId}/documents/${documentId}`, documentData);
};

const deleteSalesOrderDocument = async (salesOrderId: number, documentId: number): Promise<void> => {
  await api.delete(`/sales-order/${salesOrderId}/documents/${documentId}`);
};


export const useDocumentsBySalesOrder = (salesOrderId: number) => {
  return useQuery<SalesOrderDocument[], Error>({
    queryKey: ['sales-order-documents-by-sales-order', salesOrderId],
    queryFn: () => getDocumentsBySalesOrder(salesOrderId),
    enabled: !!salesOrderId,
  });
};

export const useCreateSalesOrderDocument = () => {
  const queryClient = useQueryClient();
  return useMutation<SalesOrderDocument, Error, { salesOrderId: number; data: CreateSalesOrderDocumentData }>({
    mutationFn: ({ salesOrderId, data }) => createSalesOrderDocument(salesOrderId, data),
    onSuccess: (_, { salesOrderId }) => {
      queryClient.invalidateQueries({ queryKey: ['sales-order-documents-by-sales-order', salesOrderId] });
    },
  });
};

export const useUpdateSalesOrderDocument = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { salesOrderId: number; documentId: number; data: CreateSalesOrderDocumentData }>({ 
    mutationFn: ({ salesOrderId, documentId, data }) => updateSalesOrderDocument(salesOrderId, documentId, data),
    onSuccess: (_, { salesOrderId }) => {
      queryClient.invalidateQueries({ queryKey: ['sales-order-documents-by-sales-order', salesOrderId] });
    },
  });
};

export const useDeleteSalesOrderDocument = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { salesOrderId: number; documentId: number }>({
    mutationFn: ({ salesOrderId, documentId }) => deleteSalesOrderDocument(salesOrderId, documentId),
    onSuccess: (_, { salesOrderId }) => {
      queryClient.invalidateQueries({ queryKey: ['sales-order-documents-by-sales-order', salesOrderId] });
    },
  });
};