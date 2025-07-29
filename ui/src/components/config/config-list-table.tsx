"use client";

import { useMemo } from "react";
import { Edit, Trash2 } from "lucide-react";
import { Column } from "@/types/common";
import { formatDate } from "@/lib/date-utils";
import AdvancedTable from "../shared/advanced-table";
import { ConfigList } from "@/types/config-list";

interface ConfigListTableProps {
  configLists: ConfigList[];
  onEdit: (configList: ConfigList) => void;
  onDelete: (configList: ConfigList) => void;
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

export default function ConfigListTable({
  configLists,
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
}: ConfigListTableProps) {

  const columnMeta: Column[] = useMemo(() => [
    { name: 'listCode', data_type: 'string', description: 'List Code' },
    { name: 'listName', data_type: 'string', description: 'List Name' },
    { name: 'description', data_type: 'string', description: 'Description' },
    { name: 'isActive', data_type: 'boolean', description: 'Active' },
    { name: 'createdAt', data_type: 'date', description: 'Created At' },
  ], []);
  
  const defaultColumns = [
    'listCode',
    'listName',
    'description',
    'isActive',
  ];

  // Transform data for better display
  const transformedData = useMemo(() => {
    return configLists.map(configList => ({
      ...configList,
      createdAt: configList.createdAt ? formatDate(configList.createdAt) : '',
      updatedAt: configList.updatedAt ? formatDate(configList.updatedAt) : '',
      isActive: configList.isActive ? 'Yes' : 'No',
    }));
  }, [configLists]);

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