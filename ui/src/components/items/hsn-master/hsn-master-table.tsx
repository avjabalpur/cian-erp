"use client";

import { useMemo } from "react";
import { Edit, Trash2 } from "lucide-react";
import { Column } from "@/types/common";
import { formatDate } from "@/lib/date-utils";
import AdvancedTable from "../../shared/advanced-table";
import { HsnMaster } from "@/types/hsn-master";

interface HsnMasterTableProps {
  hsnCodes: HsnMaster[];
  onEdit: (hsnCode: HsnMaster) => void;
  onDelete: (hsnCode: HsnMaster) => void;
  isLoading?: boolean;
  // Server-side operations
  onGlobalFilterChange?: (filter: string) => void;
  onColumnFiltersChange?: (filters: any[]) => void;
  onSortingChange?: (sorting: any[]) => void;
  // Pagination
  pageCount?: number;
  pageSize?: number;
  pageIndex?: number;
  totalCount?: number;
  onPaginationChange?: (pageIndex: number, pageSize: number) => void;
}

export default function HsnMasterTable({
  hsnCodes,
  onEdit,
  onDelete,
  isLoading,
  onGlobalFilterChange,
  onColumnFiltersChange,
  onSortingChange,
  pageCount,
  pageSize,
  pageIndex,
  totalCount,
  onPaginationChange,
}: HsnMasterTableProps) {

  const columnMeta: Column[] = useMemo(() => [
    { name: 'code', data_type: 'string', description: 'Code', isDefault: true },
    { name: 'name', data_type: 'string', description: 'Name', isDefault: true },
    { name: 'description', data_type: 'string', description: 'Description', isDefault: false },
    { name: 'hsnType', data_type: 'string', description: 'HSN Type', isDefault: true },
    { name: 'uqc', data_type: 'string', description: 'UQC', isDefault: false },
    { name: 'igstRate', data_type: 'number', description: 'IGST Rate (%)', isDefault: true },
    { name: 'cgstRate', data_type: 'number', description: 'CGST Rate (%)', isDefault: false },
    { name: 'sgstRate', data_type: 'number', description: 'SGST Rate (%)', isDefault: false },
    { name: 'cessRate', data_type: 'number', description: 'CESS Rate (%)', isDefault: false },
    { name: 'isReverseCharges', data_type: 'boolean', description: 'Reverse Charges', isDefault: false },
    { name: 'isActive', data_type: 'boolean', description: 'Active', isDefault: true },
    { name: 'createdAt', data_type: 'date', description: 'Created At', isDefault: false },
  ], []);
  
  // Transform data for better display
  const transformedData = useMemo(() => {
    return hsnCodes.map(hsnCode => ({
      ...hsnCode,
      createdAt: hsnCode.createdAt ? formatDate(hsnCode.createdAt) : '',
      updatedAt: hsnCode.updatedAt ? formatDate(hsnCode.updatedAt) : '',
      isActive: hsnCode.isActive ? 'Yes' : 'No',
      isReverseCharges: hsnCode.isReverseCharges ? 'Yes' : 'No',
      igstRate: hsnCode.igstRate !== undefined ? `${hsnCode.igstRate}%` : 'N/A',
      cgstRate: hsnCode.cgstRate !== undefined ? `${hsnCode.cgstRate}%` : 'N/A',
      sgstRate: hsnCode.sgstRate !== undefined ? `${hsnCode.sgstRate}%` : 'N/A',
      cessRate: hsnCode.cessRate !== undefined ? `${hsnCode.cessRate}%` : 'N/A',
      hsnType: hsnCode.hsnType || 'N/A',
      uqc: hsnCode.uqc || 'N/A',
    }));
  }, [hsnCodes]);

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
      {
        label: 'Delete',
        icon: Trash2,
        onClick: onDelete,
        variant: 'destructive' as const,
      },
    ]
  };

  return (
    <div className="w-full">
      <AdvancedTable
        data={transformedData}
        columnMeta={columnMeta}
        isLoading={isLoading}
        groupingEnabled={false}
        globalFilterEnabled={false}
        dragDropGroupingEnabled={false}
        onRowClick={onEdit}
        actionButtons={actionButtons}
        className="w-full"
        // Server-side pagination
        manualPagination={!!onPaginationChange}
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
  );
} 