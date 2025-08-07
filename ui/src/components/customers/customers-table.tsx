"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import { Column } from "@/components/shared/advanced-table/types";
import AdvancedTable from "@/components/shared/advanced-table";
import { Customer } from "@/types/customer";
import { getCustomerTypeLabel, getSegmentLabel, getExportTypeLabel, getContinentLabel, getCustomerSaleTypeLabel } from "@/lib/utils/customer-utils";
import { formatDate } from "@/lib/date-utils";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";

interface CustomersTableProps {
  customers: Customer[];
  isLoading: boolean;
  onEdit: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
  pagination: {
    pageIndex: number;
    pageSize: number;
    pageCount: number;
    totalCount: number;
  };
  onPaginationChange: (pageIndex: number, pageSize: number) => void;
}

// Action buttons renderer
const ActionButtonsRenderer = ({ row, onEdit, onDelete }: { 
  row: any; 
  onEdit: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
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
              onDelete(row)
            }}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Delete</p>
        </TooltipContent>
      </Tooltip>
    </div>
  )
}

export default function CustomersTable({
  customers,
  isLoading,
  onEdit,
  onDelete,
  pagination,
  onPaginationChange,
}: CustomersTableProps) {
  const columnMeta: Column[] = useMemo(() => [
    { 
      name: 'customerCode', 
      data_type: 'string', 
      description: 'Customer Code', 
      isDefault: true,
      displayName: 'Customer Code',
      render: (value: string) => (
        <div className="font-medium">{value || "-"}</div>
      )
    },
    { 
      name: 'customerName', 
      data_type: 'string', 
      description: 'Customer Name', 
      isDefault: true,
      displayName: 'Customer Name',
      render: (value: string) => (
        <div className="font-medium">{value || "-"}</div>
      )
    },
    { 
      name: 'shortName', 
      data_type: 'string', 
      description: 'Short Name', 
      isDefault: true,
      displayName: 'Short Name',
      render: (value: string) => (
        <div>{value || "-"}</div>
      )
    },
    { 
      name: 'customerTypeCode', 
      data_type: 'string', 
      description: 'Customer Type', 
      isDefault: true,
      displayName: 'Customer Type',
      render: (value: string) => (
        <div>{value ? getCustomerTypeLabel(value) : "-"}</div>
      )
    },
    { 
      name: 'gstin', 
      data_type: 'string', 
      description: 'GSTIN', 
      isDefault: true,
      displayName: 'GSTIN',
      render: (value: string) => (
        <div>{value || "-"}</div>
      )
    },
    { 
      name: 'isActive', 
      data_type: 'boolean', 
      description: 'Status', 
      isDefault: true,
      displayName: 'Status',
      render: (value: boolean) => (
        <Badge variant={value ? "default" : "secondary"}>
          {value ? "Active" : "Inactive"}
        </Badge>
      )
    },
    { 
      name: 'isExportCustomer', 
      data_type: 'boolean', 
      description: 'Export Customer', 
      isDefault: true,
      displayName: 'Export Customer',
      render: (value: boolean) => (
        <Badge variant={value ? "default" : "outline"}>
          {value ? "Yes" : "No"}
        </Badge>
      )
    },
    { 
      name: 'createdAt', 
      data_type: 'date', 
      description: 'Created Date', 
      isDefault: true,
      displayName: 'Created Date',
      render: (value: string) => (
        <div>{formatDate(value)}</div>
      )
    },
    { 
      name: 'actions', 
      data_type: 'string', 
      description: 'Actions', 
      isDefault: true,
      displayName: 'Actions',
      render: (value: any, row: any) => (
        <ActionButtonsRenderer 
          row={row} 
          onEdit={onEdit} 
          onDelete={onDelete} 
        />
      )
    },
  ], [onEdit, onDelete]);

  return (
    <TooltipProvider>
      <div className="w-full">
        <AdvancedTable
          data={customers}
          columnMeta={columnMeta}
          isLoading={isLoading}
          groupingEnabled={false}
          globalFilterEnabled={true}
          dragDropGroupingEnabled={false}
          onRowClick={onEdit}
          className="w-full"
          // Server-side pagination
          manualPagination={true}
          pageCount={pagination.pageCount}
          pageSize={pagination.pageSize}
          pageIndex={pagination.pageIndex}
          totalCount={pagination.totalCount}
          onPaginationChange={onPaginationChange}
          // Server-side filtering and sorting
          manualFiltering={false}
          manualSorting={true}
        />
      </div>
    </TooltipProvider>
  );
}
