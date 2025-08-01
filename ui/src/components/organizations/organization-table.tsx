"use client";

import { useMemo } from "react";
import { Edit, Trash2 } from "lucide-react";
import { Column } from "@/components/shared/advanced-table/types";
import { formatDate } from "@/lib/date-utils";
import AdvancedTable from "../shared/advanced-table";
import { Organization } from "@/types/organization";

interface OrganizationTableProps {
  organizations: Organization[];
  onEdit: (organization: Organization) => void;
  onDelete?: (organization: Organization) => void;
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

export default function OrganizationTable({
  organizations,
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
}: OrganizationTableProps) {

  const columnMeta: Column[] = useMemo(() => [
    { name: 'code', data_type: 'string', displayName: 'Code', isDefault: true },
    { name: 'name', data_type: 'string', displayName: 'Name', isDefault: true },
    { name: 'contactPerson', data_type: 'string', displayName: 'Contact Person', isDefault: true },
    { name: 'email', data_type: 'string', displayName: 'Email', isDefault: false },
    { name: 'phone', data_type: 'string', displayName: 'Phone', isDefault: false },
    { name: 'city', data_type: 'string', displayName: 'City', isDefault: false },
    { name: 'state', data_type: 'string', displayName: 'State', isDefault: false },
    { name: 'isActive', data_type: 'boolean', displayName: 'Status', isDefault: true },
  ], []);
  
  // Transform data for better display
  const transformedData = useMemo(() => {
    return organizations.map(organization => ({
      ...organization,
      isActive: organization.isActive ? 'Active' : 'Inactive',
      contactPerson: organization.contactPerson || 'N/A',
      email: organization.email || 'N/A',
      phone: organization.phone || 'N/A',
      city: organization.city || 'N/A',
      state: organization.state || 'N/A',
    }));
  }, [organizations]);

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