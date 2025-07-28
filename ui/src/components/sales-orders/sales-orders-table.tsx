"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Search, Edit, Trash2, Eye, FileText, MessageSquare, Calculator } from "lucide-react"
import { Column } from "@/types/common"
import { formatDate } from "@/lib/date-utils"
import AdvancedTable from "../shared/advanced-table"
import { SalesOrder } from "@/types/sales-order"

interface SalesOrdersTableProps {
  salesOrders: SalesOrder[]
  pageCount: number
  pageSize: number
  pageIndex: number
  totalCount: number
  onPaginationChange: (pageIndex: number, pageSize: number) => void
  onView: (salesOrder: SalesOrder) => void
  onEdit: (salesOrder: SalesOrder) => void
  onDelete: (salesOrder: SalesOrder) => void
  onViewComments?: (salesOrder: SalesOrder) => void
  onViewQuotations?: (salesOrder: SalesOrder) => void
  onViewDocuments?: (salesOrder: SalesOrder) => void
  statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }>
  isLoading?: boolean
  // Server-side operations
  onGlobalFilterChange?: (filter: string) => void
  onColumnFiltersChange?: (filters: any[]) => void
  onSortingChange?: (sorting: any[]) => void
}

export default function SalesOrdersTable({
  salesOrders,
  pageCount,
  pageSize,
  pageIndex,
  totalCount,
  onPaginationChange,
  onView,
  onEdit,
  onDelete,
  onViewComments,
  onViewQuotations,
  onViewDocuments,
  statusMap,
  isLoading,
  onGlobalFilterChange,
  onColumnFiltersChange,
  onSortingChange,
}: SalesOrdersTableProps) {

  const columnMeta: Column[] = useMemo(() => [
    { name: 'soNumber', data_type: 'string', description: 'Sales Order Number' },
    { name: 'soDate', data_type: 'date', description: 'Sales Order Date' },
    { name: 'soStatus', data_type: 'string', description: 'Status' },
    { name: 'customerName', data_type: 'string', description: 'Customer Name' },
    { name: 'itemName', data_type: 'string', description: 'Item Name' },
    { name: 'divisionName', data_type: 'string', description: 'Division' },
    { name: 'quantity', data_type: 'string', description: 'Quantity' },
    { name: 'billingRate', data_type: 'string', description: 'Billing Rate' },
    { name: 'assignedDesignerName', data_type: 'string', description: 'Assigned Designer' },
    { name: 'isSubmitted', data_type: 'boolean', description: 'Submitted' },
    { name: 'createdByName', data_type: 'string', description: 'Created By' },
    { name: 'createdAt', data_type: 'date', description: 'Created At' },
  ], [])
  
  const defaultColumns = [
    'soNumber',
    'soDate',
    'soStatus',
    'customerName',
    'itemName',
    'divisionName',
    'quantity',
    'billingRate',
    'assignedDesignerName',
    'isSubmitted',
  ]

  // Transform sales orders data for better display
  const transformedSalesOrders = useMemo(() => {
    return salesOrders.map(salesOrder => ({
      ...salesOrder,
      soDate: salesOrder.soDate ? formatDate(salesOrder.soDate) : '',
      createdAt: salesOrder.createdAt ? formatDate(salesOrder.createdAt) : '',
      updatedAt: salesOrder.updatedAt ? formatDate(salesOrder.updatedAt) : '',
      isSubmitted: salesOrder.isSubmitted ? 'Yes' : 'No',
      soStatus: salesOrder.soStatus || 'Draft',
    }))
  }, [salesOrders])

  const actionButtons = {
    onView: onView,
    onEdit: onEdit,
    onDelete: onDelete,
    customActions: [
      {
        label: 'Comments',
        icon: MessageSquare,
        onClick: onViewComments,
        variant: 'outline' as const,
      },
      {
        label: 'Quotations',
        icon: Calculator,
        onClick: onViewQuotations,
        variant: 'outline' as const,
      },
      {
        label: 'Documents',
        icon: FileText,
        onClick: onViewDocuments,
        variant: 'outline' as const,
      },
    ].filter(action => action.onClick), // Only show actions that have handlers
  }

  return (
    <div className="w-full">
      <AdvancedTable
        data={transformedSalesOrders}
        columns={defaultColumns}
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