export interface LocationType {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
}

export type CreateLocationTypeData = Omit<LocationType, 'id' | 'isActive'>;

export type UpdateLocationTypeData = Partial<CreateLocationTypeData>;
