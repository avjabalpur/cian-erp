export interface Quotation {
  id: number;
  companyName: string;
  quotationNumber: string;
  quotationDate?: string;
  customerName: string;
  customerContactPerson: string;
  customerMobileNumber: string;
  customerEmail: string;
  paymentTerms: string;
  advancePercentage: number;
  charges: string;
  totalAmount: number;
  advanceAmount: number;
  prevCopyQuotationId?: number;
  finalComment: string;
  terms: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt?: string;
  createdBy?: number;
  updatedBy?: number;
}

export interface QuotationProduct {
  id: number;
  productName: string;
  composition: string;
  dosageName: string;
  productCast: string;
  packShort: string;
  quantity: number;
  focQty: number;
  mrp: number;
  billingRate: number;
  taxPercent: number;
  total: number;
}

export interface QuotationCharge {
  id: number;
  description: string;
  amount: number;
  taxPercent: number;
  total: number;
}

export interface CreateQuotationData {
  companyName: string;
  quotationNumber: string;
  quotationDate?: string;
  customerName: string;
  customerContactPerson: string;
  customerMobileNumber: string;
  customerEmail: string;
  paymentTerms: string;
  advancePercentage: number;
  charges: QuotationCharge[];
  totalAmount: number;
  advanceAmount: number;
  prevCopyQuotationId?: number;
  finalComment: string;
  terms: string;
  products: QuotationProduct[];
}
