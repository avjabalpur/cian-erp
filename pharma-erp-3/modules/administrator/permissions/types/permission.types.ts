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

export interface CreatePermissionData {
  name: string;
  description?: string | null;
  moduleName: string;
  actionType: string;
}

export interface UpdatePermissionData extends Partial<CreatePermissionData> {
  id: number;
}

