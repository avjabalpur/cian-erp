"use client";

import { useMemo } from "react";
import { Edit, Trash2 } from "lucide-react";
import { Column } from "@/components/shared/advanced-table/types";
import { formatDate } from "@/lib/date-utils";
import AdvancedTable from "../shared/advanced-table";
import { Division } from "@/types/division";

interface DivisionTableProps {
  divisions: Division[];
  departments: any[];
  onEdit: (division: Division) => void;
  onDelete?: (division: Division) => void;
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

export default function DivisionTable({
  divisions,
  departments,
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
}: DivisionTableProps) {

  const columnMeta: Column[] = useMemo(() => [
    { 
      name: 'code', 
      data_type: 'string', 
      displayName: 'Code',
      isDefault: true
    },
    { 
      name: 'name', 
      data_type: 'string', 
      displayName: 'Name',
      isDefault: true
    },
    { 
      name: 'description', 
      data_type: 'string', 
      displayName: 'Description',
      isDefault: true
    },
    { 
      name: 'departmentName', 
      data_type: 'string', 
      displayName: 'Department',
      isDefault: true
    },
    { 
      name: 'unit', 
      data_type: 'string', 
      displayName: 'Unit',
      isDefault: true
    },
    { 
      name: 'conversionFactor', 
      data_type: 'number', 
      displayName: 'Conversion Factor',
      isDefault: false
    },
    { 
      name: 'isActive', 
      data_type: 'boolean', 
      displayName: 'Status',
      isDefault: true
    },
  ], []);
  
  // Transform data for better display
  const transformedData = useMemo(() => {
    return divisions.map(division => {
      const department = departments.find((d: any) => d.id === division.departmentId);
      return {
        ...division,
        departmentName: department ? department.name : 'N/A',
        isActive: division.isActive ? 'Active' : 'Inactive',
        unit: division.unit || 'N/A',
        conversionFactor: division.conversionFactor || 'N/A',
        description: division.description || 'N/A',
      };
    });
  }, [divisions, departments]);

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