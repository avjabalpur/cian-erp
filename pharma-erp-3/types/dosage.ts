export interface Dosage {
  id: number
  name: string
  registerDate: string
  isActive: boolean
  createdAt: string
  updatedAt?: string
  createdBy?: number
  updatedBy?: number
}

export interface CreateDosageRequest {
  name: string
  registerDate?: string
  isActive: boolean
}

export interface UpdateDosageRequest {
  name: string
  registerDate?: string
  isActive: boolean
}

export interface DosageFilter {
  name?: string
  isActive?: boolean
  page?: number
  pageSize?: number
  sortBy?: string
  sortDirection?: 'ASC' | 'DESC'
}

export interface DosageResponse {
  items: Dosage[]
  totalCount: number
} 