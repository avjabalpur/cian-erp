export interface ConfigList {
  id: number;
  listCode: string;
  listName: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
  createdBy?: number;
  updatedBy?: number;
}

export interface CreateConfigListData {
  listCode: string;
  listName: string;
  description?: string;
  isActive?: boolean;
}

export interface UpdateConfigListData {
  listCode: string;
  listName: string;
  description?: string;
  isActive?: boolean;
}

export interface ConfigListFilter {
  search?: string;
  isActive?: boolean;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ConfigListValue {
  id: number;
  listId: number;
  valueCode: string;
  valueName: string;
  displayOrder: number;
  isActive: boolean;
  extraData?: any;
  createdAt: string;
  updatedAt?: string;
  createdBy?: number;
  updatedBy?: number;
  // Navigation properties
  listCode?: string;
  listName?: string;
}

export interface CreateConfigListValueData {
  listId: number;
  valueCode: string;
  valueName: string;
  displayOrder?: number;
  isActive?: boolean;
  extraData?: any;
}

export interface UpdateConfigListValueData {
  listId: number;
  valueCode: string;
  valueName: string;
  displayOrder?: number;
  isActive?: boolean;
  extraData?: any;
}

export interface ConfigListValueFilter {
  listId?: number;
  search?: string;
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