"use client";

import { useMemo } from "react";
import { Edit, Trash2 } from "lucide-react";
import { Column } from "@/components/shared/advanced-table/types";
import { formatDate } from "@/lib/date-utils";
import AdvancedTable from "../shared/advanced-table";
import { Dosage } from "@/types/dosage";

interface DosageTableProps {
  dosages: Dosage[];
  onEdit: (dosage: Dosage) => void;
  onDelete?: (dosage: Dosage) => void;
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

export default function DosageTable({
  dosages,
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
}: DosageTableProps) {

  const columnMeta: Column[] = useMemo(() => [
    { name: 'name', data_type: 'string', displayName: 'Name' },
    { name: 'registerDate', data_type: 'string', displayName: 'Register Date' },
    { name: 'isActive', data_type: 'boolean', displayName: 'Status' },
    { name: 'createdAt', data_type: 'date', displayName: 'Created At' },
  ], []);
  
  const defaultColumns = [
    'name',
    'registerDate',
    'isActive',
    'createdAt',
  ];

  // Transform data for better display
  const transformedData = useMemo(() => {
    return dosages.map(dosage => ({
      ...dosage,
      isActive: dosage.isActive ? 'Active' : 'Inactive',
      registerDate: dosage.registerDate || 'N/A',
      createdAt: formatDate(dosage.createdAt),
    }));
  }, [dosages]);

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
        data={transformedData}
        columns={defaultColumns}
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