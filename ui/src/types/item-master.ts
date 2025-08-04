
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
}

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
}

export interface UpdateItemMasterData {
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
  specification?: UpdateItemSpecificationData;
  boughtOutDetails?: UpdateItemBoughtOutDetailsData;
  salesDetail?: UpdateItemSalesDetailData;
  stockAnalysis?: UpdateItemStockAnalysisData;
  exportDetails?: UpdateItemExportDetailsData;
  otherDetails?: UpdateItemOtherDetailData;
}

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
  pharmacopoeiaName?: string;
  unitOfMeasure?: string;
  issuingUnit?: string;
  drawingRef?: string;
  stdAssayStrength?: number;
  productType?: string;
  salesDivision?: string;
  productGroup?: string;
  vendorPartNo?: string;
  allergen?: boolean;
  activeIngredient?: boolean;
  packingFreightInsuranceServices?: boolean;
  boughtOut?: boolean;
  jobWork?: boolean;
  imported?: boolean;
  taxCreditApplicable?: boolean;
  manufactured?: boolean;
  sold?: boolean;
  keyProduct?: boolean;
  exported?: boolean;
  batchNotApplicable?: boolean;
  qcRequired?: boolean;
  mfgDateApplicable?: boolean;
  expiryDateApplicable?: boolean;
  trackSerialNos?: boolean;
  mfgLocNameRequired?: boolean;
  mfgMmYyyyApplicable?: boolean;
  expiryMmYyyyApplicable?: boolean;
  principalForStatutoryReporting?: boolean;
  minUomIssConvFactor?: number;
  maxUomIssConvFactor?: number;
  minUomUqcConvFactor?: number;
  maxUomUqcConvFactor?: number;
  minShelfLifeMonths?: number;
  maxShelfLifeMonths?: number;
  minShelfLifeDays?: number;
  maxShelfLifeDays?: number;
  minStdRate?: number;
  maxStdRate?: number;
  minLeadTimeDays?: number;
  maxLeadTimeDays?: number;
  minStdLossOnDry?: number;
  maxStdLossOnDry?: number;
  minSafetyStock?: number;
  maxSafetyStock?: number;
  minEconomicOrderQty?: number;
  maxEconomicOrderQty?: number;
  minDesiredPackSize?: number;
  maxDesiredPackSize?: number;
  minAllowedAllergenPercent?: number;
  maxAllowedAllergenPercent?: number;
  minStdMfgFeesPerUnit?: number;
  maxStdMfgFeesPerUnit?: number;
  minConversionFactor?: number;
  maxConversionFactor?: number;
  createdFrom?: string;
  createdTo?: string;
  updatedFrom?: string;
  updatedTo?: string;
  sortBy?: string;
  sortDescending?: boolean;
  pageNumber?: number;
  pageSize?: number;
  currentBuyer?: string;
  mainProdCentre?: string;
  freightOn?: string;
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

export interface CreateItemSpecificationData {
  specification: string;
}

export interface UpdateItemSpecificationData {
  specification: string;
}

// Item Bought Out Details
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

export interface UpdateItemBoughtOutDetailsData {
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

// Item Sales Detail
export interface ItemSalesDetail {
  id: number;
  itemId: number;
  sellingPrice?: number;
  currencyId?: number;
  isTaxInclusive: boolean;
  discountPercentage?: number;
  minimumOrderQuantity?: number;
  leadTimeDays?: number;
  isActive: boolean;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
  createdBy?: number;
  updatedBy?: number;
}

export interface CreateItemSalesDetailData {
  sellingPrice?: number;
  currencyId?: number;
  isTaxInclusive?: boolean;
  discountPercentage?: number;
  minimumOrderQuantity?: number;
  leadTimeDays?: number;
  isActive?: boolean;
  notes?: string;
}

export interface UpdateItemSalesDetailData {
  sellingPrice?: number;
  currencyId?: number;
  isTaxInclusive?: boolean;
  discountPercentage?: number;
  minimumOrderQuantity?: number;
  leadTimeDays?: number;
  isActive?: boolean;
  notes?: string;
}

// Item Stock Analysis
export interface ItemStockAnalysis {
  id: number;
  itemId: number;
  minimumStockLevel?: number;
  maximumStockLevel?: number;
  reorderLevel?: number;
  economicOrderQuantity?: number;
  leadTimeDays?: number;
  averageUsagePerDay?: number;
  lastStockCheckDate?: string;
  lastStockQuantity?: number;
  nextStockCheckDate?: string;
  isActive: boolean;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
  createdBy?: number;
  updatedBy?: number;
}

export interface CreateItemStockAnalysisData {
  minimumStockLevel?: number;
  maximumStockLevel?: number;
  reorderLevel?: number;
  economicOrderQuantity?: number;
  leadTimeDays?: number;
  averageUsagePerDay?: number;
  lastStockCheckDate?: string;
  lastStockQuantity?: number;
  nextStockCheckDate?: string;
  isActive?: boolean;
  notes?: string;
}

export interface UpdateItemStockAnalysisData {
  minimumStockLevel?: number;
  maximumStockLevel?: number;
  reorderLevel?: number;
  economicOrderQuantity?: number;
  leadTimeDays?: number;
  averageUsagePerDay?: number;
  lastStockCheckDate?: string;
  lastStockQuantity?: number;
  nextStockCheckDate?: string;
  isActive?: boolean;
  notes?: string;
}

// Types
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

export interface CreateItemOtherDetailData {
  itemId: number;
  detailName: string;
  detailValue?: string;
  detailType: string;
  description?: string;
  isActive?: boolean;
}

export interface UpdateItemOtherDetailData {
  itemId: number;
  detailName: string;
  detailValue?: string;
  detailType: string;
  description?: string;
  isActive?: boolean;
}


// Types
export interface ItemExportDetails {
  id: number;
  itemId: number;
  itemDescriptionForExports?: string;
  exportProductGroupCode?: string;
  exportProductGroupName?: string;
  depbRateListSrlNo?: string;
  depbRate?: number;
  depbValueCap?: number;
  depbRemarks?: string;
  dutyDrawbackSrlNo?: string;
  dutyDrawbackRateType?: string;
  dutyDrawbackRatePercent?: number;
  dutyDrawbackRateFixed?: number;
  dutyDrawbackValueCap?: number;
  dutyDrawbackRemarks?: string;
  createdAt: string;
  updatedAt?: string;
  createdBy?: number;
  updatedBy?: number;
}

export interface CreateItemExportDetailsData {
  itemId: number;
  itemDescriptionForExports?: string;
  exportProductGroupCode?: string;
  exportProductGroupName?: string;
  depbRateListSrlNo?: string;
  depbRate?: number;
  depbValueCap?: number;
  depbRemarks?: string;
  dutyDrawbackSrlNo?: string;
  dutyDrawbackRateType?: string;
  dutyDrawbackRatePercent?: number;
  dutyDrawbackRateFixed?: number;
  dutyDrawbackValueCap?: number;
  dutyDrawbackRemarks?: string;
}

export interface UpdateItemExportDetailsData {
  itemDescriptionForExports?: string;
  exportProductGroupCode?: string;
  exportProductGroupName?: string;
  depbRateListSrlNo?: string;
  depbRate?: number;
  depbValueCap?: number;
  depbRemarks?: string;
  dutyDrawbackSrlNo?: string;
  dutyDrawbackRateType?: string;
  dutyDrawbackRatePercent?: number;
  dutyDrawbackRateFixed?: number;
  dutyDrawbackValueCap?: number;
  dutyDrawbackRemarks?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
} 