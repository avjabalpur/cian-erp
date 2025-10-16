import { PropertyPair } from '@/types/property';

export interface ItemMaster {
  id: number;
  itemCode: string;
  revNo?: string;
  itemTypeId: number;
  subType?: number;
  gsInd?: string;
  goodsType?: string;
  itemName: string;
  shortName?: string;
  pharmacopoeiaName?: string;
  unitOfMeasure?: string;
  issuingUnit?: string;
  uomIssConvFactor?: number;
  uomUqcConvFactor?: number;
  drawingRef?: string;
  stdAssayStrength?: number;
  shelfLifeMonths?: number;
  shelfLifeDays?: number;
  stdRate?: number;
  leadTimeDays?: number;
  stdLossOnDry?: number;
  safetyStock?: number;
  boughtOut: boolean;
  jobWork: boolean;
  imported: boolean;
  currentBuyer?: string;
  economicOrderQty?: number;
  desiredPackSize?: number;
  taxCreditApplicable: boolean;
  freightOn?: string;
  manufactured: boolean;
  allowedAllergenPercent?: number;
  stdMfgFeesPerUnit?: number;
  mainProdCentre?: string;
  sold: boolean;
  keyProduct: boolean;
  exported: boolean;
  productType?: string;
  salesDivision?: string;
  productGroup?: string;
  conversionFactor?: number;
  vendorPartNo?: string;
  batchNotApplicable: boolean;
  qcRequired: boolean;
  allergen: boolean;
  mfgDateApplicable: boolean;
  expiryDateApplicable: boolean;
  trackSerialNos: boolean;
  packingFreightInsuranceServices: boolean;
  activeIngredient: boolean;
  mfgLocNameRequired: boolean;
  mfgMmYyyyApplicable: boolean;
  expiryMmYyyyApplicable: boolean;
  principalForStatutoryReporting: boolean;
  createdAt?: string;
  createdBy?: number;
  updatedAt?: string;
  updatedBy?: number;
  isDeleted: boolean;
  specification?: ItemSpecification;
  boughtOutDetails?: ItemBoughtOutDetails;
  salesDetail?: ItemSalesDetail;
  stockAnalysis?: ItemStockAnalysis;
  exportDetails?: ItemExportDetails;
  otherDetails?: ItemOtherDetail;
  media?: ItemMedia[];
  properties?: PropertyPair[];
}

export interface ItemSpecification {
  id: number;
  itemId: number;
  specification: string;
  createdOn: string;
  createdBy: number;
  updatedAt?: string;
  updatedBy?: number;
}

export interface ItemBoughtOutDetails {
  id: number;
  itemId: number;
  purchaseBasedOn?: string;
  excessPlanningPercent?: number;
  reorderLevel?: number;
  minStockLevel?: number;
  maxStockLevel?: number;
  minBalanceShelfLifeDays?: number;
  customDutyPercent?: number;
  igstPercent?: number;
  swsPercent?: number;
  maxPurchaseRate?: number;
  stopProcurement: boolean;
}

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
  createdAt?: string;
  updatedAt?: string;
  createdBy?: number;
  updatedBy?: number;
}

export interface ItemStockAnalysis {
  id: number;
  itemId: number;
  abcConsumptionValue?: string;
  xyzStockValue?: string;
  fsnMovement?: string;
  vedAnalysis?: string;
  createdAt: string;
  updatedAt?: string;
  createdBy?: number;
  updatedBy?: number;
}

export interface ItemOtherDetail {
  id: number;
  itemId: number;
  itemName?: string;
  detailName: string;
  detailValue?: string;
  detailType: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
  createdBy?: number;
  createdByName?: string;
  updatedBy?: number;
  updatedByName?: string;
}

export interface ItemExportDetails {
  id: number;
  itemId: number;
  itemDescriptionForExports: string;
  exportProductGroupCode: string;
  exportProductGroupName: string;
  depbRateListSrlNo: string;
  depbRate?: string;
  depbValueCap?: string;
  depbRemarks: string;
  dutyDrawbackSrlNo: string;
  dutyDrawbackRate?: string;
  dutyDrawbackRateType: string;
  dutyDrawbackValueCap?: string;
  dutyDrawbackRemarks: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: number;
  updatedBy?: number;
}

export interface ItemMedia {
  id: number;
  itemId: number;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  uploadedAt: string;
  uploadedBy?: number;
}

