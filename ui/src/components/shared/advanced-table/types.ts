// Column interface for table metadata
export interface Column {
  name: string
  data_type: string
  description: string | null
}

// Additional types specific to the advanced table
export type FilterType = 'string' | 'number' | 'boolean' | 'date' | 'unknown'

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
}
