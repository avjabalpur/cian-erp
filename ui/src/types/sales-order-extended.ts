export interface SalesOrderPerformaInvoice {
  id: number;
  exporterName: string;
  organizationName?: string;
  consigneeName: string;
  consigneeContactDetails?: string;
  consigneeAddress?: string;
  performaInvoiceNumber: string;
  performaInvoiceDate?: string;
  exportersReferenceNumber?: string;
  otherReferences?: string;
  otherBuyerName?: string;
  countryOfOrigin?: string;
  countryOfFinalDestination?: string;
  prepration?: string;
  portOfDischarge?: string;
  placeOfReceiptByPreCarrier?: string;
  finalDestination?: string;
  termsOfDelivery?: string;
  paymentTerms?: string;
  shipmentMode?: string;
  portOfLoading?: string;
  additionalCharges?: string;
  totalAmount?: number;
  previousPerformaInvoiceId?: number;
  isDeleted: boolean;
  createdAt: string;
  updatedAt?: string;
  createdBy?: number;
  createdByName?: string;
  updatedBy?: number;
  updatedByName?: string;
}

export interface SalesOrderPerformaInvoiceItem {
  id: number;
  performaInvoiceId: number;
  salesOrderId?: number;
  itemId?: number;
  itemName?: string;
  composition?: string;
  dosageName?: string;
  productCast?: string;
  pPackShort?: string;
  pQuantity?: number;
  pFocQty?: number;
  pBillingRate?: number;
  isDeleted: boolean;
  createdAt: string;
  updatedAt?: string;
  createdBy?: number;
  updatedBy?: number;
}

export interface SalesOrderQuotationItem {
  id: number;
  quotationId: number;
  salesOrderId?: number;
  itemId?: number;
  itemName?: string;
  composition?: string;
  dosageName?: string;
  productCast?: string;
  pPackShort?: string;
  soStatus?: string;
  pQuantity?: number;
  pFocQty?: number;
  pMrp?: number;
  pBillingRate?: number;
  comments?: string;
  taxPercent?: number;
  productExtraCharges?: number;
  productExtraChargesTaxPercent?: number;
  isDeleted: boolean;
  createdAt: string;
  updatedAt?: string;
  createdBy?: number;
  createdByName?: string;
  updatedBy?: number;
  updatedByName?: string;
}

export interface SalesOrderChat {
  id: number;
  salesOrderId: number;
  comment: string;
  createdAt: string;
  createdBy?: number;
  createdByName?: string;
}

export interface SalesOrderSaveTransaction {
  id: number;
  salesOrderId: number;
  diff: string;
  createdAt: string;
  createdBy?: number;
  createdByName?: string;
}

export interface SalesOrderDocument {
  id: number;
  salesOrderId: number;
  tag?: string;
  fileName: string;
  filePath: string;
  fileType?: string;
  metadata?: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt?: string;
  createdBy?: number;
  createdByName?: string;
  updatedBy?: number;
  updatedByName?: string;
}

export interface CreateSalesOrderPerformaInvoiceData {
  exporterName: string;
  organizationName?: string;
  consigneeName: string;
  consigneeContactDetails?: string;
  consigneeAddress?: string;
  performaInvoiceNumber: string;
  performaInvoiceDate?: string;
  exportersReferenceNumber?: string;
  otherReferences?: string;
  otherBuyerName?: string;
  countryOfOrigin?: string;
  countryOfFinalDestination?: string;
  prepration?: string;
  portOfDischarge?: string;
  placeOfReceiptByPreCarrier?: string;
  finalDestination?: string;
  termsOfDelivery?: string;
  paymentTerms?: string;
  shipmentMode?: string;
  portOfLoading?: string;
  additionalCharges?: string;
  totalAmount?: number;
  previousPerformaInvoiceId?: number;
}

export interface CreateSalesOrderPerformaInvoiceItemData {
  performaInvoiceId: number;
  salesOrderId?: number;
  itemId?: number;
  composition?: string;
  dosageName?: string;
  productCast?: string;
  pPackShort?: string;
  pQuantity?: number;
  pFocQty?: number;
  pBillingRate?: number;
}

export interface CreateSalesOrderChatData {
  salesOrderId: number;
  comment: string;
}

export interface SalesOrderComment {
  id: number;
  salesOrderId: number;
  comments: string;
  status?: string;
  type?: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt?: string;
  createdBy?: number;
  createdByName?: string;
  updatedBy?: number;
  updatedByName?: string;
}

export interface CreateSalesOrderCommentData {
  salesOrderId: number;
  comments: string;
  status?: string;
  type?: string;
}

export interface SalesOrderQuotation {
  id: number;
  organizationId?: number;
  organizationName?: string;
  quotationNumber: string;
  quotationDate?: string;
  customerId?: number;
  customerName?: string;
  advancePercentage?: number;
  charges?: string;
  totalAmount?: number;
  advanceAmount?: number;
  prevCopyQuotationId?: number;
  isDeleted: boolean;
  createdAt: string;
  updatedAt?: string;
  createdBy?: number;
  createdByName?: string;
  updatedBy?: number;
  updatedByName?: string;
}

export interface CreateSalesOrderQuotationData {
  organizationId?: number;
  quotationNumber: string;
  quotationDate?: string;
  customerId: number;
  advancePercentage?: number;
  charges?: string;
  totalAmount?: number;
  advanceAmount?: number;
  prevCopyQuotationId?: number;
}

export interface CreateSalesOrderQuotationItemData {
  quotationId: number;
  salesOrderId?: number;
  itemId?: number;
  composition?: string;
  dosageName?: string;
  productCast?: string;
  pPackShort?: string;
  soStatus?: string;
  pQuantity?: number;
  pFocQty?: number;
  pMrp?: number;
  pBillingRate?: number;
  comments?: string;
  taxPercent?: number;
  productExtraCharges?: number;
  productExtraChargesTaxPercent?: number;
}

export interface CreateSalesOrderSaveTransactionData {
  salesOrderId: number;
  diff?: string;
}

export interface CreateSalesOrderDocumentData {
  salesOrderId: number;
  tag?: string;
  fileName: string;
  filePath: string;
  fileType?: string;
  metadata?: string;
}

export interface SalesOrderStage {
  id: number;
  salesOrderId: number;
  stageName: string;
  isApproved: boolean;
  createdAt: string;
  updatedAt?: string;
  createdBy?: number;
  createdByName?: string;
  updatedBy?: number;
  updatedByName?: string;
}

export interface CreateSalesOrderStageData {
  salesOrderId: number;
  stageName: string;
  isApproved?: boolean;
} 