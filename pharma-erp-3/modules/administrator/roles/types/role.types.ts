export interface Role {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateRoleData {
  name: string;
  description?: string | null;
  isActive: boolean;
}

export interface UpdateRoleData extends Partial<CreateRoleData> {
  id: number;
}

