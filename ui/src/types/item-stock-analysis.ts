export interface ItemStockAnalysis {
  id: number;
  itemId: number;
  itemCode: string;
  itemName: string;
  currentStock: number;
  reorderLevel?: number;
  lastSaleDate?: string;
  lastPurchaseDate?: string;
  abcConsumptionValue?: string;
  xyzStockValue?: string;
  fsnMovement?: string;
  vedAnalysis?: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: number;
  updatedBy?: number;
}
