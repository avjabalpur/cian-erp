export interface LocationType {
  id: number;
  code: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: number;
  updatedBy?: number;
}

export type CreateLocationTypeData = Omit<LocationType, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>;

export type UpdateLocationTypeData = Partial<CreateLocationTypeData> & { id: number };
