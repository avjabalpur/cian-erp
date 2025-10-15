import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';
import type { 
  SalesOrderPerformaInvoice,
  CreateSalesOrderPerformaInvoiceData,
  SalesOrderPerformaInvoiceItem,
  CreateSalesOrderPerformaInvoiceItemData,
} from '../../types/sales-order-extended';


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

