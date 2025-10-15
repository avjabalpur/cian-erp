export interface ItemType {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
}

export type CreateItemTypeData = Omit<ItemType, 'id' | 'isActive'>;

export type UpdateItemTypeData = Partial<CreateItemTypeData>;
