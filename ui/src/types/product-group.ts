export interface ProductGroup {
  id: number;
  code: string;
  level: string;
  productGroupName: string;
  unit: string;
  salesDivisionCode?: number;
  uomForMls: string;
  conversionFactor: number;
  conversionFactorUnit: string;
  costCentreCode?: string;
  isClosed: boolean;
  updatedBy?: string;
  updatedTimestamp?: string;
  revNo: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateProductGroupData {
  code: string;
  level: string;
  productGroupName: string;
  unit: string;
  salesDivisionCode?: number;
  uomForMls: string;
  conversionFactor: number;
  conversionFactorUnit: string;
  costCentreCode?: string;
  isClosed: boolean;
  revNo: string;
  isActive: boolean;
}

export interface UpdateProductGroupData {
  code: string;
  level: string;
  productGroupName: string;
  unit: string;
  salesDivisionCode?: number;
  uomForMls: string;
  conversionFactor: number;
  conversionFactorUnit: string;
  costCentreCode?: string;
  isClosed: boolean;
  revNo: string;
  isActive: boolean;
}

export interface ProductGroupFilter {
  search?: string;
  level?: string;
  isActive?: boolean;
  page?: number;
  pageSize?: number;
} 