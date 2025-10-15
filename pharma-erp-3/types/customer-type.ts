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
  page: number;
  pageSize: number;
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

export interface UpdateCustomerTypeData {
  code: string;
  name: string;
  description?: string;
  isExportType: boolean;
  isDomesticType: boolean;
  requiresDrugLicense: boolean;
  creditTermsApplicable: boolean;
  isActive: boolean;
} 