// Create/Update Types
export interface CreateItemMasterData {
  itemCode: string;
  revNo?: string;
  itemTypeId: number;
  subType?: number;
  gsInd?: string;
  goodsType?: string;
  itemName: string;
  shortName?: string;
  pharmacopoeiaName?: string;
  unitOfMeasure?: string;
  issuingUnit?: string;
  uomIssConvFactor?: number;
  uomUqcConvFactor?: number;
  drawingRef?: string;
  stdAssayStrength?: number;
  shelfLifeMonths?: number;
  shelfLifeDays?: number;
  stdRate?: number;
  leadTimeDays?: number;
  stdLossOnDry?: number;
  safetyStock?: number;
  boughtOut?: boolean;
  jobWork?: boolean;
  imported?: boolean;
  currentBuyer?: string;
  economicOrderQty?: number;
  desiredPackSize?: number;
  taxCreditApplicable?: boolean;
  freightOn?: string;
  manufactured?: boolean;
  allowedAllergenPercent?: number;
  stdMfgFeesPerUnit?: number;
  mainProdCentre?: string;
  sold?: boolean;
  keyProduct?: boolean;
  exported?: boolean;
  productType?: string;
  salesDivision?: string;
  productGroup?: string;
  conversionFactor?: number;
  vendorPartNo?: string;
  batchNotApplicable?: boolean;
  qcRequired?: boolean;
  allergen?: boolean;
  mfgDateApplicable?: boolean;
  expiryDateApplicable?: boolean;
  trackSerialNos?: boolean;
  packingFreightInsuranceServices?: boolean;
  activeIngredient?: boolean;
  mfgLocNameRequired?: boolean;
  mfgMmYyyyApplicable?: boolean;
  expiryMmYyyyApplicable?: boolean;
  principalForStatutoryReporting?: boolean;
  specification?: CreateItemSpecificationData;
  boughtOutDetails?: CreateItemBoughtOutDetailsData;
  salesDetail?: CreateItemSalesDetailData;
  stockAnalysis?: CreateItemStockAnalysisData;
  exportDetails?: CreateItemExportDetailsData;
  otherDetails?: CreateItemOtherDetailData;
  properties?: PropertyPair[];
}

export type UpdateItemMasterData = CreateItemMasterData;

export interface CreateItemSpecificationData {
  specification: string;
}

export type UpdateItemSpecificationData = CreateItemSpecificationData;

export interface CreateItemBoughtOutDetailsData {
  purchaseBasedOn?: string;
  excessPlanningPercent?: number;
  reorderLevel?: number;
  minStockLevel?: number;
  maxStockLevel?: number;
  minBalanceShelfLifeDays?: number;
  customDutyPercent?: number;
  igstPercent?: number;
  swsPercent?: number;
  maxPurchaseRate?: number;
  stopProcurement?: boolean;
}

export type UpdateItemBoughtOutDetailsData = CreateItemBoughtOutDetailsData;

export interface CreateItemSalesDetailData {
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

export type UpdateItemSalesDetailData = CreateItemSalesDetailData;

export interface CreateItemStockAnalysisData {
  itemId: number;
  abcConsumptionValue?: string;
  xyzStockValue?: string;
  fsnMovement?: string;
  vedAnalysis?: string;
}

export type UpdateItemStockAnalysisData = CreateItemStockAnalysisData;

export interface CreateItemOtherDetailData {
  itemId: number;
  detailName: string;
  detailValue?: string;
  detailType: string;
  description?: string;
  isActive?: boolean;
}

export type UpdateItemOtherDetailData = CreateItemOtherDetailData;

export interface CreateItemExportDetailsData {
  itemId: number;
  itemDescriptionForExports: string;
  exportProductGroupCode: string;
  exportProductGroupName: string;
  depbRateListSrlNo: string;
  depbRate?: string;
  depbValueCap?: string;
  depbRemarks: string;
  dutyDrawbackSrlNo: string;
  dutyDrawbackRate?: string;
  dutyDrawbackRateType: string;
  dutyDrawbackValueCap?: string;
  dutyDrawbackRemarks: string;
}

export type UpdateItemExportDetailsData = CreateItemExportDetailsData;

export interface ItemMasterFilter {
  search?: string;
  itemCode?: string;
  itemName?: string;
  shortName?: string;
  revNo?: string;
  itemTypeId?: number;
  subType?: number;
  gsInd?: string;
  goodsType?: string;
  manufactured?: boolean;
  qcRequired?: boolean;
  boughtOut?: boolean;
  sold?: boolean;
  sortBy?: string;
  sortDescending?: boolean;
  pageNumber?: number;
  pageSize?: number;
}

// Item Code Sequence Types
export interface CreateItemCodeSequenceData {
  itemCode: string;
}

export interface ItemCodeSequenceResponse {
  id: number;
  itemCode: string;
}

