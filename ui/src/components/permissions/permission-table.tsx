"use client"

import { useMemo } from 'react'
import { AdvancedTable } from '@/components/shared/advanced-table'
import { Permission } from '@/types/permission'
import { formatDate } from '@/lib/date-utils'
import { Column } from '@/components/shared/advanced-table/types'

interface PermissionTableProps {
  permissions: Permission[]
  pageCount: number
  pageSize: number
  pageIndex: number
  totalCount: number
  onPaginationChange: (pageIndex: number, pageSize: number) => void
  onView: (permission: Permission) => void
  onEdit: (permission: Permission) => void
  onDelete: (permission: Permission) => void
  isLoading?: boolean
  // Server-side operations
  onGlobalFilterChange?: (filter: string) => void
  onColumnFiltersChange?: (filters: { id: string; value: unknown }[]) => void
  onSortingChange?: (sorting: { id: string; desc: boolean }[]) => void
}

export function PermissionTable({
  permissions,
  pageCount,
  pageSize,
  pageIndex,
  totalCount,
  onPaginationChange,
  onView,
  onEdit,
  onDelete,
  isLoading = false,
  onGlobalFilterChange,
  onColumnFiltersChange,
  onSortingChange
}: PermissionTableProps) {
  // Define column metadata for proper filtering and display
  const columnMeta: Column[] = useMemo(() => [
    { name: 'name', data_type: 'string', description: 'Role name' },
    { name: 'moduleName', data_type: 'string', description: 'Module' },
    { name: 'description', data_type: 'string', description: 'description' },
    { name: 'actionType', data_type: 'string', description: 'Module' },
    { name: 'isActive', data_type: 'boolean', description: 'Active status' },
    { name: 'createdAt', data_type: 'date', description: 'Created date' },
    { name: 'updatedAt', data_type: 'date', description: 'Updated date' },
  ], [])

  // Define which columns to show by default
  const defaultColumns = [
    'name',
    'moduleName',
    'actionType',
    'isActive',
    'createdAt'
  ]

  // Transform roles data for better display
  const transformedPermissions = useMemo(() => {
    return permissions.map(permission => ({
      ...permission,
      // Format dates for better display
      createdAt: permission.createdAt ? formatDate(permission.createdAt) : '',
      updatedAt: permission.updatedAt ? formatDate(permission.updatedAt) : '',
      // Format boolean values
      isActive: permission.isActive ? 'Active' : 'Inactive',
    }))
  }, [permissions])

  const actionButtons = {
    onView: onView,
    onEdit: onEdit,
    onDelete: onDelete,
  }

  return (
    <div className="w-full">
      <AdvancedTable
        data={transformedPermissions}
        columns={defaultColumns}
        columnMeta={columnMeta}
        isLoading={isLoading}
        groupingEnabled={true}
        globalFilterEnabled={true}
        dragDropGroupingEnabled={true}
        onRowClick={onView}
        actionButtons={actionButtons}
        className="w-full"
        // Server-side pagination
        manualPagination={true}
        pageCount={pageCount}
        pageSize={pageSize}
        pageIndex={pageIndex}
        totalCount={totalCount}
        onPaginationChange={onPaginationChange}
        // Server-side filtering and sorting
        manualFiltering={true}
        manualSorting={true}
        onGlobalFilterChange={onGlobalFilterChange}
        onColumnFiltersChange={onColumnFiltersChange}
        onSortingChange={onSortingChange}
      />
    </div>
  )
}
