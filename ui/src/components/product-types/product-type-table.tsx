"use client";

import { useMemo } from "react";
import { Edit, Trash2 } from "lucide-react";
import { Column } from "@/components/shared/advanced-table/types";
import AdvancedTable from "../shared/advanced-table";
import { ProductType } from "@/types/product-type";

interface ProductTypeTableProps {
  productTypes: ProductType[];
  onEdit: (productType: ProductType) => void;
  onDelete?: (productType: ProductType) => void;
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

export default function ProductTypeTable({
  productTypes,
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
}: ProductTypeTableProps) {

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
      name: 'parentTypeName', 
      data_type: 'string', 
      displayName: 'Parent Type',
      isDefault: true
    },
    { 
      name: 'isActive', 
      data_type: 'boolean', 
      displayName: 'Active',
      isDefault: true
    },
    { 
      name: 'createdAt', 
      data_type: 'date', 
      displayName: 'Created At',
      isDefault: false
    },
    { 
      name: 'updatedAt', 
      data_type: 'date', 
      displayName: 'Updated At',
      isDefault: false
    },
  ], []);
  
  // Transform data for better display
  const transformedData = useMemo(() => {
    return productTypes.map(productType => {
      return {
        ...productType,
        parentTypeName: productType.parentType ? `${productType.parentType.code} - ${productType.parentType.name}` : 'N/A',
        isActive: productType.isActive ? 'Active' : 'Inactive',
        description: productType.description || 'N/A',
        createdAt: productType.createdAt ? new Date(productType.createdAt).toLocaleDateString() : 'N/A',
        updatedAt: productType.updatedAt ? new Date(productType.updatedAt).toLocaleDateString() : 'N/A',
      };
    });
  }, [productTypes]);

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