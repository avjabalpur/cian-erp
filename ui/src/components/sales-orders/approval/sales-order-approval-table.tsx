"use client"

import { useMemo } from "react"
import { Edit, Copy, CheckCircle, XCircle, Clock } from "lucide-react"
import { Column } from "@/components/shared/advanced-table/types"
import { formatDate } from "@/lib/date-utils"
import AdvancedTable from "@/components/shared/advanced-table"
import { SalesOrder } from "@/types/sales-order"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"

interface SalesOrderApprovalTableProps {
  salesOrders: SalesOrder[]
  pageCount: number
  pageSize: number
  pageIndex: number
  totalCount: number
  onPaginationChange: (pageIndex: number, pageSize: number) => void
  onEdit: (salesOrder: SalesOrder) => void
  onCopyLink: (salesOrder: SalesOrder) => void
  statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }>
  isLoading?: boolean
  // Server-side operations
  onGlobalFilterChange?: (filter: string) => void
  onColumnFiltersChange?: (filters: any[]) => void
  onSortingChange?: (sorting: any[]) => void
}

// Approval status renderer
const ApprovalStatusRenderer = ({ value }: { value: boolean | null }) => {
  if (value === null || value === undefined) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex justify-center">
            <Clock className="h-4 w-4 text-gray-400" />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Pending</p>
        </TooltipContent>
      </Tooltip>
    )
  }
  
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex justify-center">
          {value ? (
            <div className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-xs text-green-600 font-medium">✓</span>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <XCircle className="h-4 w-4 text-red-600" />
              <span className="text-xs text-red-600 font-medium">✗</span>
            </div>
          )}
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p>{value ? 'Approved' : 'Rejected'}</p>
      </TooltipContent>
    </Tooltip>
  )
}

// SO Number renderer with color coding
const SONumberRenderer = ({ value }: { value: string }) => {
  const isCian = value?.includes("MRK")
  const isDrSmith = value?.includes("DRK")
  
  let color = "#FF9E9E" // Default red
  if (isCian) color = "green"
  else if (isDrSmith) color = "#fc6b03"
  
  return (
    <span 
      className="font-medium px-1 py-0.5 rounded text-xs"
      style={{ color, fontWeight: "500" }}
    >
      {value?.split("/").reverse().join("/") || "-"}
    </span>
  )
}

// Customer name renderer
const CustomerNameRenderer = ({ value }: { value: string }) => {
  return (
    <span className="text-orange-500 font-medium">
      {value || "-"}
    </span>
  )
}

// Product name renderer with click functionality
const ProductNameRenderer = ({ value, row }: { value: string; row: any }) => {
  return (
    <span 
      className="text-purple-600 font-medium cursor-pointer hover:underline"
      title="Click to Edit"
    >
      {value || "-"}
    </span>
  )
}

// Current status renderer with badges
const CurrentStatusRenderer = ({ value }: { value: string }) => {
  const getStatusColor = (status: string) => {
    const normalizedStatus = status?.toUpperCase() || '';
    switch (normalizedStatus) {
      case "IN-PROGRESS":
      case "IN_PROGRESS":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "COMPLETED":
        return "bg-green-100 text-green-800 border-green-200"
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "APPROVED":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "REJECTED":
        return "bg-red-100 text-red-800 border-red-200"
      case "DRAFT":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getShortName = (status: string) => {
    const normalizedStatus = status?.toUpperCase() || '';
    switch (normalizedStatus) {
      case "IN-PROGRESS":
      case "IN_PROGRESS":
        return "IN-PROG"
      case "COMPLETED":
        return "COMP"
      case "PENDING":
        return "PEND"
      case "APPROVED":
        return "APP"
      case "REJECTED":
        return "REJ"
      case "DRAFT":
        return "DRAFT"
      default:
        return status || "-"
    }
  }

  return (
    <Badge 
      variant="outline" 
      className={`${getStatusColor(value)} text-xs`}
    >
      {getShortName(value)}
    </Badge>
  )
}

// Email sent renderer
const EmailSentRenderer = ({ value }: { value: boolean }) => {
  return (
    <div className="flex justify-center">
      {value ? (
        <CheckCircle className="h-4 w-4 text-green-600" />
      ) : (
        <XCircle className="h-4 w-4 text-red-600" />
      )}
    </div>
  )
}

// Action buttons renderer
const ActionButtonsRenderer = ({ row, onEdit, onCopyLink }: { 
  row: any; 
  onEdit: (salesOrder: SalesOrder) => void;
  onCopyLink: (salesOrder: SalesOrder) => void;
}) => {
  return (
    <div className="flex gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="sm"
            variant="default"
            onClick={(e) => {
              e.stopPropagation()
              onEdit(row)
            }}
          >
            <Edit className="h-3 w-3" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Edit</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation()
              onCopyLink(row)
            }}
          >
            <Copy className="h-3 w-3" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Copy Form Link</p>
        </TooltipContent>
      </Tooltip>
    </div>
  )
}

