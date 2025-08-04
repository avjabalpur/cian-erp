"use client";

import { useMemo } from "react";
import { Edit, Trash2 } from "lucide-react";
import { Column } from "@/components/shared/advanced-table/types";
import AdvancedTable from "../shared/advanced-table";
import { ProductGroup } from "@/types/product-group";

interface ProductGroupTableProps {
  productGroups: ProductGroup[];
  divisions?: any[]; // For sales division lookup
  onEdit: (productGroup: ProductGroup) => void;
  onDelete?: (productGroup: ProductGroup) => void;
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

export default function ProductGroupTable({
  productGroups,
  divisions = [],
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
}: ProductGroupTableProps) {

  const columnMeta: Column[] = useMemo(() => [
    { 
      name: 'code', 
      data_type: 'string', 
      displayName: 'Code',
      isDefault: true
    },
    { 
      name: 'productGroupName', 
      data_type: 'string', 
      displayName: 'Product Group Name',
      isDefault: true
    },
    { 
      name: 'level', 
      data_type: 'string', 
      displayName: 'Level',
      isDefault: true
    },
    { 
      name: 'unit', 
      data_type: 'string', 
      displayName: 'Unit',
      isDefault: true
    },
    { 
      name: 'salesDivisionName', 
      data_type: 'string', 
      displayName: 'Sales Division',
      isDefault: true
    },
    { 
      name: 'uomForMls', 
      data_type: 'string', 
      displayName: 'UOM for MLS',
      isDefault: false
    },
    { 
      name: 'conversionFactor', 
      data_type: 'number', 
      displayName: 'Conversion Factor',
      isDefault: true
    },
    { 
      name: 'conversionFactorUnit', 
      data_type: 'string', 
      displayName: 'Conversion Unit',
      isDefault: false
    },
    { 
      name: 'costCentreCode', 
      data_type: 'string', 
      displayName: 'Cost Centre',
      isDefault: false
    },
    { 
      name: 'revNo', 
      data_type: 'string', 
      displayName: 'Rev No',
      isDefault: false
    },
    { 
      name: 'isClosed', 
      data_type: 'boolean', 
      displayName: 'Status',
      isDefault: true
    },
    { 
      name: 'isActive', 
      data_type: 'boolean', 
      displayName: 'Active',
      isDefault: true
    },
  ], []);
  
  // Transform data for better display
  const transformedData = useMemo(() => {
    return productGroups.map(productGroup => {
      const division = divisions.find((d: any) => d.id === productGroup.salesDivisionCode);
      return {
        ...productGroup,
        salesDivisionName: division ? division.name : 'N/A',
        isClosed: productGroup.isClosed ? 'Closed' : 'Open',
        isActive: productGroup.isActive ? 'Active' : 'Inactive',
        unit: productGroup.unit || 'N/A',
        uomForMls: productGroup.uomForMls || 'N/A',
        conversionFactor: productGroup.conversionFactor || 'N/A',
        conversionFactorUnit: productGroup.conversionFactorUnit || 'N/A',
        costCentreCode: productGroup.costCentreCode || 'N/A',
        revNo: productGroup.revNo || 'N/A',
      };
    });
  }, [productGroups, divisions]);

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