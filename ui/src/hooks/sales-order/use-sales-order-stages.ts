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

// --- Sales Order Chat Hooks ---

export const useChatMessagesBySalesOrder = (salesOrderId: number) => {
  return useQuery<any[], Error>({
    queryKey: ['sales-order-chat-by-sales-order', salesOrderId],
    queryFn: () => getChatMessagesBySalesOrder(salesOrderId),
    enabled: !!salesOrderId,
  });
};

export const useCreateSalesOrderChatMessage = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, { salesOrderId: number; data: any }>({
    mutationFn: ({ salesOrderId, data }) => createSalesOrderChatMessage(salesOrderId, data),
    onSuccess: (_, { salesOrderId }) => {
      queryClient.invalidateQueries({ queryKey: ['sales-order-chat-by-sales-order', salesOrderId] });
    },
  });
};

export const useUpdateSalesOrderChatMessage = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { salesOrderId: number; chatId: number; data: any }>({ 
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

// --- Sales Order Documents Hooks ---

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

// --- Sales Order Performa Invoices Hooks ---

export const useSalesOrderPerformaInvoices = () => {
  return useQuery<SalesOrderPerformaInvoice[], Error>({
    queryKey: ['sales-order-performa-invoices'],
    queryFn: getSalesOrderPerformaInvoices,
  });
};

export const useSalesOrderPerformaInvoiceById = (id: number) => {
  return useQuery<SalesOrderPerformaInvoice | null, Error>({
    queryKey: ['sales-order-performa-invoice', id],
    queryFn: () => getSalesOrderPerformaInvoiceById(id),
    enabled: !!id,
  });
};

export const useCreateSalesOrderPerformaInvoice = () => {
  const queryClient = useQueryClient();
  return useMutation<SalesOrderPerformaInvoice, Error, CreateSalesOrderPerformaInvoiceData>({
    mutationFn: createSalesOrderPerformaInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales-order-performa-invoices'] });
    },
  });
};

export const useUpdateSalesOrderPerformaInvoice = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { id: number; data: CreateSalesOrderPerformaInvoiceData }>({ 
    mutationFn: updateSalesOrderPerformaInvoice,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['sales-order-performa-invoices'] });
      queryClient.invalidateQueries({ queryKey: ['sales-order-performa-invoice', variables.id] });
    },
  });
};

export const useDeleteSalesOrderPerformaInvoice = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: deleteSalesOrderPerformaInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales-order-performa-invoices'] });
    },
  });
};

export const usePerformaInvoiceByNumber = (invoiceNumber: string) => {
  return useQuery<SalesOrderPerformaInvoice | null, Error>({
    queryKey: ['sales-order-performa-invoice-by-number', invoiceNumber],
    queryFn: () => getPerformaInvoiceByNumber(invoiceNumber),
    enabled: !!invoiceNumber,
  });
};

export const usePerformaInvoicesBySalesOrder = (salesOrderId: number) => {
  return useQuery<SalesOrderPerformaInvoice[], Error>({
    queryKey: ['sales-order-performa-invoices-by-sales-order', salesOrderId],
    queryFn: () => getPerformaInvoicesBySalesOrder(salesOrderId),
    enabled: !!salesOrderId,
  });
};

// --- Sales Order Performa Invoice Items Hooks ---

export const usePerformaInvoiceItemsByPerformaInvoice = (performaInvoiceId: number) => {
  return useQuery<SalesOrderPerformaInvoiceItem[], Error>({
    queryKey: ['sales-order-performa-invoice-items-by-performa-invoice', performaInvoiceId],
    queryFn: () => getPerformaInvoiceItemsByPerformaInvoice(performaInvoiceId),
    enabled: !!performaInvoiceId,
  });
};

export const useCreateSalesOrderPerformaInvoiceItem = () => {
  const queryClient = useQueryClient();
  return useMutation<SalesOrderPerformaInvoiceItem, Error, { performaInvoiceId: number; data: CreateSalesOrderPerformaInvoiceItemData }>({
    mutationFn: ({ performaInvoiceId, data }) => createSalesOrderPerformaInvoiceItem(performaInvoiceId, data),
    onSuccess: (_, { performaInvoiceId }) => {
      queryClient.invalidateQueries({ queryKey: ['sales-order-performa-invoice-items-by-performa-invoice', performaInvoiceId] });
    },
  });
};

export const useUpdateSalesOrderPerformaInvoiceItem = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { performaInvoiceId: number; itemId: number; data: CreateSalesOrderPerformaInvoiceItemData }>({ 
    mutationFn: ({ performaInvoiceId, itemId, data }) => updateSalesOrderPerformaInvoiceItem(performaInvoiceId, itemId, data),
    onSuccess: (_, { performaInvoiceId }) => {
      queryClient.invalidateQueries({ queryKey: ['sales-order-performa-invoice-items-by-performa-invoice', performaInvoiceId] });
    },
  });
};