export default function SalesOrderApprovalTable({
  salesOrders,
  pageCount,
  pageSize,
  pageIndex,
  totalCount,
  onPaginationChange,
  onEdit,
  onCopyLink,
  statusMap,
  isLoading,
  onGlobalFilterChange,
  onColumnFiltersChange,
  onSortingChange,
}: SalesOrderApprovalTableProps) {

  const columnMeta: Column[] = useMemo(() => [
    { 
      name: 'id', 
      data_type: 'number', 
      description: 'ID', 
      isDefault: true,
      displayName: 'ID'
    },
    { 
      name: 'soNumber', 
      data_type: 'string', 
      description: 'SO Number', 
      isDefault: true,
      displayName: 'SO Number',
      render: (value: string) => <SONumberRenderer value={value} />
    },
    { 
      name: 'createdAt', 
      data_type: 'date', 
      description: 'Date', 
      isDefault: true,
      displayName: 'Date',
      render: (value: string) => {
        if (!value) return "-"
        const date = new Date(value)
        return date.toLocaleDateString("en-US", {
          day: "numeric",
          month: "short"
        })
      }
    },
    { 
      name: 'soStatus', 
      data_type: 'string', 
      description: 'SO Status', 
      isDefault: true,
      displayName: 'SO Status',
      render: (value: string) => {
        if (!value) return "-"
        return value.toUpperCase()
      }
    },
    { 
      name: 'customerName', 
      data_type: 'string', 
      description: 'Customer', 
      isDefault: true,
      displayName: 'Customer',
      render: (value: string) => <CustomerNameRenderer value={value} />
    },
    { 
      name: 'organizationName', 
      data_type: 'string', 
      description: 'Company', 
      isDefault: true,
      displayName: 'Company'
    },
    { 
      name: 'itemName', 
      data_type: 'string', 
      description: 'Product', 
      isDefault: true,
      displayName: 'Product',
      render: (value: string, row: any) => <ProductNameRenderer value={value} row={row} />
    },
    { 
      name: 'comments', 
      data_type: 'string', 
      description: 'Comments', 
      isDefault: true,
      displayName: 'Comments'
    },
    { 
      name: 'createdByName', 
      data_type: 'string', 
      description: 'Created By', 
      isDefault: true,
      displayName: 'Created By'
    },
    { 
      name: 'assignedDesignerName', 
      data_type: 'string', 
      description: 'Designer', 
      isDefault: true,
      displayName: 'Designer'
    },
    { 
      name: 'costingApproved', 
      data_type: 'boolean', 
      description: 'Costing Approved', 
      isDefault: true,
      displayName: 'Costing Approved',
      render: (value: boolean) => <ApprovalStatusRenderer value={value} />
    },
    { 
      name: 'qaApproved', 
      data_type: 'boolean', 
      description: 'QA Approved', 
      isDefault: true,
      displayName: 'QA Approved',
      render: (value: boolean) => <ApprovalStatusRenderer value={value} />
    },
    { 
      name: 'isFinalAuthorized', 
      data_type: 'boolean', 
      description: 'Final Authorized', 
      isDefault: true,
      displayName: 'Final Authorized',
      render: (value: boolean) => <ApprovalStatusRenderer value={value} />
    },
    { 
      name: 'designerApproved', 
      data_type: 'boolean', 
      description: 'Designer Approved', 
      isDefault: true,
      displayName: 'Designer Approved',
      render: (value: boolean) => <ApprovalStatusRenderer value={value} />
    },
    { 
      name: 'finalQaApproved', 
      data_type: 'boolean', 
      description: 'QA Final Approved', 
      isDefault: true,
      displayName: 'QA Final Approved',
      render: (value: boolean) => <ApprovalStatusRenderer value={value} />
    },
    { 
      name: 'pmApproved', 
      data_type: 'boolean', 
      description: 'PM Approved', 
      isDefault: true,
      displayName: 'PM Approved',
      render: (value: boolean) => <ApprovalStatusRenderer value={value} />
    },
    { 
      name: 'currentStatus', 
      data_type: 'string', 
      description: 'Status Current', 
      isDefault: true,
      displayName: 'Status Current',
      render: (value: string) => <CurrentStatusRenderer value={value} />
    },
    { 
      name: 'plantEmailSent', 
      data_type: 'boolean', 
      description: 'Email Sent', 
      isDefault: true,
      displayName: 'Email Sent',
      render: (value: boolean) => <EmailSentRenderer value={value} />
    },
    { 
      name: 'actions', 
      data_type: 'string', 
      description: 'Action', 
      isDefault: true,
      displayName: 'Action',
      render: (value: any, row: any) => (
        <ActionButtonsRenderer 
          row={row} 
          onEdit={onEdit} 
          onCopyLink={onCopyLink} 
        />
      )
    },
  ], [onEdit, onCopyLink])

  // Transform sales orders data for better display
  const transformedSalesOrders = useMemo(() => {
    return salesOrders.map(salesOrder => ({
      ...salesOrder,
      // Format dates
      createdAt: salesOrder.createdAt ? formatDate(salesOrder.createdAt) : '',
      // Ensure all required fields have values
      soStatus: salesOrder.soStatus || 'Draft',
      customerName: salesOrder.customerName || '',
      organizationName: salesOrder.organizationName || '',
      itemName: salesOrder.itemName || '',
      comments: salesOrder.comments || '',
      createdByName: salesOrder.createdByName || '',
      assignedDesignerName: salesOrder.assignedDesignerName || '',
      currentStatus: salesOrder.currentStatus || 'IN-PROGRESS',
      plantEmailSent: salesOrder.plantEmailSent || false,
      // Approval statuses are now coming from the backend API
      // No need to override them with null values
    }))
  }, [salesOrders])

  return (
    <TooltipProvider>
      <div className="w-full">
        <AdvancedTable
          data={transformedSalesOrders}
          columnMeta={columnMeta}
          isLoading={isLoading}
          groupingEnabled={false}
          globalFilterEnabled={true}
          dragDropGroupingEnabled={false}
          onRowClick={onEdit}
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
          onGlobalFilterChange={onGlobalFilterChange}
          onColumnFiltersChange={onColumnFiltersChange}
          onSortingChange={onSortingChange}
        />
      </div>
    </TooltipProvider>
  )
} 