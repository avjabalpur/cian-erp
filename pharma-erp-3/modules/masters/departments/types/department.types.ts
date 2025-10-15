export interface Department {
  id: number;
  code: string;
  name: string;
  description?: string;
  uomForMis?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type CreateDepartmentData = Omit<Department, 'id' | 'createdAt' | 'updatedAt'>;

export type UpdateDepartmentData = Partial<CreateDepartmentData>;

