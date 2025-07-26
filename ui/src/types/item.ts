export interface Item {
  id: number;
  itemCode: string;
  revNo: string;
  itemName: string;
  shortName: string;
  itemType: string;
  unitOfMeasure: string;
  stdRate: number;
  shelfLifeMonths: number;
  specification: string;
  manufactured: boolean;
  sold: boolean;
  qcRequired: boolean;
  batchApplicable: boolean;
  isActive: boolean;
  currentStock: number;
  reorderLevel: number;
  maxStock: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  hsn_code?: string;
  category?: string;
  subCategory?: string;
  brand?: string;
  manufacturer?: string;
  composition?: string;
  dosageForm?: string;
  strength?: string;
  packSize?: string;
  storageConditions?: string;
  contraindications?: string;
  sideEffects?: string;
  interactions?: string;
  warnings?: string;
}

export interface ItemFilters {
  search: string;
  itemType: string;
  status: string;
  manufactured: string;
  qcRequired: string;
}

export type CreateItemData = Omit<Item, 'id' | 'currentStock' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>;

export type UpdateItemData = Partial<CreateItemData>;
