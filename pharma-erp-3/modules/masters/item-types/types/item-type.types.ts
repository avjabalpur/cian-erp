export interface ItemType {
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

export type CreateItemTypeData = Omit<ItemType, 'id' | 'parentTypeName' | 'createdAt' | 'updatedAt'>;
export type UpdateItemTypeData = Partial<CreateItemTypeData>;
