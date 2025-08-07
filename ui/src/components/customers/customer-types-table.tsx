"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { Column } from "@/components/shared/advanced-table/types";
import AdvancedTable from "@/components/shared/advanced-table";
import { CustomerType } from "@/types/customer-type";
import { formatDate } from "@/lib/date-utils";

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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onEdit(row)}>
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onDelete(row)}>
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

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

  const actionButtons = {
    onEdit: onEdit,
    onDelete: onDelete,
    customActions: [
      {
        label: 'Edit',
        icon: Edit,
        onClick: onEdit,
        variant: 'outline' as const,
      },
      ...(onDelete ? [{
        label: 'Delete',
        icon: Trash2,
        onClick: onDelete,
        variant: 'destructive' as const,
      }] : []),
    ]
  };
  return (
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
  );
}
