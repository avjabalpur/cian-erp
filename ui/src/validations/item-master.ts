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
  itemCode: z.string().min(1, "Item Code is required"),
  revNo: z.string().optional(),
  itemTypeId: z.number().min(1, "Item Type is required"),
  subType: z.string().optional(),
  gsInd: z.string().optional(),
  goodsType: z.boolean().default(false),
  itemName: z.string().min(1, "Item Name is required"),
  shortName: z.string().optional(),
  pharmacopoeiaName: z.string().optional(),
  unitOfMeasure: z.string().optional(),
  issuingUnit: z.string().optional(),
  uomIssConvFactor: z.number().optional(),
  uomUqcConvFactor: z.number().optional(),
  drawingRef: z.string().optional(),
  leadTimeDays: z.number().optional(),
  currentBuyer: z.string().optional(),
  economicOrderQty: z.number().optional(),
  desiredPackSize: z.number().optional(),
  freightOn: z.string().optional(),

  // Manufacturing
  stdAssayStrength: z.string().optional(),
  shelfLifeMonths: z.number().optional(),
  shelfLifeDays: z.number().optional(),
  stdRate: z.number().optional(),
  stdLossOnDry: z.number().optional(),
  safetyStock: z.number().optional(),
  allowedAllergenPercent: z.number().optional(),
  stdMfgFeesPerUnit: z.number().optional(),
  mainProdCentre: z.string().optional(),

  // Sales
  sold: z.boolean().default(false),
  keyProduct: z.boolean().default(false),
  exported: z.boolean().default(false),
  productType: z.string().optional(),
  salesDivision: z.string().optional(),
  productGroup: z.string().optional(),
  conversionFactor: z.number().optional(),
  vendorPartNo: z.string().optional(),

  // Boolean flags
  boughtOut: z.boolean().default(false),
  jobWork: z.boolean().default(false),
  imported: z.boolean().default(false),
  taxCreditApplicable: z.boolean().default(false),
  manufactured: z.boolean().default(false),
  batchNotApplicable: z.boolean().default(false),
  qcRequired: z.boolean().default(false),
  allergen: z.string().optional(),
  mfgDateApplicable: z.boolean().default(false),
  expiryDateApplicable: z.boolean().default(false),
  trackSerialNos: z.boolean().default(false),
  packingFreightInsuranceServices: z.string().optional(),
  activeIngredient: z.string().optional(),
  mfgLocNameRequired: z.boolean().default(false),
  mfgMmYyyyApplicable: z.boolean().default(false),
  expiryMmYyyyApplicable: z.boolean().default(false),
  principalForStatutoryReporting: z.boolean().default(false),

  // Bought Out Details
  purchaseBasedOn: z.string().optional(),
  excessPlanningPercent: z.number().optional(),
  reorderLevel: z.number().optional(),
  minStockLevel: z.number().optional(),
  maxStockLevel: z.number().optional(),
  minBalanceShelfLifeDays: z.number().optional(),
  customDutyPercent: z.number().optional(),
  igstPercent: z.number().optional(),
  swsPercent: z.number().optional(),
  maxPurchaseRate: z.number().optional(),
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
  depbRate: z.number().optional(),
  depbValueCap: z.number().optional(),
  depbRemarks: z.string().optional(),
  dutyDrawbackSrlNo: z.string().optional(),
  dutyDrawbackRateType: z.string().optional(),
  dutyDrawbackRatePercent: z.number().optional(),
  dutyDrawbackRateFixed: z.number().optional(),
  dutyDrawbackValueCap: z.number().optional(),
  dutyDrawbackRemarks: z.string().optional(),

  // Specifications
  itemSpecification: z.string().optional(),
  substituteItemFor: z.string().optional(),
  customTariffNo: z.string().optional(),
  exciseTariffNo: z.string().optional(),
  vatCommCode: z.string().optional(),
  convFactor: z.number().optional(),
  oldCode: z.string().optional(),
  standardWeight: z.number().optional(),
  standardConversionCostFactor: z.number().optional(),
  standardPackingCostFactor: z.number().optional(),
  costFactorPercent: z.number().optional(),
  packingCostRs: z.number().optional(),

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
  packingNpQty: z.number().optional(),
  packingStylePtd: z.string().optional(),
  packingStylePtdQty: z.number().optional(),
  notePerStrip: z.string().optional(),
  packShortPtdSpec: z.string().optional(),
  packShortPtdSize: z.string().optional(),
  packShortPtdQty: z.number().optional(),
  packingStyleNpSize: z.string().optional(),
  packingStyleNpQty: z.number().optional(),
  noteForCtn: z.string().optional(),
  outerSize: z.string().optional(),
  outerQty: z.number().optional(),
  shrink: z.string().optional(),
  shrinkPacking: z.string().optional(),
  shipperSize: z.string().optional(),
  qtyPerShipper: z.number().optional(),
  shipperNote: z.string().optional(),
});

export type ItemTypeFormData = z.infer<typeof itemTypeSchema>;
export type HsnMasterFormData = z.infer<typeof hsnMasterSchema>;
export type ItemMasterFormData = z.infer<typeof itemMasterSchema>;