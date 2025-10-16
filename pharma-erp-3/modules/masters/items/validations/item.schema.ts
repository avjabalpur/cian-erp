import * as z from 'zod';

// Specification Schema
export const itemSpecificationSchema = z.object({
  specification: z.string().optional(),
});

// Bought Out Details Schema
export const itemBoughtOutDetailsSchema = z.object({
  purchaseBasedOn: z.string().optional(),
  excessPlanningPercent: z.coerce.number().optional(),
  reorderLevel: z.coerce.number().optional(),
  minStockLevel: z.coerce.number().optional(),
  maxStockLevel: z.coerce.number().optional(),
  minBalanceShelfLifeDays: z.coerce.number().optional(),
  customDutyPercent: z.coerce.number().optional(),
  igstPercent: z.coerce.number().optional(),
  swsPercent: z.coerce.number().optional(),
  maxPurchaseRate: z.coerce.number().optional(),
  stopProcurement: z.boolean().optional(),
});

// Sales Detail Schema
export const itemSalesDetailSchema = z.object({
  packSizeApplicable: z.boolean().optional(),
  defaultPackSize: z.string().optional(),
  saleableUnitContains: z.string().optional(),
  qtyPerBox: z.string().optional(),
  boxesPerCase: z.string().optional(),
  casePackingType: z.string().optional(),
  packingRate: z.string().optional(),
  qtyPerCase: z.string().optional(),
  netWeightCase: z.string().optional(),
  tareWeightCase: z.string().optional(),
  grossWeightCase: z.string().optional(),
  grossWeightUnit: z.string().optional(),
  caseDimensionsInches: z.string().optional(),
  caseVolumeCft: z.string().optional(),
  caseDimensionsCm: z.string().optional(),
  caseVolumeCbm: z.string().optional(),
  minSaleRate: z.string().optional(),
  minSoQty: z.string().optional(),
  tertiaryGtin: z.string().optional(),
  secondaryGtin: z.string().optional(),
  primaryGtin: z.string().optional(),
  minBatchQtyAutoloading: z.string().optional(),
  considerAsNewProductTill: z.string().optional(),
  interfaceCode: z.string().optional(),
  specs: z.string().optional(),
});

// Stock Analysis Schema
export const itemStockAnalysisSchema = z.object({
  abcConsumptionValue: z.string().optional(),
  xyzStockValue: z.string().optional(),
  fsnMovement: z.string().optional(),
  vedAnalysis: z.string().optional(),
});

// Export Details Schema
export const itemExportDetailsSchema = z.object({
  itemDescriptionForExports: z.string().optional(),
  exportProductGroupCode: z.string().optional(),
  exportProductGroupName: z.string().optional(),
  depbRateListSrlNo: z.string().optional(),
  depbRate: z.string().optional(),
  depbValueCap: z.string().optional(),
  depbRemarks: z.string().optional(),
  dutyDrawbackSrlNo: z.string().optional(),
  dutyDrawbackRate: z.string().optional(),
  dutyDrawbackRateType: z.string().optional(),
  dutyDrawbackValueCap: z.string().optional(),
  dutyDrawbackRemarks: z.string().optional(),
});

// Other Details Schema
export const itemOtherDetailSchema = z.object({
  detailName: z.string().min(1, 'Detail name is required'),
  detailValue: z.string().optional(),
  detailType: z.string().min(1, 'Detail type is required'),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
});

