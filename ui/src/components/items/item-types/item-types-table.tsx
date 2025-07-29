"use client";

import { useMemo } from "react";
import { Edit, Trash2 } from "lucide-react";
import { Column } from "@/types/common";
import { formatDate } from "@/lib/date-utils";
import AdvancedTable from "../../shared/advanced-table";
import { ItemType } from "@/types/item";

interface ItemTypesTableProps {
  itemTypes: ItemType[];
  onEdit: (itemType: ItemType) => void;
  onDelete: (itemType: ItemType) => void;
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

export default function ItemTypesTable({
  itemTypes,
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
}: ItemTypesTableProps) {

  const columnMeta: Column[] = useMemo(() => [
    { name: 'code', data_type: 'string', description: 'Code' },
    { name: 'name', data_type: 'string', description: 'Name' },
    { name: 'description', data_type: 'string', description: 'Description' },
    { name: 'parentTypeId', data_type: 'number', description: 'Parent Type ID' },
    { name: 'isActive', data_type: 'boolean', description: 'Active' },
    { name: 'createdAt', data_type: 'date', description: 'Created At' },
  ], []);
  
  const defaultColumns = [
    'code',
    'name',
    'description',
    'parentTypeId',
    'isActive',
  ];

  // Transform data for better display
  const transformedData = useMemo(() => {
    return itemTypes.map(itemType => ({
      ...itemType,
      createdAt: itemType.createdAt ? formatDate(itemType.createdAt) : '',
      updatedAt: itemType.updatedAt ? formatDate(itemType.updatedAt) : '',
      isActive: itemType.isActive ? 'Yes' : 'No',
      parentTypeId: itemType.parentTypeId || 'N/A',
    }));
  }, [itemTypes]);

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