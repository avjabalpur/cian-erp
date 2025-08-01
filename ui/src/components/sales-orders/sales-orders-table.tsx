"use client"

import { useMemo } from "react"
import { FileText, MessageSquare, Calculator } from "lucide-react"
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
    { name: 'soNumber', data_type: 'string', description: 'Sales Order Number', isDefault: true },
    { name: 'soDate', data_type: 'date', description: 'Sales Order Date', isDefault: true },
    { name: 'soStatus', data_type: 'string', description: 'Status', isDefault: true },
    { name: 'customerName', data_type: 'string', description: 'Customer Name', isDefault: true },
    { name: 'itemName', data_type: 'string', description: 'Item Name', isDefault: false },
    { name: 'divisionName', data_type: 'string', description: 'Division', isDefault: false },
    { name: 'quantity', data_type: 'string', description: 'Quantity', isDefault: false },
    { name: 'billingRate', data_type: 'string', description: 'Billing Rate', isDefault: false },
    { name: 'assignedDesignerName', data_type: 'string', description: 'Assigned Designer', isDefault: false },
    { name: 'isSubmitted', data_type: 'boolean', description: 'Submitted', isDefault: false },
    { name: 'createdByName', data_type: 'string', description: 'Created By', isDefault: false },
    { name: 'createdAt', data_type: 'date', description: 'Created At', isDefault: false },
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
        label: 'Details',
        icon: FileText,
        onClick: onView,
        variant: 'default' as const,
      },
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
    ]
  }

  return (
    <div className="w-full">
      <AdvancedTable
        data={transformedSalesOrders}
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
        manualFiltering={false}
        manualSorting={true}
    /*     onGlobalFilterChange={onGlobalFilterChange}
        onColumnFiltersChange={onColumnFiltersChange} */
        onSortingChange={onSortingChange}
      />
    </div>
  )
} 