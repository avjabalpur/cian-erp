export interface HsnMaster {
  id: number;
  code: string;
  name: string;
  description: string;
  hsnType?: string;
  uqc?: string;
  igstRate: number;
  cgstRate: number;
  sgstRate: number;
  cessRate: number;
  isReverseCharges: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
  createdBy?: number;
  updatedBy?: number;
}

export interface CreateHsnMasterData {
  code: string;
  name: string;
  description: string;
  hsnType?: string;
  uqc?: string;
  igstRate?: number;
  cgstRate?: number;
  sgstRate?: number;
  cessRate?: number;
  isReverseCharges?: boolean;
  isActive?: boolean;
}

export interface UpdateHsnMasterData {
  code: string;
  name: string;
  description: string;
  hsnType?: string;
  uqc?: string;
  igstRate?: number;
  cgstRate?: number;
  sgstRate?: number;
  cessRate?: number;
  isReverseCharges?: boolean;
  isActive?: boolean;
}

export interface HsnMasterFilter {
  search?: string;
  hsnType?: string;
  isActive?: boolean;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
