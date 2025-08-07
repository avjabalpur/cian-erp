"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { MoreHorizontal, Edit, Trash2, Eye } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AdvancedTable } from "@/components/shared/advanced-table";
import { Customer } from "@/types/customer";
import { getCustomerTypeLabel, getSegmentLabel, getExportTypeLabel } from "@/lib/utils/customer-utils";

interface CustomersTableProps {
  customers: Customer[];
  onEdit: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
  onView: (customer: Customer) => void;
  isLoading?: boolean;
  pageCount: number;
  pageSize: number;
  pageIndex: number;
  totalCount: number;
  onPaginationChange: (pageIndex: number, pageSize: number) => void;
}

export default function CustomersTable({
  customers,
  onEdit,
  onDelete,
  onView,
  isLoading = false,
  pageCount,
  pageSize,
  pageIndex,
  totalCount,
  onPaginationChange,
}: CustomersTableProps) {
  const [rowSelection, setRowSelection] = useState({});

  const columns: ColumnDef<Customer>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "customerCode",
      header: "Customer Code",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("customerCode")}</div>
      ),
    },
    {
      accessorKey: "customerName",
      header: "Customer Name",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("customerName")}</div>
      ),
    },
    {
      accessorKey: "shortName",
      header: "Short Name",
      cell: ({ row }) => (
        <div className="text-muted-foreground">
          {row.getValue("shortName") || "-"}
        </div>
      ),
    },
    {
      accessorKey: "customerTypeCode",
      header: "Type",
      cell: ({ row }) => {
        const value = row.getValue("customerTypeCode") as string;
        return (
          <div className="text-muted-foreground">
            {value ? getCustomerTypeLabel(value) : "-"}
          </div>
        );
      },
    },
    {
      accessorKey: "gstin",
      header: "GSTIN",
      cell: ({ row }) => (
        <div className="text-muted-foreground">
          {row.getValue("gstin") || "-"}
        </div>
      ),
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => {
        const isActive = row.getValue("isActive") as boolean;
        return (
          <Badge variant={isActive ? "default" : "secondary"}>
            {isActive ? "Active" : "Inactive"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "isExportCustomer",
      header: "Export",
      cell: ({ row }) => {
        const isExport = row.getValue("isExportCustomer") as boolean;
        return (
          <Badge variant={isExport ? "outline" : "secondary"}>
            {isExport ? "Export" : "Domestic"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => {
        const date = new Date(row.getValue("createdAt"));
        return (
          <div className="text-muted-foreground">
            {date.toLocaleDateString()}
          </div>
        );
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const customer = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => onView(customer)}>
                <Eye className="mr-2 h-4 w-4" />
                View
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onEdit(customer)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(customer)}
                className="text-red-600"
              >
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
      data={customers}
      columns={columns}
      isLoading={isLoading}
      pageCount={pageCount}
      pageSize={pageSize}
      pageIndex={pageIndex}
      totalCount={totalCount}
      onPaginationChange={onPaginationChange}
      rowSelection={rowSelection}
      onRowSelectionChange={setRowSelection}
    />
  );
} 