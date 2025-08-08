import z from "zod"

export const itemTypeSchema = z.object({
  code: z.string().min(1, "Code is required"),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  parentTypeId: z.string()
  .optional()
  .transform((val) => {
    if (!val || val === "") return undefined;
    const num = parseFloat(val);
    return isNaN(num) ? undefined : num;
  }),
  isActive: z.coerce.boolean().default(true),
});

export const hsnMasterSchema = z.object({
  code: z.string().min(1, "Code is required"),
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  hsnType: z.string().optional(),
  uqc: z.string().optional(),
  igstRate: z.string()
    .optional()
    .transform((val) => {
      if (!val || val === "") return undefined;
      const num = parseFloat(val);
      return isNaN(num) ? undefined : num;
    }),
  cgstRate: z.string()
    .optional()
    .transform((val) => {
      if (!val || val === "") return undefined;
      const num = parseFloat(val);
      return isNaN(num) ? undefined : num;
    }),
  sgstRate: z.string()
    .optional()
    .transform((val) => {
      if (!val || val === "") return undefined;
      const num = parseFloat(val);
      return isNaN(num) ? undefined : num;
    }),
  cessRate: z.string()
    .optional()
    .transform((val) => {
      if (!val || val === "") return undefined;
      const num = parseFloat(val);
      return isNaN(num) ? undefined : num;
    }),
  isReverseCharges: z.coerce.boolean().default(false),
  isActive: z.coerce.boolean().default(true),
});

