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
  listCode?: string;
  listName?: string;
}

export interface CreateConfigListData {
  listCode: string;
  listName: string;
  description?: string;
  isActive?: boolean;
}

export type UpdateConfigListData = CreateConfigListData;

export interface CreateConfigListValueData {
  listId: number;
  valueCode: string;
  valueName: string;
  displayOrder?: number;
  isActive?: boolean;
  extraData?: any;
}

export type UpdateConfigListValueData = CreateConfigListValueData;

export interface ConfigListFilter {
  search?: string;
  isActive?: boolean;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
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

