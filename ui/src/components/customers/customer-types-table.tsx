"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import { Column } from "@/components/shared/advanced-table/types";
import AdvancedTable from "@/components/shared/advanced-table";
import { CustomerType } from "@/types/customer-type";
import { formatDate } from "@/lib/date-utils";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";

interface CustomerTypesTableProps {
  customerTypes: CustomerType[];
  isLoading: boolean;
  onEdit: (customerType: CustomerType) => void;
  onDelete: (customerType: CustomerType) => void;
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
  onEdit: (customerType: CustomerType) => void;
  onDelete: (customerType: CustomerType) => void;
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

export default function CustomerTypesTable({
  customerTypes,
  isLoading,
  onEdit,
  onDelete,
  pagination,
  onPaginationChange,
}: CustomerTypesTableProps) {
  const columnMeta: Column[] = useMemo(() => [
    { 
      name: 'code', 
      data_type: 'string', 
      description: 'Code', 
      isDefault: true,
      displayName: 'Code',
      render: (value: string) => (
        <div className="font-medium">{value || "-"}</div>
      )
    },
    { 
      name: 'name', 
      data_type: 'string', 
      description: 'Name', 
      isDefault: true,
      displayName: 'Name',
      render: (value: string) => (
        <div className="font-medium">{value || "-"}</div>
      )
    },
    { 
      name: 'description', 
      data_type: 'string', 
      description: 'Description', 
      isDefault: true,
      displayName: 'Description',
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
          data={customerTypes}
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
