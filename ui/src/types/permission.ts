export interface Permission {
  id: number;
  name: string;
  description?: string | null;
  moduleName: string;
  actionType: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreatePermissionInput {
  name: string;
  description?: string | null;
  moduleName: string;
  actionType: string;
}

export interface UpdatePermissionInput extends Partial<CreatePermissionInput> {
  id: number;
}