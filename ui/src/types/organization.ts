export interface Organization {
  id: number;
  code: string;
  locationTypeId: number;
  name: string;
  contactPerson?: string;
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  country?: string;
  zip?: string;
  phone?: string;
  email?: string;
  website?: string;
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
  createdAt: string;
  updatedAt: string;
  createdBy?: number;
  updatedBy?: number;
}

export type CreateOrganizationData = Omit<Organization, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>;

export type UpdateOrganizationData = Partial<CreateOrganizationData> & { id: number };

export interface OrganizationFilter {
  searchTerm?: string;
  isActive?: boolean;
  locationTypeId?: number;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortDescending?: boolean;
}
