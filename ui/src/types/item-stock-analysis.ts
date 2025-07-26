export interface ItemStockAnalysis {
  itemCode: string;
  itemName: string;
  currentStock: number;
  reorderLevel?: number;
  lastSaleDate?: string;
  lastPurchaseDate?: string;
}
