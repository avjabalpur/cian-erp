export interface Role {
  id: number,
  name: string,
  description:string,
  isActive: boolean,
  createdAt: string,
}

export interface CreateRoleInput {
  name: string;
  description?: string | null;
  isActive: boolean;
}

export interface UpdateRoleInput extends Partial<CreateRoleInput> {
  id: number;
}
