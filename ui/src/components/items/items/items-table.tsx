"use client";

import { useMemo } from "react";
import { FileText, Edit, Trash2 } from "lucide-react";
import { formatDate } from "@/lib/date-utils";
import AdvancedTable, { Column } from "../../shared/advanced-table";
import { ItemMaster } from "@/types/item-master";

interface ItemsTableProps {
  items: ItemMaster[];
  onEdit: (item: ItemMaster) => void;
  onDelete: (item: ItemMaster) => void;
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
    { name: 'revNo', data_type: 'string', description: 'Revision No' },
    { name: 'itemTypeId', data_type: 'number', description: 'Item Type' },
    { name: 'unitOfMeasure', data_type: 'string', description: 'Unit of Measure' },
    { name: 'manufactured', data_type: 'boolean', description: 'Manufactured' },
    { name: 'qcRequired', data_type: 'boolean', description: 'QC Required' },
    { name: 'boughtOut', data_type: 'boolean', description: 'Bought Out' },
    { name: 'sold', data_type: 'boolean', description: 'Sold' },
    { name: 'createdAt', data_type: 'date', description: 'Created At' },
  ], []);
  
  const defaultColumns = [
    'itemCode',
    'itemName',
    'shortName',
    'revNo',
    'itemTypeId',
    'unitOfMeasure',
    'manufactured',
    'qcRequired',
    'boughtOut',
    'sold',
  ];

  // Transform items data for better display
  const transformedItems = useMemo(() => {
    return items.map(item => ({
      ...item,
      createdAt: item.createdAt ? formatDate(item.createdAt) : '',
      updatedAt: item.updatedAt ? formatDate(item.updatedAt) : '',
      manufactured: item.manufactured ? 'Yes' : 'No',
      qcRequired: item.qcRequired ? 'Yes' : 'No',
      boughtOut: item.boughtOut ? 'Yes' : 'No',
      sold: item.sold ? 'Yes' : 'No',
      itemTypeId: item.itemTypeId || 'N/A',
      unitOfMeasure: item.unitOfMeasure || 'N/A',
      shortName: item.shortName || 'N/A',
      revNo: item.revNo || 'N/A',
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