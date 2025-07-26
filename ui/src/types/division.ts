export interface Division {
  id: number;
  code: string;
  name: string;
  description?: string;
  departmentId?: number;
  unit?: string;
  conversionFactor?: number;
  isActive: boolean;
}

export type CreateDivisionData = Omit<Division, 'id'>;

export type UpdateDivisionData = Partial<CreateDivisionData>;
