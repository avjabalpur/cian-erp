"use client"

import { useMemo } from "react"
import { Eye, Edit, Copy, ExternalLink } from "lucide-react"
import { Column } from "@/components/shared/advanced-table/types"
import { formatDate } from "@/lib/date-utils"
import AdvancedTable from "@/components/shared/advanced-table"
import { SalesOrderQuotation } from "@/types/sales-order-extended"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"

interface QuotationsTableProps {
  quotations: SalesOrderQuotation[]
  pageCount: number
  pageSize: number
  pageIndex: number
  totalCount: number
  onPaginationChange: (pageIndex: number, pageSize: number) => void
  onView: (quotation: SalesOrderQuotation) => void
  onEdit: (quotation: SalesOrderQuotation) => void
  onCopyLink: (quotation: SalesOrderQuotation) => void
  isLoading?: boolean
}

// Quotation ID renderer with action button
const QuotationIdRenderer = ({ value, row, onView }: { value: string; row: any; onView: (quotation: SalesOrderQuotation) => void }) => {
  return (
    <div className="flex items-center gap-2">
      <span className="font-medium text-blue-600 cursor-pointer hover:underline" onClick={() => onView(row)}>
        {value}
      </span>
    </div>
  )
}

// Quotation number renderer with color coding
const QuotationNumberRenderer = ({ value }: { value: string }) => {
  return (
    <span className="font-medium text-green-600">
      {value || "-"}
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

// Amount renderer with currency formatting
const AmountRenderer = ({ value }: { value: number }) => {
  if (!value) return <span className="text-gray-400">-</span>
  
  return (
    <span className="font-medium">
      ₹{value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
    </span>
  )
}

// Advance amount renderer with percentage
const AdvanceAmountRenderer = ({ row }: { row: any }) => {
  const { advanceAmount, totalAmount } = row
  
  if (!advanceAmount || !totalAmount) {
    return <span className="text-gray-400">-</span>
  }
  
  const percentage = ((advanceAmount / totalAmount) * 100).toFixed(1)
  
  return (
    <div className="text-center">
      <div className="font-medium">₹{advanceAmount.toLocaleString('en-IN')}</div>
      <div className="text-xs text-muted-foreground">{percentage}%</div>
    </div>
  )
}

// Company badge renderer
const CompanyRenderer = ({ value }: { value: string }) => {
  const getCompanyColor = (company: string) => {
    switch (company?.toUpperCase()) {
      case "CIAN HEALTHCARE":
      case "CIAN":
        return "bg-green-100 text-green-800 border-green-200"
      case "DR. SMITH":
      case "DR SMITH":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "BAYBERRY":
        return "bg-purple-100 text-purple-800 border-purple-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <Badge variant="outline" className={`${getCompanyColor(value)} text-xs`}>
      {value || "N/A"}
    </Badge>
  )
}

// Action buttons renderer
const ActionButtonsRenderer = ({ 
  row, 
  onView, 
  onEdit, 
  onCopyLink 
}: { 
  row: any; 
  onView: (quotation: SalesOrderQuotation) => void;
  onEdit: (quotation: SalesOrderQuotation) => void;
  onCopyLink: (quotation: SalesOrderQuotation) => void;
}) => {
  return (
    <div className="flex gap-1">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation()
              onView(row)
            }}
          >
            <Eye className="h-3 w-3" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>View</p>
        </TooltipContent>
      </Tooltip>
      
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="sm"
            variant="outline"
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
          <p>Copy Link</p>
        </TooltipContent>
      </Tooltip>
      
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation()
              // Navigate to new page
              window.open(`/quotations/${row.id}`, '_blank')
            }}
          >
            <ExternalLink className="h-3 w-3" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Create New</p>
        </TooltipContent>
      </Tooltip>
    </div>
  )
}

export function QuotationsTable({
  quotations,
  pageCount,
  pageSize,
  pageIndex,
  totalCount,
  onPaginationChange,
  onView,
  onEdit,
  onCopyLink,
  isLoading,
}: QuotationsTableProps) {

  const columnMeta: Column[] = useMemo(() => [
    { 
      name: 'id', 
      data_type: 'number', 
      description: 'QT ID', 
      isDefault: true,
      displayName: 'QT ID',
      render: (value: string, row: any) => (
        <QuotationIdRenderer value={value} row={row} onView={onView} />
      )
    },
    { 
      name: 'quotationNumber', 
      data_type: 'string', 
      description: 'QO Number', 
      isDefault: true,
      displayName: 'QO Number',
      render: (value: string) => <QuotationNumberRenderer value={value} />
    },
    { 
      name: 'quotationDate', 
      data_type: 'date', 
      description: 'Date', 
      isDefault: true,
      displayName: 'Date',
      render: (value: string) => {
        if (!value) return "-"
        return formatDate(value)
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
      displayName: 'Company',
      render: (value: string) => <CompanyRenderer value={value} />
    },
    { 
      name: 'createdByName', 
      data_type: 'string', 
      description: 'Created By', 
      isDefault: true,
      displayName: 'Created By'
    },
    { 
      name: 'totalAmount', 
      data_type: 'number', 
      description: 'Total Amount', 
      isDefault: true,
      displayName: 'Total Amount',
      render: (value: number) => <AmountRenderer value={value} />
    },
    { 
      name: 'advanceAmount', 
      data_type: 'number', 
      description: 'Advance Amount', 
      isDefault: true,
      displayName: 'Advance Amount',
      render: (value: any, row: any) => <AdvanceAmountRenderer row={row} />
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
          onView={onView} 
          onEdit={onEdit} 
          onCopyLink={onCopyLink} 
        />
      )
    },
  ], [onView, onEdit, onCopyLink])

  // Transform quotations data for better display
  const transformedQuotations = useMemo(() => {
    return quotations.map(quotation => ({
      ...quotation,
      // Ensure all required fields have values
      quotationNumber: quotation.quotationNumber || '',
      quotationDate: quotation.quotationDate || '',
      customerName: quotation.customerName || '',
      organizationName: quotation.organizationName || '',
      createdByName: quotation.createdByName || '',
      totalAmount: quotation.totalAmount || 0,
      advanceAmount: quotation.advanceAmount || 0,
    }))
  }, [quotations])

  return (
    <TooltipProvider>
      <div className="w-full">
        <AdvancedTable
          data={transformedQuotations}
          columnMeta={columnMeta}
          isLoading={isLoading}
          groupingEnabled={false}
          globalFilterEnabled={true}
          dragDropGroupingEnabled={false}
          onRowClick={onView}
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
        />
      </div>
    </TooltipProvider>
  )
}
