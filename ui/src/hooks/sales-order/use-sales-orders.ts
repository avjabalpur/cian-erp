import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';
import { SalesOrder, 
  CreateSalesOrderData,
   UpdateSalesOrderData } from '../../types/sales-order';

// --- API Functions ---

const getSalesOrders = async (params: any = {}): Promise<{ items: SalesOrder[]; totalCount: number }> => {
  const queryParams = new URLSearchParams();
  
  if (params.pageNumber) queryParams.append('page', params.pageNumber.toString());
  if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString());
  if (params.search) queryParams.append('search', params.search);
  if (params.status) queryParams.append('soStatus', params.status);
  if (params.paymentTerm) queryParams.append('paymentTerm', params.paymentTerm);
  if (params.currentStatus) queryParams.append('currentStatus', params.currentStatus);
  if (params.fromDate) queryParams.append('fromDate', params.fromDate);
  if (params.toDate) queryParams.append('toDate', params.toDate);
  if (params.sortBy) queryParams.append('sortBy', params.sortBy);
  if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
  
  const queryString = queryParams.toString();
  const url = queryString ? `/sales-order?${queryString}` : '/sales-order';
  
  const { data } = await api.get(url);
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

const createSalesOrderApproval = async (approvalData: { soStatus: string; dosageName: string }): Promise<{ id: number }> => {
  const { data } = await api.post('/sales-order/approval', approvalData);
  return data;
};

const updateSalesOrder = async ({ id, data }: { id: string; data: UpdateSalesOrderData }): Promise<SalesOrder> => {
  const { data: responseData } = await api.put(`/sales-order`, { ...data, id: parseInt(id) });
  return responseData;
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

export const useSalesOrders = (params: any = {}) => {
  return useQuery<{ items: SalesOrder[]; totalCount: number }, Error>({
    queryKey: ['sales-orders', params],
    queryFn: () => getSalesOrders(params),
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

export const useCreateSalesOrderApproval = () => {
  const queryClient = useQueryClient();
  return useMutation<{ id: number }, Error, { soStatus: string; dosageName: string }>({
    mutationFn: createSalesOrderApproval,
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
    queryKey: ['sales-orders', 'status', status],
    queryFn: () => getSalesOrdersByStatus(status),
    enabled: !!status,
  });
};

export const useSalesOrdersByCustomer = (customerId: number) => {
  return useQuery<SalesOrder[], Error>({
    queryKey: ['sales-orders', 'customer', customerId],
    queryFn: () => getSalesOrdersByCustomer(customerId),
    enabled: !!customerId,
  });
};

export const useSalesOrdersByOrganization = (organizationId: number) => {
  return useQuery<SalesOrder[], Error>({
    queryKey: ['sales-orders', 'organization', organizationId],
    queryFn: () => getSalesOrdersByOrganization(organizationId),
    enabled: !!organizationId,
  });
};

export const useSalesOrdersByDateRange = (startDate: string, endDate: string) => {
  return useQuery<SalesOrder[], Error>({
    queryKey: ['sales-orders', 'date-range', startDate, endDate],
    queryFn: () => getSalesOrdersByDateRange(startDate, endDate),
    enabled: !!startDate && !!endDate,
  });
}; 