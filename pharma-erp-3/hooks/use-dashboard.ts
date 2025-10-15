import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';

// Types
export interface DashboardStats {
  totalCustomers: number;
  totalItems: number;
  totalSalesOrders: number;
  recentCustomers: Array<{
    id: number;
    customerName: string;
    email: string;
    phone: string;
    createdAt: string;
  }>;
  recentItems: Array<{
    id: number;
    itemCode: string;
    itemName: string;
    itemType: string;
    isActive: boolean;
    createdAt: string;
  }>;
  recentSalesOrders: Array<{
    id: number;
    soNumber: string;
    customerName: string;
    soStatus: string;
    totalAmount: number;
    createdAt: string;
  }>;
}

// API Functions
const getDashboardStats = async (): Promise<DashboardStats> => {
  const { data } = await api.get('/dashboard/stats');
  return data;
};

// React Query Hooks
export const useDashboardStats = () => {
  return useQuery<DashboardStats, Error>({
    queryKey: ['dashboard-stats'],
    queryFn: getDashboardStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
}; 