// Comprehensive Item Master Schema
export const itemMasterSchema = z.object({
  // Basic Info
  //itemCode: z.string().min(1, "Item Code is required"),
  revNo: z.string().optional(),
  itemTypeId: z.string()
    .min(1, "Item Type is required")
    .transform((val) => {
      if (!val || val === "-1") return 0;
      const num = parseInt(val);
      return isNaN(num) ? 0 : num;
    }),
  subType: z.string().optional(),
  gsInd: z.string().optional(),
  goodsType: z.string().optional(),
  itemName: z.string().min(1, "Item Name is required"),
  shortName: z.string().optional(),
  pharmacopoeiaName: z.string().optional(),
  unitOfMeasure: z.string().optional(),
  issuingUnit: z.string().optional(),
  hsn: z.string().optional(),
  uqc: z.string().optional(),
  uomIssConvFactor: z.string()
    .optional()
    .transform((val) => {
      if (!val || val === "") return undefined;
      const num = parseFloat(val);
      return isNaN(num) ? undefined : num;
    }),
  uomUqcConvFactor: z.string()
    .optional()
    .transform((val) => {
      if (!val || val === "") return undefined;
      const num = parseFloat(val);
      return isNaN(num) ? undefined : num;
    }),
  drawingRef: z.string().optional(),
  leadTimeDays: z.string()
    .optional()
    .transform((val) => {
      if (!val || val === "") return undefined;
      const num = parseInt(val);
      return isNaN(num) ? undefined : num;
    }),
  currentBuyer: z.string().optional(),
  economicOrderQty: z.string()
    .optional()
    .transform((val) => {
      if (!val || val === "") return undefined;
      const num = parseInt(val);
      return isNaN(num) ? undefined : num;
    }),
  desiredPackSize: z.string()
    .optional()
    .transform((val) => {
      if (!val || val === "") return undefined;
      const num = parseInt(val);
      return isNaN(num) ? undefined : num;
    }),
  freightOn: z.string().optional(),

  // Manufacturing
  stdAssayStrength: z.string().optional(),
  shelfLifeMonths: z.string()
    .optional()
    .transform((val) => {
      if (!val || val === "") return undefined;
      const num = parseInt(val);
      return isNaN(num) ? undefined : num;
    }),
  shelfLifeDays: z.string()
    .optional()
    .transform((val) => {
      if (!val || val === "") return undefined;
      const num = parseInt(val);
      return isNaN(num) ? undefined : num;
    }),
  stdRate: z.string()
    .optional()
    .transform((val) => {
      if (!val || val === "") return undefined;
      const num = parseFloat(val);
      return isNaN(num) ? undefined : num;
    }),
  stdLossOnDry: z.string()
    .optional()
    .transform((val) => {
      if (!val || val === "") return undefined;
      const num = parseFloat(val);
      return isNaN(num) ? undefined : num;
    }),
  safetyStock: z.string()
    .optional()
    .transform((val) => {
      if (!val || val === "") return undefined;
      const num = parseInt(val);
      return isNaN(num) ? undefined : num;
    }),
  allowedAllergenPercent: z.string()
    .optional()
    .transform((val) => {
      if (!val || val === "") return undefined;
      const num = parseFloat(val);
      return isNaN(num) ? undefined : num;
    }),
  stdMfgFeesPerUnit: z.string()
    .optional()
    .transform((val) => {
      if (!val || val === "") return undefined;
      const num = parseFloat(val);
      return isNaN(num) ? undefined : num;
    }),
  mainProdCentre: z.string().optional(),

  // Sales
  sold: z.boolean().default(false),
  keyProduct: z.boolean().default(false),
  exported: z.boolean().default(false),
  productType: z.string().optional(),
  salesDivision: z.string().optional(),
  productGroup: z.string().optional(),
  conversionFactor: z.string()
    .optional()
    .transform((val) => {
      if (!val || val === "") return undefined;
      const num = parseFloat(val);
      return isNaN(num) ? undefined : num;
    }),
  vendorPartNo: z.string().optional(),

  // Boolean flags
  boughtOut: z.boolean().default(false),
  jobWork: z.boolean().default(false),
  imported: z.boolean().default(false),
  taxCreditApplicable: z.boolean().default(false),
  manufactured: z.boolean().default(false),
  batchNotApplicable: z.boolean().default(false),
  qcRequired: z.boolean().default(false),
  allergen: z.boolean().default(false),
  mfgDateApplicable: z.boolean().default(false),
  expiryDateApplicable: z.boolean().default(false),
  trackSerialNos: z.boolean().default(false),
  packingFreightInsuranceServices: z.boolean().default(false),
  activeIngredient: z.boolean().default(false),
  mfgLocNameRequired: z.boolean().default(false),
  mfgMmYyyyApplicable: z.boolean().default(false),
  expiryMmYyyyApplicable: z.boolean().default(false),
  principalForStatutoryReporting: z.boolean().default(false),

  // Sales Details
  packSizeApplicable: z.boolean().default(false),
  defaultPackSize: z.string().optional(),
  saleableUnitContains: z.string()
    .optional()
    .transform((val) => {
      if (!val || val === "") return undefined;
      const num = parseFloat(val);
      return isNaN(num) ? undefined : num;
    }),
  qtyPerBox: z.string()
    .optional()
    .transform((val) => {
      if (!val || val === "") return undefined;
      const num = parseFloat(val);
      return isNaN(num) ? undefined : num;
    }),
  boxesPerCase: z.string()
    .optional()
    .transform((val) => {
      if (!val || val === "") return undefined;
      const num = parseFloat(val);
      return isNaN(num) ? undefined : num;
    }),
  casePackingType: z.string().optional(),
  packingRate: z.string()
    .optional()
    .transform((val) => {
      if (!val || val === "") return undefined;
      const num = parseFloat(val);
      return isNaN(num) ? undefined : num;
    }),
  qtyPerCase: z.string()
    .optional()
    .transform((val) => {
      if (!val || val === "") return undefined;
      const num = parseFloat(val);
      return isNaN(num) ? undefined : num;
    }),
  netWeightCase: z.string()
    .optional()
    .transform((val) => {
      if (!val || val === "") return undefined;
      const num = parseFloat(val);
      return isNaN(num) ? undefined : num;
    }),
  tareWeightCase: z.string()
    .optional()
    .transform((val) => {
      if (!val || val === "") return undefined;
      const num = parseFloat(val);
      return isNaN(num) ? undefined : num;
    }),
  grossWeightCase: z.string()
    .optional()
    .transform((val) => {
      if (!val || val === "") return undefined;
      const num = parseFloat(val);
      return isNaN(num) ? undefined : num;
    }),
  grossWeightUnit: z.string()
    .optional()
    .transform((val) => {
      if (!val || val === "") return undefined;
      const num = parseFloat(val);
      return isNaN(num) ? undefined : num;
    }),
  caseDimensionsInches: z.string().optional(),
  caseVolumeCft: z.string()
    .optional()
    .transform((val) => {
      if (!val || val === "") return undefined;
      const num = parseFloat(val);
      return isNaN(num) ? undefined : num;
    }),
  caseDimensionsCm: z.string().optional(),
  caseVolumeCbm: z.string()
    .optional()
    .transform((val) => {
      if (!val || val === "") return undefined;
      const num = parseFloat(val);
      return isNaN(num) ? undefined : num;
    }),
  minSaleRate: z.string()
    .optional()
    .transform((val) => {
      if (!val || val === "") return undefined;
      const num = parseFloat(val);
      return isNaN(num) ? undefined : num;
    }),
  minSoQty: z.string()
    .optional()
    .transform((val) => {
      if (!val || val === "") return undefined;
      const num = parseFloat(val);
      return isNaN(num) ? undefined : num;
    }),
  tertiaryGtin: z.string().optional(),
  secondaryGtin: z.string().optional(),
  primaryGtin: z.string().optional(),
  minBatchQtyAutoloading: z.string()
    .optional()
    .transform((val) => {
      if (!val || val === "") return undefined;
      const num = parseFloat(val);
      return isNaN(num) ? undefined : num;
    }),
  considerAsNewProductTill: z.string().optional(),
  interfaceCode: z.string().optional(),
  specs: z.string().optional(),

  // Bought Out Details
  purchaseBasedOn: z.string().optional(),
  excessPlanningPercent: z.string()
    .optional()
    .transform((val) => {
      if (!val || val === "") return undefined;
      const num = parseFloat(val);
      return isNaN(num) ? undefined : num;
    }),
  boughtOutReorderLevel: z.string()
    .optional()
    .transform((val) => {
      if (!val || val === "") return undefined;
      const num = parseFloat(val);
      return isNaN(num) ? undefined : num;
    }),
  minStockLevel: z.string()
    .optional()
    .transform((val) => {
      if (!val || val === "") return undefined;
      const num = parseFloat(val);
      return isNaN(num) ? undefined : num;
    }),
  maxStockLevel: z.string()
    .optional()
    .transform((val) => {
      if (!val || val === "") return undefined;
      const num = parseFloat(val);
      return isNaN(num) ? undefined : num;
    }),
  minBalanceShelfLifeDays: z.string()
    .optional()
    .transform((val) => {
      if (!val || val === "") return undefined;
      const num = parseInt(val);
      return isNaN(num) ? undefined : num;
    }),
  customDutyPercent: z.string()
    .optional()
    .transform((val) => {
      if (!val || val === "") return undefined;
      const num = parseFloat(val);
      return isNaN(num) ? undefined : num;
    }),
  igstPercent: z.string()
    .optional()
    .transform((val) => {
      if (!val || val === "") return undefined;
      const num = parseFloat(val);
      return isNaN(num) ? undefined : num;
    }),
  swsPercent: z.string()
    .optional()
    .transform((val) => {
      if (!val || val === "") return undefined;
      const num = parseFloat(val);
      return isNaN(num) ? undefined : num;
    }),
  maxPurchaseRate: z.string()
    .optional()
    .transform((val) => {
      if (!val || val === "") return undefined;
      const num = parseFloat(val);
      return isNaN(num) ? undefined : num;
    }),
  stopProcurement: z.boolean().default(false),

  // Stock Analysis
  abcConsumptionValue: z.string().optional(),
  xyzStockValue: z.string().optional(),
  fsnMovement: z.string().optional(),
  vedAnalysis: z.string().optional(),

  // Export Details
  itemDescriptionForExports: z.string().optional(),
  exportProductGroupCode: z.string().optional(),
  exportProductGroupName: z.string().optional(),
  depbRateListSrlNo: z.string().optional(),
  depbRate: z.string()
    .optional()
    .transform((val) => {
      if (!val || val === "") return undefined;
      const num = parseFloat(val);
      return isNaN(num) ? undefined : num;
    }),
  depbValueCap: z.string()
    .optional()
    .transform((val) => {
      if (!val || val === "") return undefined;
      const num = parseFloat(val);
      return isNaN(num) ? undefined : num;
    }),
  depbRemarks: z.string().optional(),
  dutyDrawbackSrlNo: z.string().optional(),
  dutyDrawbackRateType: z.string().optional(),
  dutyDrawbackRate: z.string()
    .optional()
    .transform((val) => {
      if (!val || val === "") return undefined;
      const num = parseFloat(val);
      return isNaN(num) ? undefined : num;
    }),
  dutyDrawbackValueCap: z.string()
    .optional()
    .transform((val) => {
      if (!val || val === "") return undefined;
      const num = parseFloat(val);
      return isNaN(num) ? undefined : num;
    }),
  dutyDrawbackRemarks: z.string().optional(),

  // Specifications
  itemSpecification: z.string().optional(),
  SubstituteForItemCode: z.string().optional(),
  customTariffNo: z.string().optional(),
  exciseTariffNo: z.string().optional(),
  vatCommCode: z.string().optional(),
  convFactor: z.string()
    .optional()
    .transform((val) => {
      if (!val || val === "") return undefined;
      const num = parseFloat(val);
      return isNaN(num) ? undefined : num;
    }),
  oldCode: z.string().optional(),
  standardWeight: z.string()
    .optional()
    .transform((val) => {
      if (!val || val === "") return undefined;
      const num = parseFloat(val);
      return isNaN(num) ? undefined : num;
    }),
  standardConversionCostFactor: z.string()
    .optional()
    .transform((val) => {
      if (!val || val === "") return undefined;
      const num = parseFloat(val);
      return isNaN(num) ? undefined : num;
    }),
  standardPackingCostFactor: z.string()
    .optional()
    .transform((val) => {
      if (!val || val === "") return undefined;
      const num = parseFloat(val);
      return isNaN(num) ? undefined : num;
    }),
  costFactorPercent: z.string()
    .optional()
    .transform((val) => {
      if (!val || val === "") return undefined;
      const num = parseFloat(val);
      return isNaN(num) ? undefined : num;
    }),
  packingCostRs: z.string()
    .optional()
    .transform((val) => {
      if (!val || val === "") return undefined;
      const num = parseFloat(val);
      return isNaN(num) ? undefined : num;
    }),

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
  withLeaflet: z.boolean().default(false),
  withApplicator: z.boolean().default(false),
  withWad: z.boolean().default(false),
  withSilica: z.boolean().default(false),
  withCotton: z.boolean().default(false),
  withMeasuringCap: z.boolean().default(false),
  withSpoon: z.boolean().default(false),
  packingNp: z.string().optional(),
  packingNpQty: z.string().optional(),
  packingStylePtd: z.string().optional(),
  packingStylePtdQty: z.string().optional(),
  notePerStrip: z.string().optional(),
  packShortPtdSpec: z.string().optional(),
  packShortPtdSize: z.string().optional(),
  packShortPtdQty: z.string().optional(),
  packingStyleNpSize: z.string().optional(),
  packingStyleNpQty: z.string().optional(),
  noteForCtn: z.string().optional(),
  outerSize: z.string().optional(),
  outerQty: z.string().optional(),
  shrink: z.string().optional(),
  shrinkPacking: z.string().optional(),
  shipperSize: z.string().optional(),
  qtyPerShipper: z.string().optional(),
  shipperNote: z.string().optional(),
});

export type ItemTypeFormData = z.infer<typeof itemTypeSchema>;
export type HsnMasterFormData = z.infer<typeof hsnMasterSchema>;
export type ItemMasterFormData = z.infer<typeof itemMasterSchema>;