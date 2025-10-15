export interface UnitOfMeasure {
  id: number;
  name: string;
  abbreviation: string;
  isActive: boolean;
}

export type CreateUnitOfMeasureData = Omit<UnitOfMeasure, 'id' | 'isActive'>;

export type UpdateUnitOfMeasureData = Partial<CreateUnitOfMeasureData>;
