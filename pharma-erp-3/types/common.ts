
  
export type FilterType = 'string' | 'number' | 'boolean' | 'date' | 'unknown'

export interface PaginatedResponse<T> {
    items: T[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  } 