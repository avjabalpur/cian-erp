"use client"

import { useMemo, useState } from "react"
import { formatDate } from "@/lib/date-utils"
import AdvancedTable, { Column } from "../shared/advanced-table"
import { Role } from "@/types/role"


interface RolesTableProps {
  roles: Role[]
  pageCount: number
  pageSize: number
  pageIndex: number
  totalCount: number
  onPaginationChange: (pageIndex: number, pageSize: number) => void
  onView: (role: Role) => void
  onEdit: (role: Role) => void
  onDelete: (role: Role) => void
  statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }>
  isLoading?: boolean
  // Server-side operations
  onGlobalFilterChange?: (filter: string) => void
  onColumnFiltersChange?: (filters: any[]) => void
  onSortingChange?: (sorting: any[]) => void
}

export default function RolesTable({
  roles,
  pageCount,
  pageSize,
  pageIndex,
  totalCount,
  onPaginationChange,
  onView,
  onEdit,
  onDelete,
  statusMap,
  isLoading,
  onGlobalFilterChange,
  onColumnFiltersChange,
  onSortingChange,
}: RolesTableProps) {

  const columnMeta: Column[] = useMemo(() => [
    { 
      name: 'name', 
      data_type: 'string', 
      displayName: 'Role name',
      isDefault: true
    },
    { 
      name: 'description', 
      data_type: 'string', 
      displayName: 'Role description',
      isDefault: true
    },
    { 
      name: 'isActive', 
      data_type: 'boolean', 
      displayName: 'Active status',
      isDefault: true
    },
    { 
      name: 'createdAt', 
      data_type: 'date', 
      displayName: 'Created date',
      isDefault: false
    },
  ], [])

    // Transform customers data for better display
    const transformedRoles = useMemo(() => {
      return roles.map(role => ({
        ...role,
        createdAt: role.createdAt ? formatDate(role.createdAt) : '',
        isActive: role.isActive ? 'Yes' : 'No',
    }))
    }, [roles])

    
  const actionButtons = {
    onView: onView,
    onEdit: onEdit,
    onDelete: onDelete,
  }

  return (
    <div className="w-full">
    <AdvancedTable
      data={transformedRoles}
      columnMeta={columnMeta}
      isLoading={isLoading}
      groupingEnabled={false}
      globalFilterEnabled={false}
      dragDropGroupingEnabled={false}
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
