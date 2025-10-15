export interface ItemSalesDetail {
  id: number;
  itemId: number;
  packSizeApplicable: boolean;
  defaultPackSize?: string;
  saleableUnitContains?: string;
  qtyPerBox?: string;
  boxesPerCase?: string;
  casePackingType?: string;
  packingRate?: string;
  qtyPerCase?: string;
  netWeightCase?: string;
  tareWeightCase?: string;
  grossWeightCase?: string;
  grossWeightUnit?: string;
  caseDimensionsInches?: string;
  caseVolumeCft?: string;
  caseDimensionsCm?: string;
  caseVolumeCbm?: string;
  minSaleRate?: string;
  minSoQty?: string;
  tertiaryGtin?: string;
  secondaryGtin?: string;
  primaryGtin?: string;
  minBatchQtyAutoloading?: string;
  considerAsNewProductTill?: string;
  interfaceCode?: string;
  specs?: string;
}

export type CreateItemSalesDetailData = Omit<ItemSalesDetail, 'id'>;

export type UpdateItemSalesDetailData = Partial<CreateItemSalesDetailData>;
