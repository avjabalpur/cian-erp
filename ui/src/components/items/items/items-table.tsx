"use client";

import { useMemo } from "react";
import { FileText, Edit, Trash2 } from "lucide-react";
import { Column } from "@/types/common";
import { formatDate } from "@/lib/date-utils";
import AdvancedTable from "../../shared/advanced-table";
import { Item } from "@/hooks/items/use-items";

interface ItemsTableProps {
  items: Item[];
  onEdit: (item: Item) => void;
  onDelete: (item: Item) => void;
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

export default function ItemsTable({
  items,
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
}: ItemsTableProps) {

  const columnMeta: Column[] = useMemo(() => [
    { name: 'itemCode', data_type: 'string', description: 'Item Code' },
    { name: 'itemName', data_type: 'string', description: 'Item Name' },
    { name: 'shortName', data_type: 'string', description: 'Short Name' },
    { name: 'itemType', data_type: 'string', description: 'Item Type' },
    { name: 'composition', data_type: 'string', description: 'Composition' },
    { name: 'dosageName', data_type: 'string', description: 'Dosage' },
    { name: 'manufactured', data_type: 'boolean', description: 'Manufactured' },
    { name: 'qcRequired', data_type: 'boolean', description: 'QC Required' },
    { name: 'isActive', data_type: 'boolean', description: 'Active' },
    { name: 'createdByName', data_type: 'string', description: 'Created By' },
    { name: 'createdAt', data_type: 'date', description: 'Created At' },
  ], []);
  
  const defaultColumns = [
    'itemCode',
    'itemName',
    'shortName',
    'itemType',
    'composition',
    'dosageName',
    'manufactured',
    'qcRequired',
    'isActive',
  ];

  // Transform items data for better display
  const transformedItems = useMemo(() => {
    return items.map(item => ({
      ...item,
      createdAt: item.createdAt ? formatDate(item.createdAt) : '',
      updatedAt: item.updatedAt ? formatDate(item.updatedAt) : '',
      manufactured: item.manufactured ? 'Yes' : 'No',
      qcRequired: item.qcRequired ? 'Yes' : 'No',
      isActive: item.isActive ? 'Yes' : 'No',
    }));
  }, [items]);

  const actionButtons = {
    onEdit: onEdit,
    onDelete: onDelete,
    customActions: [
      {
        label: 'Details',
        icon: FileText,
        onClick: onEdit,
        variant: 'default' as const,
      },
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
        data={transformedItems}
        columns={defaultColumns}
        columnMeta={columnMeta}
        isLoading={isLoading}
        groupingEnabled={false}
        globalFilterEnabled={true}
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