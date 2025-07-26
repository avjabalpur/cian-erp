import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import type { 
  SalesOrderComment, 
  CreateSalesOrderCommentData,
  SalesOrderQuotation,
  CreateSalesOrderQuotationData,
  SalesOrderSaveTransaction,
  CreateSalesOrderSaveTransactionData,
  SalesOrderDocument,
  CreateSalesOrderDocumentData,
  SalesOrderPerformaInvoice,
  CreateSalesOrderPerformaInvoiceData,
  SalesOrderPerformaInvoiceItem,
  CreateSalesOrderPerformaInvoiceItemData,
  SalesOrderQuotationItem,
  CreateSalesOrderQuotationItemData
} from '../types/sales-order-extended';

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

// --- Sales Order Chat API Functions ---

const getChatMessagesBySalesOrder = async (salesOrderId: number): Promise<any[]> => {
  const { data } = await api.get(`/sales-order/${salesOrderId}/chat`);
  return data;
};

const createSalesOrderChatMessage = async (salesOrderId: number, chatData: any): Promise<any> => {
  const { data } = await api.post(`/sales-order/${salesOrderId}/chat`, chatData);
  return data;
};

const updateSalesOrderChatMessage = async (salesOrderId: number, chatId: number, chatData: any): Promise<void> => {
  await api.put(`/sales-order/${salesOrderId}/chat/${chatId}`, chatData);
};

const deleteSalesOrderChatMessage = async (salesOrderId: number, chatId: number): Promise<void> => {
  await api.delete(`/sales-order/${salesOrderId}/chat/${chatId}`);
};

// --- Sales Order Documents API Functions ---

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

// --- Sales Order Performa Invoices API Functions ---

const getSalesOrderPerformaInvoices = async (): Promise<SalesOrderPerformaInvoice[]> => {
  const { data } = await api.get('/salesorderperformainvoice');
  return data;
};

const getSalesOrderPerformaInvoiceById = async (id: number): Promise<SalesOrderPerformaInvoice | null> => {
  if (!id) return null;
  const { data } = await api.get(`/salesorderperformainvoice/${id}`);
  return data;
};

const createSalesOrderPerformaInvoice = async (performaInvoiceData: CreateSalesOrderPerformaInvoiceData): Promise<SalesOrderPerformaInvoice> => {
  const { data } = await api.post('/salesorderperformainvoice', performaInvoiceData);
  return data;
};

const updateSalesOrderPerformaInvoice = async ({ id, ...performaInvoiceData }: { id: number; data: CreateSalesOrderPerformaInvoiceData }): Promise<void> => {
  await api.put(`/salesorderperformainvoice/${id}`, performaInvoiceData.data);
};

const deleteSalesOrderPerformaInvoice = async (id: number): Promise<void> => {
  await api.delete(`/salesorderperformainvoice/${id}`);
};

const getPerformaInvoiceByNumber = async (invoiceNumber: string): Promise<SalesOrderPerformaInvoice | null> => {
  const { data } = await api.get(`/salesorderperformainvoice/number/${invoiceNumber}`);
  return data;
};

const getPerformaInvoicesBySalesOrder = async (salesOrderId: number): Promise<SalesOrderPerformaInvoice[]> => {
  const { data } = await api.get(`/salesorderperformainvoice/sales-order/${salesOrderId}`);
  return data;
};

// --- Sales Order Performa Invoice Items API Functions ---

const getPerformaInvoiceItemsByPerformaInvoice = async (performaInvoiceId: number): Promise<SalesOrderPerformaInvoiceItem[]> => {
  const { data } = await api.get(`/salesorderperformainvoice/${performaInvoiceId}/items`);
  return data;
};

const createSalesOrderPerformaInvoiceItem = async (performaInvoiceId: number, itemData: CreateSalesOrderPerformaInvoiceItemData): Promise<SalesOrderPerformaInvoiceItem> => {
  const { data } = await api.post(`/salesorderperformainvoice/${performaInvoiceId}/items`, itemData);
  return data;
};

const updateSalesOrderPerformaInvoiceItem = async (performaInvoiceId: number, itemId: number, itemData: CreateSalesOrderPerformaInvoiceItemData): Promise<void> => {
  await api.put(`/salesorderperformainvoice/${performaInvoiceId}/items/${itemId}`, itemData);
};

const deleteSalesOrderPerformaInvoiceItem = async (performaInvoiceId: number, itemId: number): Promise<void> => {
  await api.delete(`/salesorderperformainvoice/${performaInvoiceId}/items/${itemId}`);
};

// --- Sales Order Quotations API Functions ---

const getSalesOrderQuotations = async (): Promise<SalesOrderQuotation[]> => {
  const { data } = await api.get('/salesorderquotation');
  return data;
};

const getSalesOrderQuotationById = async (id: number): Promise<SalesOrderQuotation | null> => {
  if (!id) return null;
  const { data } = await api.get(`/salesorderquotation/${id}`);
  return data;
};

const createSalesOrderQuotation = async (quotationData: CreateSalesOrderQuotationData): Promise<SalesOrderQuotation> => {
  const { data } = await api.post('/salesorderquotation', quotationData);
  return data;
};

const updateSalesOrderQuotation = async ({ id, ...quotationData }: { id: number; data: CreateSalesOrderQuotationData }): Promise<void> => {
  await api.put(`/salesorderquotation/${id}`, quotationData.data);
};

const deleteSalesOrderQuotation = async (id: number): Promise<void> => {
  await api.delete(`/salesorderquotation/${id}`);
};

const getQuotationByNumber = async (quotationNumber: string): Promise<SalesOrderQuotation | null> => {
  const { data } = await api.get(`/salesorderquotation/number/${quotationNumber}`);
  return data;
};

const getQuotationsByCustomer = async (customerId: number): Promise<SalesOrderQuotation[]> => {
  const { data } = await api.get(`/salesorderquotation/customer/${customerId}`);
  return data;
};

const getQuotationsByOrganization = async (organizationId: number): Promise<SalesOrderQuotation[]> => {
  const { data } = await api.get(`/salesorderquotation/organization/${organizationId}`);
  return data;
};

const getQuotationsByDateRange = async (startDate: string, endDate: string): Promise<SalesOrderQuotation[]> => {
  const { data } = await api.get(`/salesorderquotation/date-range?startDate=${startDate}&endDate=${endDate}`);
  return data;
};

// --- Sales Order Quotation Items API Functions ---

const getQuotationItemsByQuotation = async (quotationId: number): Promise<SalesOrderQuotationItem[]> => {
  const { data } = await api.get(`/salesorderquotation/${quotationId}/items`);
  return data;
};

const createSalesOrderQuotationItem = async (quotationId: number, itemData: CreateSalesOrderQuotationItemData): Promise<SalesOrderQuotationItem> => {
  const { data } = await api.post(`/salesorderquotation/${quotationId}/items`, itemData);
  return data;
};

const updateSalesOrderQuotationItem = async (quotationId: number, itemId: number, itemData: CreateSalesOrderQuotationItemData): Promise<void> => {
  await api.put(`/salesorderquotation/${quotationId}/items/${itemId}`, itemData);
};

const deleteSalesOrderQuotationItem = async (quotationId: number, itemId: number): Promise<void> => {
  await api.delete(`/salesorderquotation/${quotationId}/items/${itemId}`);
};

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
    queryKey: ['sales-order-save-transactions-by-sales-order', salesOrderId],
    queryFn: () => getSaveTransactionsBySalesOrder(salesOrderId),
    enabled: !!salesOrderId,
  });
}; 