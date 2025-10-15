export interface Organization {
  id: number;
  code: string;
  name: string;
  locationTypeId: number;
  locationTypeName?: string;
  contactPerson?: string;
  // Address fields
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  country?: string;
  zip?: string;
  // Contact fields
  phone?: string;
  email?: string;
  website?: string;
  // Tax fields
  gstinNumber?: string;
  tdsCycle?: string;
  employmentStatusCode?: string;
  esiOfficeCode?: string;
  excReginCode?: string;
  stRegnCode?: string;
  cinNumber?: string;
  interfaceCode?: string;
  licenseNumber?: string;
  eccNumber?: string;
  range?: string;
  division?: string;
  collectorate?: string;
  drugLicenseNumber1?: string;
  drugLicenseNumber2?: string;
  foodLicenseNumber?: string;
  cstRegnNumber?: string;
  vatTinNumber?: string;
  panNumber?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type CreateOrganizationData = Omit<Organization, 'id' | 'locationTypeName' | 'createdAt' | 'updatedAt'>;
export type UpdateOrganizationData = Partial<CreateOrganizationData>;
