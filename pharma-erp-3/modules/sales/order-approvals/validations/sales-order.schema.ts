import * as z from 'zod';

export const salesOrderSchema = z.object({
  // Basic Fields
  soNumber: z.string().optional(),
  soDate: z.string().optional(),
  soStatus: z.string().optional(),
  organizationId: z.string().optional(),
  customerId: z.coerce.number().optional(),
  paymentTerm: z.string().optional(),
  quotationDate: z.string().optional(),
  quotationNo: z.string().optional(),
  hsnCode: z.string().optional(),
  itemId: z.coerce.number().optional(),
  dosageName: z.string().optional(),
  divisionId: z.coerce.number().optional(),
  designUnder: z.string().optional(),
  
  // Product Details
  packingStyleDescription: z.string().optional(),
  composition: z.string().optional(),
  packShort: z.string().optional(),
  tabletType: z.string().optional(),
  tabletSize: z.string().optional(),
  changePart: z.string().optional(),
  capsuleSize: z.string().optional(),
  shipperSize: z.string().optional(),
  qtyPerShipper: z.string().optional(),
  noOfShipper: z.string().optional(),
  flavour: z.string().optional(),
  fragrance: z.string().optional(),
  
  // Quantities and Pricing
  quantity: z.string().optional(),
  focQty: z.string().optional(),
  mrp: z.string().optional(),
  billingRate: z.string().optional(),
  costing: z.string().optional(),
  inventoryCharges: z.string().optional(),
  cylinderCharge: z.string().optional(),
  plateCharges: z.string().optional(),
  domino: z.string().optional(),
  stereo: z.string().optional(),
  
  // Drawing References
  shipperDrawingRefCode: z.string().optional(),
  ctnOuterDrawingRefNo: z.string().optional(),
  ctnInnerDrawingRefNo: z.string().optional(),
  foilDrawingRefNo: z.string().optional(),
  leafletDrawingRefNo: z.string().optional(),
  tubeDrawingRefNo: z.string().optional(),
  labelDrawingRefNo: z.string().optional(),
  
  // PM Stock
  pmOuterCtnStock: z.string().optional(),
  pmInnerCtnStock: z.string().optional(),
  pmFoilStock: z.string().optional(),
  pmLeafletStock: z.string().optional(),
  pmTubeStock: z.string().optional(),
  pmLabelStock: z.string().optional(),
  
  // Additional Fields
  drugApprovalUnder: z.string().optional(),
  currentStatus: z.string().optional(),
  comments: z.string().optional(),
  assignedDesigner: z.coerce.number().optional(),
  plantEmailSent: z.boolean().optional(),
  isSubmitted: z.boolean().optional(),
  productCode: z.string().optional(),
  country: z.string().optional(),
  customerGstNo: z.string().optional(),
  
  // Readonly display fields
  customerName: z.string().optional(),
  customerCode: z.string().optional(),
  productName: z.string().optional(),
  productCast: z.string().optional(),
});

export type SalesOrderFormValues = z.infer<typeof salesOrderSchema>;

export const salesOrderUpdateSchema = salesOrderSchema.partial();

export type SalesOrderUpdateFormValues = z.infer<typeof salesOrderUpdateSchema>;

