// Column interface for table metadata
export interface Column {
  name: string
  data_type: string
  description?: string | null
  displayName?: string // Display name for the column header
  render?: CellRenderer // Custom cell renderer function
}

// Additional types specific to the advanced table
export type FilterType = 'string' | 'number' | 'boolean' | 'date' | 'unknown'

// Cell renderer function type
export type CellRenderer = (value: any, row: any) => React.ReactNode

export interface AdvancedTableProps {
  data: any[]
  columns?: string[]
  columnMeta?: Column[]
  isLoading?: boolean
  groupingEnabled?: boolean
  globalFilterEnabled?: boolean
  dragDropGroupingEnabled?: boolean
  className?: string
  onRowClick?: (row: any) => void
  actionButtons?: {
    onEdit?: (row: any) => void
    onDelete?: (row: any) => void
    onView?: (row: any) => void
  }
  // Multiple selection props
  enableRowSelection?: boolean
  selectedRows?: string[]
  onSelectionChange?: (selectedIds: string[]) => void
  rowIdField?: string
  // Bulk actions
  bulkActions?: {
    onBulkEmail?: (selectedRows: any[]) => void
    onBulkDelete?: (selectedIds: string[]) => void
  }
  // Server-side pagination props
  pageCount?: number
  pageSize?: number
  pageIndex?: number
  totalCount?: number
  onPaginationChange?: (pageIndex: number, pageSize: number) => void
  manualPagination?: boolean
  // Server-side filtering and sorting props
  onGlobalFilterChange?: (filter: string) => void
  onColumnFiltersChange?: (filters: any[]) => void
  onSortingChange?: (sorting: any[]) => void
  manualFiltering?: boolean
  manualSorting?: boolean
}
