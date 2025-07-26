export interface ItemSalesDetail {
  id: number;
  itemMasterId: number;
  sellingPrice?: number;
  discountPercentage?: number;
  minSaleQty?: number;
  maxSaleQty?: number;
}

export type CreateItemSalesDetailData = Omit<ItemSalesDetail, 'id'>;

export type UpdateItemSalesDetailData = Partial<CreateItemSalesDetailData>;
