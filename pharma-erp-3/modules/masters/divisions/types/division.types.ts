export interface Division {
  id: number;
  code: string;
  name: string;
  description?: string;
  departmentId: number;
  departmentName?: string;
  unit?: string;
  conversionFactor?: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type CreateDivisionData = Omit<Division, 'id' | 'departmentName' | 'createdAt' | 'updatedAt'>;
export type UpdateDivisionData = Partial<CreateDivisionData>;

export interface Department {
  id: number;
  name: string;
}
