"use client"

import { useMemo, useState } from "react"

import { formatDate } from "@/lib/date-utils"
import AdvancedTable, { Column } from "../shared/advanced-table"
import { User } from "@/types/user"


interface UsersTableProps {
  users: User[]
  pageCount: number
  pageSize: number
  pageIndex: number
  totalCount: number
  onPaginationChange: (pageIndex: number, pageSize: number) => void
  onView: (user: User) => void
  onEdit: (user: User) => void
  onDelete: (user: User) => void
  statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }>
  isLoading?: boolean
  // Server-side operations
  onGlobalFilterChange?: (filter: string) => void
  onColumnFiltersChange?: (filters: any[]) => void
  onSortingChange?: (sorting: any[]) => void
}

export default function UsersTable({
  users,
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
}: UsersTableProps) {

  const columnMeta: Column[] = useMemo(() => [
    { 
      name: 'username', 
      data_type: 'string', 
      displayName: 'Username',
      isDefault: true
    },
    { 
      name: 'email', 
      data_type: 'string', 
      displayName: 'Email address',
      isDefault: true
    },
    { 
      name: 'firstName', 
      data_type: 'string', 
      displayName: 'First Name',
      isDefault: true
    },
    { 
      name: 'lastName', 
      data_type: 'string', 
      displayName: 'Last Name',
      isDefault: true
    },
    { 
      name: 'employeeId', 
      data_type: 'string', 
      displayName: 'Employee ID',
      isDefault: true
    },
    { 
      name: 'department', 
      data_type: 'string', 
      displayName: 'Department',
      isDefault: true
    },
    { 
      name: 'designation', 
      data_type: 'string', 
      displayName: 'Designation',
      isDefault: true
    },
    { 
      name: 'roles', 
      data_type: 'string', 
      displayName: 'Roles',
      isDefault: false
    },
    { 
      name: 'isActive', 
      data_type: 'boolean', 
      displayName: 'Active status',
      isDefault: false
    },
    { 
      name: 'lastLogin', 
      data_type: 'date', 
      displayName: 'Last Login',
      isDefault: false
    },
  ], [])

    // Transform customers data for better display
    const transformedUsers = useMemo(() => {
      return users.map(user => ({
        ...user,
        createdAt: user.createdAt ? formatDate(user.createdAt) : '',
        updatedAt: user.updatedAt ? formatDate(user.updatedAt) : '',
        isActive: user.isActive ? 'Yes' : 'No',
    }))
    }, [users])

    
  const actionButtons = {
    onView: onView,
    onEdit: onEdit,
    onDelete: onDelete,
  }

  return (
    <div className="w-full">
    <AdvancedTable
      data={transformedUsers}
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
