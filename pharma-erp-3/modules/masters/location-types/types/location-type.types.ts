export interface LocationType {
  id: number;
  code: string;
  name: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type CreateLocationTypeData = Omit<LocationType, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateLocationTypeData = Partial<CreateLocationTypeData>;
