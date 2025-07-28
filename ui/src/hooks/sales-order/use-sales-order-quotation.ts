import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';
import type { 
  SalesOrderQuotation,
  CreateSalesOrderQuotationData,
  SalesOrderQuotationItem,
  CreateSalesOrderQuotationItemData,

} from '../../types/sales-order-extended';


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