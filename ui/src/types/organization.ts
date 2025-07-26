export interface Organization {
  id: number;
  name: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  phoneNumber?: string;
  email?: string;
  website?: string;
  isActive: boolean;
}

export type CreateOrganizationData = Omit<Organization, 'id' | 'isActive'>;

export type UpdateOrganizationData = Partial<CreateOrganizationData>;
