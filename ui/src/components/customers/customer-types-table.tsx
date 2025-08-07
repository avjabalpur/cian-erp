"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { AdvancedTable } from "@/components/shared/advanced-table";
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

export default function CustomerTypesTable({
  customerTypes,
  isLoading,
  onEdit,
  onDelete,
  pagination,
  onPaginationChange,
}: CustomerTypesTableProps) {
  const columnMeta = [
    {
      accessorKey: "code",
      header: "Code",
      cell: ({ row }: any) => (
        <div className="font-medium">{row.original.code}</div>
      ),
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }: any) => (
        <div className="font-medium">{row.original.name}</div>
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }: any) => (
        <div>{row.original.description || "-"}</div>
      ),
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }: any) => (
        <Badge variant={row.original.isActive ? "default" : "secondary"}>
          {row.original.isActive ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Created Date",
      cell: ({ row }: any) => (
        <div>{formatDate(row.original.createdAt)}</div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: any) => {
        const customerType = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(customerType)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(customerType)}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <AdvancedTable
      data={customerTypes}
      columnMeta={columns}
      isLoading={isLoading}
      pagination={pagination}
      onPaginationChange={onPaginationChange}
      searchPlaceholder="Search customer types..."
      enableSearch={false}
      enableColumnFilters={false}
      enableSorting={true}
      enableColumnResizing={true}
      enableRowSelection={false}
      enableGrouping={false}
      enableDensityToggle={true}
      enableFullScreenToggle={true}
      enableExport={true}
      exportFileName="customer-types"
    />
  );
}
