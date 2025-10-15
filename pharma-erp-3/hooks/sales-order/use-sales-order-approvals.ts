import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';
import { SalesOrder } from '../../types/sales-order';
import { SalesOrderStage } from '../../types/sales-order-extended';

// Extended sales order interface with approval stages
export interface SalesOrderWithApprovals extends SalesOrder {
  // Approval stage fields
  costingApproved?: boolean | null;
  qaApproved?: boolean | null;
  isFinalAuthorized?: boolean | null;
  designerApproved?: boolean | null;
  finalQaApproved?: boolean | null;
  pmApproved?: boolean | null;
}

// API function to get sales orders with approval stages
const getSalesOrdersWithApprovals = async (params: any = {}): Promise<{ items: SalesOrderWithApprovals[]; totalCount: number }> => {
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
  
  // For each sales order, fetch its approval stages
  const salesOrdersWithApprovals = await Promise.all(
    data.items.map(async (salesOrder: SalesOrder) => {
      try {
        // Fetch approval stages for this sales order
        const { data: stages } = await api.get(`/sales-order/${salesOrder.id}/stages`);
        
        // Map stages to approval fields
        const approvalData: Partial<SalesOrderWithApprovals> = {
          costingApproved: null,
          qaApproved: null,
          isFinalAuthorized: null,
          designerApproved: null,
          finalQaApproved: null,
          pmApproved: null,
        };
        
        // Map stage names to approval fields
        stages.forEach((stage: SalesOrderStage) => {
          switch (stage.stageName.toLowerCase()) {
            case 'costing':
            case 'costing approval':
              approvalData.costingApproved = stage.isApproved;
              break;
            case 'qa':
            case 'qa approval':
              approvalData.qaApproved = stage.isApproved;
              break;
            case 'final authorization':
            case 'final authorized':
              approvalData.isFinalAuthorized = stage.isApproved;
              break;
            case 'designer':
            case 'designer approval':
              approvalData.designerApproved = stage.isApproved;
              break;
            case 'final qa':
            case 'qa final':
            case 'final qa approval':
              approvalData.finalQaApproved = stage.isApproved;
              break;
            case 'pm':
            case 'pm approval':
              approvalData.pmApproved = stage.isApproved;
              break;
          }
        });
        
        return {
          ...salesOrder,
          ...approvalData,
        };
      } catch (error) {
        // If stages fetch fails, return sales order without approval data
        console.error(`Failed to fetch stages for sales order ${salesOrder.id}:`, error);
        return {
          ...salesOrder,
          costingApproved: null,
          qaApproved: null,
          isFinalAuthorized: null,
          designerApproved: null,
          finalQaApproved: null,
          pmApproved: null,
        };
      }
    })
  );
  
  return {
    items: salesOrdersWithApprovals,
    totalCount: data.totalCount,
  };
};

// Hook to get sales orders with approval stages
export const useSalesOrdersWithApprovals = (params: any = {}) => {
  return useQuery<{ items: SalesOrderWithApprovals[]; totalCount: number }, Error>({
    queryKey: ['sales-orders-with-approvals', params],
    queryFn: () => getSalesOrdersWithApprovals(params),
  });
};

// Hook to get a single sales order with approval stages
export const useSalesOrderWithApprovals = (salesOrderId: number) => {
  return useQuery<SalesOrderWithApprovals | null, Error>({
    queryKey: ['sales-order-with-approvals', salesOrderId],
    queryFn: async () => {
      try {
        // Fetch sales order
        const { data: salesOrder } = await api.get(`/sales-order/${salesOrderId}`);
        
        // Fetch approval stages
        const { data: stages } = await api.get(`/sales-order/${salesOrderId}/stages`);
        
        // Map stages to approval fields
        const approvalData: Partial<SalesOrderWithApprovals> = {
          costingApproved: null,
          qaApproved: null,
          isFinalAuthorized: null,
          designerApproved: null,
          finalQaApproved: null,
          pmApproved: null,
        };
        
        // Map stage names to approval fields
        stages.forEach((stage: SalesOrderStage) => {
          switch (stage.stageName.toLowerCase()) {
            case 'costing':
            case 'costing approval':
              approvalData.costingApproved = stage.isApproved;
              break;
            case 'qa':
            case 'qa approval':
              approvalData.qaApproved = stage.isApproved;
              break;
            case 'final authorization':
            case 'final authorized':
              approvalData.isFinalAuthorized = stage.isApproved;
              break;
            case 'designer':
            case 'designer approval':
              approvalData.designerApproved = stage.isApproved;
              break;
            case 'final qa':
            case 'qa final':
            case 'final qa approval':
              approvalData.finalQaApproved = stage.isApproved;
              break;
            case 'pm':
            case 'pm approval':
              approvalData.pmApproved = stage.isApproved;
              break;
          }
        });
        
        return {
          ...salesOrder,
          ...approvalData,
        };
      } catch (error) {
        console.error(`Failed to fetch sales order with approvals ${salesOrderId}:`, error);
        return null;
      }
    },
    enabled: !!salesOrderId,
  });
}; 