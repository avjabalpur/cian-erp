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
  createdByName?: string;
  updatedByName?: string;
}

export interface SalesOrderComment {
  id: number;
  salesOrderId: number;
  comments: string;
  type?: string;
  status?: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt?: string;
  createdBy?: number;
  updatedBy?: number;
  createdByName?: string;
  updatedByName?: string;
}

export interface SalesOrderChat {
  id: number;
  salesOrderId: number;
  comment: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt?: string;
  createdBy?: number;
  updatedBy?: number;
  createdByName?: string;
  updatedByName?: string;
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

export interface SalesOrderSaveTransaction {
  id: number;
  salesOrderId: number;
  diff?: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt?: string;
  createdBy?: number;
  updatedBy?: number;
  createdByName?: string;
  updatedByName?: string;
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

export type CreateSalesOrderStageData = Omit<SalesOrderStage, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy' | 'createdByName' | 'updatedByName'>;
export type CreateSalesOrderCommentData = Omit<SalesOrderComment, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy' | 'createdByName' | 'updatedByName'>;
export type CreateSalesOrderChatData = Omit<SalesOrderChat, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy' | 'createdByName' | 'updatedByName'>;
export type CreateSalesOrderDocumentData = Omit<SalesOrderDocument, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>;