// Main Item Master Schema
export const itemMasterSchema = z.object({
  // Basic Information
  itemCode: z.string().min(1, 'Item code is required').max(50, 'Item code must be at most 50 characters'),
  revNo: z.string().optional(),
  itemTypeId: z.coerce.number().min(1, 'Item type is required'),
  subType: z.coerce.number().optional().transform(val => val === 0 ? undefined : val),
  gsInd: z.string().optional(),
  goodsType: z.string().optional(),
  itemName: z.string().min(1, 'Item name is required').max(255, 'Item name must be at most 255 characters'),
  shortName: z.string().optional(),
  pharmacopoeiaName: z.string().optional(),
  unitOfMeasure: z.string().optional(),
  issuingUnit: z.string().optional(),
  uomIssConvFactor: z.coerce.number().optional(),
  uomUqcConvFactor: z.coerce.number().optional(),
  drawingRef: z.string().optional(),
  stdAssayStrength: z.coerce.number().optional(),
  shelfLifeMonths: z.coerce.number().optional(),
  shelfLifeDays: z.coerce.number().optional(),
  stdRate: z.coerce.number().optional(),
  leadTimeDays: z.coerce.number().optional(),
  stdLossOnDry: z.coerce.number().optional(),
  safetyStock: z.coerce.number().optional(),
  
  // Procurement Details
  boughtOut: z.boolean().optional(),
  jobWork: z.boolean().optional(),
  imported: z.boolean().optional(),
  currentBuyer: z.string().optional(),
  economicOrderQty: z.coerce.number().optional(),
  desiredPackSize: z.coerce.number().optional(),
  taxCreditApplicable: z.boolean().optional(),
  freightOn: z.string().optional(),
  
  // Manufacturing Details
  manufactured: z.boolean().optional(),
  allowedAllergenPercent: z.coerce.number().optional(),
  stdMfgFeesPerUnit: z.coerce.number().optional(),
  mainProdCentre: z.string().optional(),
  
  // Sales Details
  sold: z.boolean().optional(),
  keyProduct: z.boolean().optional(),
  exported: z.boolean().optional(),
  productType: z.string().optional(),
  salesDivision: z.string().optional(),
  productGroup: z.string().optional(),
  conversionFactor: z.coerce.number().optional(),
  vendorPartNo: z.string().optional(),
  
  // Quality Control
  batchNotApplicable: z.boolean().optional(),
  qcRequired: z.boolean().optional(),
  allergen: z.boolean().optional(),
  mfgDateApplicable: z.boolean().optional(),
  expiryDateApplicable: z.boolean().optional(),
  trackSerialNos: z.boolean().optional(),
  packingFreightInsuranceServices: z.boolean().optional(),
  activeIngredient: z.boolean().optional(),
  mfgLocNameRequired: z.boolean().optional(),
  mfgMmYyyyApplicable: z.boolean().optional(),
  expiryMmYyyyApplicable: z.boolean().optional(),
  principalForStatutoryReporting: z.boolean().optional(),
  
  // Other Details
  packShort: z.string().optional(),
  productCast: z.string().optional(),
  pvcColor: z.string().optional(),
  color: z.string().optional(),
  flavour: z.string().optional(),
  fragrance: z.string().optional(),
  form: z.string().optional(),
  packagingStyle: z.string().optional(),
  changePart: z.string().optional(),
  size: z.string().optional(),
  withLeaflet: z.boolean().optional(),
  withApplicator: z.boolean().optional(),
  withWad: z.boolean().optional(),
  withSilica: z.boolean().optional(),
  withCotton: z.boolean().optional(),
  withMeasuringCap: z.boolean().optional(),
  withSpoon: z.boolean().optional(),
  packShortPtdSpec: z.string().optional(),
  packShortPtdSize: z.string().optional(),
  packShortPtdQty: z.coerce.number().optional(),
  packingStyleNpSize: z.string().optional(),
  packingStyleNpQty: z.coerce.number().optional(),
  noteForCtn: z.string().optional(),
  outerSize: z.string().optional(),
  outerQty: z.coerce.number().optional(),
  shrink: z.string().optional(),
  shrinkPacking: z.string().optional(),
  shipperSize: z.string().optional(),
  qtyPerShipper: z.coerce.number().optional(),
  shipperNote: z.string().optional(),
  packingNp: z.string().optional(),
  packingNpQty: z.coerce.number().optional(),
  packingStylePtd: z.string().optional(),
  packingStylePtdQty: z.coerce.number().optional(),
  notePerStrip: z.string().optional(),
  
  // Nested Objects
  specification: itemSpecificationSchema.optional(),
  boughtOutDetails: itemBoughtOutDetailsSchema.optional(),
  salesDetail: itemSalesDetailSchema.optional(),
  stockAnalysis: itemStockAnalysisSchema.optional(),
  exportDetails: itemExportDetailsSchema.optional(),
  properties: z.array(z.object({
    key: z.string(),
    value: z.string(),
  })).optional(),
});

export type ItemMasterFormValues = z.infer<typeof itemMasterSchema>;

