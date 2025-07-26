import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import { SalesOrder, CreateSalesOrderData, UpdateSalesOrderData } from '../types/sales-order';

// --- API Functions ---

const getSalesOrders = async (): Promise<SalesOrder[]> => {
  const { data } = await api.get('/sales-order');
  return data;
};

const getSalesOrderById = async (id: string): Promise<SalesOrder | null> => {
  if (!id) return null;
  const { data } = await api.get(`/sales-order/${id}`);
  return data;
};

const createSalesOrder = async (salesOrderData: CreateSalesOrderData): Promise<SalesOrder> => {
  const { data } = await api.post('/sales-order', salesOrderData);
  return data;
};

const updateSalesOrder = async ({ id, ...salesOrderData }: { id: string; data: UpdateSalesOrderData }): Promise<SalesOrder> => {
  const { data } = await api.put(`/sales-order/${id}`, salesOrderData.data);
  return data;
};

const deleteSalesOrder = async (id: string): Promise<void> => {
  await api.delete(`/sales-order/${id}`);
};

const getSalesOrdersByStatus = async (status: string): Promise<SalesOrder[]> => {
  const { data } = await api.get(`/sales-order/status/${status}`);
  return data;
};

const getSalesOrdersByCustomer = async (customerId: number): Promise<SalesOrder[]> => {
  const { data } = await api.get(`/sales-order/customer/${customerId}`);
  return data;
};

const getSalesOrdersByOrganization = async (organizationId: number): Promise<SalesOrder[]> => {
  const { data } = await api.get(`/sales-order/organization/${organizationId}`);
  return data;
};

const getSalesOrdersByDateRange = async (startDate: string, endDate: string): Promise<SalesOrder[]> => {
  const { data } = await api.get(`/sales-order/date-range?startDate=${startDate}&endDate=${endDate}`);
  return data;
};

// --- Custom Hooks ---

export const useSalesOrders = ({ pageNumber = 1, pageSize = 10, status, search, customerId, organizationId, fromDate, toDate, sortBy, sortOrder }: any = {}) => {
  return useQuery<SalesOrder[], Error>({
    queryKey: ['sales-orders', { pageNumber, pageSize, status, search, customerId, organizationId, fromDate, toDate, sortBy, sortOrder }],
    queryFn: getSalesOrders,
  });
};

export const useSalesOrderById = (id: string) => {
  return useQuery<SalesOrder | null, Error>({
    queryKey: ['sales-order', id],
    queryFn: () => getSalesOrderById(id),
    enabled: !!id,
  });
};

export const useCreateSalesOrder = () => {
  const queryClient = useQueryClient();
  return useMutation<SalesOrder, Error, CreateSalesOrderData>({
    mutationFn: createSalesOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales-orders'] });
    },
  });
};

export const useUpdateSalesOrder = () => {
  const queryClient = useQueryClient();
  return useMutation<SalesOrder, Error, { id: string; data: UpdateSalesOrderData }>({ 
    mutationFn: updateSalesOrder,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['sales-orders'] });
      queryClient.invalidateQueries({ queryKey: ['sales-order', variables.id] });
    },
  });
};

export const useDeleteSalesOrder = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: deleteSalesOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales-orders'] });
    },
  });
};

export const useSalesOrdersByStatus = (status: string) => {
  return useQuery<SalesOrder[], Error>({
    queryKey: ['sales-orders-by-status', status],
    queryFn: () => getSalesOrdersByStatus(status),
    enabled: !!status,
  });
};

export const useSalesOrdersByCustomer = (customerId: number) => {
  return useQuery<SalesOrder[], Error>({
    queryKey: ['sales-orders-by-customer', customerId],
    queryFn: () => getSalesOrdersByCustomer(customerId),
    enabled: !!customerId,
  });
};

export const useSalesOrdersByOrganization = (organizationId: number) => {
  return useQuery<SalesOrder[], Error>({
    queryKey: ['sales-orders-by-organization', organizationId],
    queryFn: () => getSalesOrdersByOrganization(organizationId),
    enabled: !!organizationId,
  });
};

export const useSalesOrdersByDateRange = (startDate: string, endDate: string) => {
  return useQuery<SalesOrder[], Error>({
    queryKey: ['sales-orders-by-date-range', startDate, endDate],
    queryFn: () => getSalesOrdersByDateRange(startDate, endDate),
    enabled: !!(startDate && endDate),
  });
}; 