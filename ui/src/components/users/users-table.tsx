"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Search, Edit, Trash2, UserCheck, UserX } from "lucide-react"
import { Column } from "@/types/common"
import { formatDate } from "@/lib/date-utils"
import AdvancedTable from "../shared/advanced-table"
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
    { name: 'username', data_type: 'string', description: 'Username' },
    { name: 'email', data_type: 'string', description: 'Email address' },
    { name: 'firstName', data_type: 'string', description: 'First Name' },
    { name: 'lastName', data_type: 'string', description: 'Last Name' },
    { name: 'employeeId', data_type: 'string', description: 'Employee ID' },
    { name: 'department', data_type: 'string', description: 'Department' },
    { name: 'designation', data_type: 'string', description: 'Designation' },
    { name: 'roles', data_type: 'string', description: 'Roles' },
    { name: 'isActive', data_type: 'boolean', description: 'Active status' },
    { name: 'lastLogin', data_type: 'date', description: 'Last Login' },
  ], [])
  
  const defaultColumns = [
    'username',
    'email',
    'firstName',
    'lastName',
    'employeeId',
    'department',
    'designation',
  ]

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
