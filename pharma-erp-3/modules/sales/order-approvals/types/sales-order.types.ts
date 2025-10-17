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
  quantity?: string;
  mrp?: string;
  billingRate?: string;
  costing?: string;
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
  productCode?: string;
  country?: string;
  customerGstNo?: string;
}

export interface SalesOrderWithApprovals extends SalesOrder {
  costingApproved?: boolean | null;
  qaApproved?: boolean | null;
  isFinalAuthorized?: boolean | null;
  designerApproved?: boolean | null;
  finalQaApproved?: boolean | null;
  pmApproved?: boolean | null;
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

export interface CreateSalesOrderData {
  soNumber: string;
  soDate?: string;
  soStatus: string;
  organizationId?: number;
  customerId?: number;
  paymentTerm?: string;
  itemId?: number;
  divisionId?: number;
  quantity?: string;
  mrp?: string;
  billingRate?: string;
  isSubmitted?: boolean;
}

export type UpdateSalesOrderData = Partial<CreateSalesOrderData>;

export interface SalesOrderFilter {
  search?: string;
  soStatus?: string;
  paymentTerm?: string;
  currentStatus?: string;
  isSubmitted?: boolean;
  fromDate?: string;
  toDate?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: string;
}

