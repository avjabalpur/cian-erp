export interface ProductType {
  id: number;
  code: string;
  name: string;
  description?: string;
  parentTypeId?: number;
  parentTypeName?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type CreateProductTypeData = Omit<ProductType, 'id' | 'parentTypeName' | 'createdAt' | 'updatedAt'>;
export type UpdateProductTypeData = Partial<CreateProductTypeData>;
