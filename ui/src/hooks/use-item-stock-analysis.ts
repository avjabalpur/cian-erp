import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import { ItemStockAnalysis } from '../types/item-stock-analysis';

// --- API Function ---

const getItemStockAnalysis = async (): Promise<ItemStockAnalysis[]> => {
  const { data } = await api.get('/ItemStockAnalysis');
  return data;
};

// --- Custom Hook ---

export const useItemStockAnalysis = () => {
  return useQuery<ItemStockAnalysis[], Error>({
    queryKey: ['itemStockAnalysis'],
    queryFn: getItemStockAnalysis,
  });
};
