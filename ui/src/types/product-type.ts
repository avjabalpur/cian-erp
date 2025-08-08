export interface ProductType {
  id: number;
  code: string;
  name: string;
  description?: string;
  parentTypeId?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: number;
  updatedBy?: number;
  parentType?: ProductType;
  childTypes?: ProductType[];
}

export interface CreateProductTypeData {
  code: string;
  name: string;
  description?: string;
  parentTypeId?: number;
  isActive: boolean;
}

export interface UpdateProductTypeData {
  code: string;
  name: string;
  description?: string;
  parentTypeId?: number;
  isActive: boolean;
} 