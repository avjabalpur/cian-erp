export interface CustomerType {
  id: number;
  code: string;
  name: string;
  description?: string;
  isExportType: boolean;
  isDomesticType: boolean;
  requiresDrugLicense: boolean;
  creditTermsApplicable: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
  createdBy: number;
  updatedBy?: number;
  isDeleted: boolean;
}

export interface CustomerTypeFilter {
  search?: string;
  code?: string;
  name?: string;
  isExportType?: boolean;
  isDomesticType?: boolean;
  requiresDrugLicense?: boolean;
  creditTermsApplicable?: boolean;
  isActive?: boolean;
  sortBy?: string;
  sortDescending?: boolean;
  pageNumber?: number;
  pageSize?: number;
}

export interface CreateCustomerTypeData {
  code: string;
  name: string;
  description?: string;
  isExportType: boolean;
  isDomesticType: boolean;
  requiresDrugLicense: boolean;
  creditTermsApplicable: boolean;
  isActive: boolean;
}

export type UpdateCustomerTypeData = CreateCustomerTypeData;