export const useDeleteSalesOrderPerformaInvoiceItem = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { performaInvoiceId: number; itemId: number }>({
    mutationFn: ({ performaInvoiceId, itemId }) => deleteSalesOrderPerformaInvoiceItem(performaInvoiceId, itemId),
    onSuccess: (_, { performaInvoiceId }) => {
      queryClient.invalidateQueries({ queryKey: ['sales-order-performa-invoice-items-by-performa-invoice', performaInvoiceId] });
    },
  });
};

// --- Sales Order Quotations Hooks ---

export const useSalesOrderQuotations = () => {
  return useQuery<SalesOrderQuotation[], Error>({
    queryKey: ['sales-order-quotations'],
    queryFn: getSalesOrderQuotations,
  });
};

export const useSalesOrderQuotationById = (id: number) => {
  return useQuery<SalesOrderQuotation | null, Error>({
    queryKey: ['sales-order-quotation', id],
    queryFn: () => getSalesOrderQuotationById(id),
    enabled: !!id,
  });
};

export const useCreateSalesOrderQuotation = () => {
  const queryClient = useQueryClient();
  return useMutation<SalesOrderQuotation, Error, CreateSalesOrderQuotationData>({
    mutationFn: createSalesOrderQuotation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales-order-quotations'] });
    },
  });
};

export const useUpdateSalesOrderQuotation = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { id: number; data: CreateSalesOrderQuotationData }>({ 
    mutationFn: updateSalesOrderQuotation,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['sales-order-quotations'] });
      queryClient.invalidateQueries({ queryKey: ['sales-order-quotation', variables.id] });
    },
  });
};

export const useDeleteSalesOrderQuotation = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: deleteSalesOrderQuotation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales-order-quotations'] });
    },
  });
};

export const useQuotationByNumber = (quotationNumber: string) => {
  return useQuery<SalesOrderQuotation | null, Error>({
    queryKey: ['sales-order-quotation-by-number', quotationNumber],
    queryFn: () => getQuotationByNumber(quotationNumber),
    enabled: !!quotationNumber,
  });
};

export const useQuotationsByCustomer = (customerId: number) => {
  return useQuery<SalesOrderQuotation[], Error>({
    queryKey: ['sales-order-quotations-by-customer', customerId],
    queryFn: () => getQuotationsByCustomer(customerId),
    enabled: !!customerId,
  });
};

export const useQuotationsByOrganization = (organizationId: number) => {
  return useQuery<SalesOrderQuotation[], Error>({
    queryKey: ['sales-order-quotations-by-organization', organizationId],
    queryFn: () => getQuotationsByOrganization(organizationId),
    enabled: !!organizationId,
  });
};

export const useQuotationsByDateRange = (startDate: string, endDate: string) => {
  return useQuery<SalesOrderQuotation[], Error>({
    queryKey: ['sales-order-quotations-by-date-range', startDate, endDate],
    queryFn: () => getQuotationsByDateRange(startDate, endDate),
    enabled: !!(startDate && endDate),
  });
};

// --- Sales Order Quotation Items Hooks ---

export const useQuotationItemsByQuotation = (quotationId: number) => {
  return useQuery<SalesOrderQuotationItem[], Error>({
    queryKey: ['sales-order-quotation-items-by-quotation', quotationId],
    queryFn: () => getQuotationItemsByQuotation(quotationId),
    enabled: !!quotationId,
  });
};

export const useCreateSalesOrderQuotationItem = () => {
  const queryClient = useQueryClient();
  return useMutation<SalesOrderQuotationItem, Error, { quotationId: number; data: CreateSalesOrderQuotationItemData }>({
    mutationFn: ({ quotationId, data }) => createSalesOrderQuotationItem(quotationId, data),
    onSuccess: (_, { quotationId }) => {
      queryClient.invalidateQueries({ queryKey: ['sales-order-quotation-items-by-quotation', quotationId] });
    },
  });
};

export const useUpdateSalesOrderQuotationItem = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { quotationId: number; itemId: number; data: CreateSalesOrderQuotationItemData }>({ 
    mutationFn: ({ quotationId, itemId, data }) => updateSalesOrderQuotationItem(quotationId, itemId, data),
    onSuccess: (_, { quotationId }) => {
      queryClient.invalidateQueries({ queryKey: ['sales-order-quotation-items-by-quotation', quotationId] });
    },
  });
};

export const useDeleteSalesOrderQuotationItem = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { quotationId: number; itemId: number }>({
    mutationFn: ({ quotationId, itemId }) => deleteSalesOrderQuotationItem(quotationId, itemId),
    onSuccess: (_, { quotationId }) => {
      queryClient.invalidateQueries({ queryKey: ['sales-order-quotation-items-by-quotation', quotationId] });
    },
  });
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