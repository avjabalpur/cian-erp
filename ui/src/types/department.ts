export interface Department {
  id: number;
  code: string;
  name: string;
  description?: string;
  uomForMis?: string;
  isActive: boolean;
}

export type CreateDepartmentData = Omit<Department, 'id'>;

export type UpdateDepartmentData = Partial<CreateDepartmentData>;
