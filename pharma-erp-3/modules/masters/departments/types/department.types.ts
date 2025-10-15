export interface Department {
  id: number;
  code: string;
  name: string;
  description?: string;
  status: string;
  headOfDepartment?: string;
  employeeCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export type CreateDepartmentData = Omit<Department, 'id' | 'createdAt' | 'updatedAt'>;

export type UpdateDepartmentData = Partial<Omit<Department, 'id'>> & {
  id: number;
};

