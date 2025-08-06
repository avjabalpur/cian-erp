export interface SalesOrder {
  id: number;
  soNumber: string;
  soDate?: string;
  soStatus: string;
  organizationId?: number;
  organizationName?: string;
  customerId?: number;
  customerName?: string;
  paymentTerm?: string;
  quotationDate?: string;
  quotationNo?: string;
  hsnCode?: string;
  itemId?: number;
  itemName?: string;
  dosageName?: string;
  divisionId?: number;
  divisionName?: string;
  designUnder?: string;
  packingStyleDescription?: string;
  composition?: string;
  packShort?: string;
  tabletType?: string;
  tabletSize?: string;
  changePart?: string;
  capsuleSize?: string;
  shipperSize?: string;
  qtyPerShipper?: string;
  noOfShipper?: string;
  flavour?: string;
  fragrance?: string;
  quantity?: string;
  focQty?: string;
  mrp?: string;
  billingRate?: string;
  costing?: string;
  inventoryCharges?: string;
  cylinderCharge?: string;
  plateCharges?: string;
  domino?: string;
  stereo?: string;
  shipperDrawingRefCode?: string;
  ctnOuterDrawingRefNo?: string;
  ctnInnerDrawingRefNo?: string;
  foilDrawingRefNo?: string;
  leafletDrawingRefNo?: string;
  tubeDrawingRefNo?: string;
  labelDrawingRefNo?: string;
  pmOuterCtnStock?: string;
  pmInnerCtnStock?: string;
  pmFoilStock?: string;
  pmLeafletStock?: string;
  pmTubeStock?: string;
  pmLabelStock?: string;
  drugApprovalUnder?: string;
  currentStatus?: string;
  comments?: string;
  isSubmitted: boolean;
  isDeleted: boolean;
  assignedDesigner?: number;
  assignedDesignerName?: string;
  plantEmailSent?: boolean;
  createdAt: string;
  updatedAt?: string;
  createdBy?: number;
  createdByName?: string;
  updatedBy?: number;
  updatedByName?: string;
}

export interface SalesOrderStage {
  id: number;
  salesOrderId: number;
  stageName: string;
  isApproved: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt?: string;
  createdBy?: number;
  updatedBy?: number;
}

export interface SalesOrderQuotation {
  id: number;
  organizationId?: number;
  quotationNumber: string;
  quotationDate?: string;
  customerId?: number;
  advancePercentage?: number;
  charges?: string;
  totalAmount?: number;
  advanceAmount?: number;
  prevCopyQuotationId?: number;
  isDeleted: boolean;
  createdAt: string;
  updatedAt?: string;
  createdBy?: number;
  updatedBy?: number;
}

export interface SalesOrderComment {
  id: number;
  salesOrderId: number;
  comment: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt?: string;
  createdBy?: number;
  updatedBy?: number;
}

export interface SalesOrderDocument {
  id: number;
  salesOrderId: number;
  documentName: string;
  documentPath: string;
  documentType: string;
  fileSize?: number;
  isDeleted: boolean;
  createdAt: string;
  updatedAt?: string;
  createdBy?: number;
  updatedBy?: number;
}

export interface SalesOrderFilter {
  search?: string;
  soNumber?: string;
  soStatus?: string;
  customerId?: number;
  organizationId?: number;
  divisionId?: number;
  itemId?: number;
  fromDate?: string;
  toDate?: string;
  isSubmitted?: boolean;
  assignedDesigner?: number;
  page: number;
  pageSize: number;
  sortBy: string;
  sortOrder: string;
}

export type CreateSalesOrderData = Omit<SalesOrder, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy' | 'customerName' | 'itemName' | 'divisionName' | 'assignedDesignerName' | 'createdByName' | 'updatedByName'>;

export type UpdateSalesOrderData = Partial<Omit<SalesOrder, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy' | 'customerName' | 'itemName' | 'divisionName' | 'assignedDesignerName' | 'createdByName' | 'updatedByName'>> & {
  id: number;
}; 