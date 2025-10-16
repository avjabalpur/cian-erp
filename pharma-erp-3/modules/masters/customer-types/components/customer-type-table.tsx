'use client';

import { createActionColumn, DataTable } from '@/components/shared/data-table';
import { CustomerType } from '../types';
import { Badge } from '@/components/ui/badge';
import { Check, UserPlus, X } from 'lucide-react';

interface CustomerTypeTableProps {
  customerTypes: CustomerType[];
  isLoading: boolean;
  onEdit: (customerType: CustomerType) => void;
  onView: (customerType: CustomerType) => void;
  onDelete: (customerType: CustomerType) => void;
  onCreate: () => void;
  totalCount: number;
  pageCount: number;
  onPaginationChange: (pagination: { pageIndex: number; pageSize: number }) => void;
  currentPagination: { pageIndex: number; pageSize: number };
}

export function CustomerTypeTable({
  customerTypes,
  isLoading,
  onEdit,
  onView,
  onDelete,
  onCreate,
  totalCount,
  pageCount,
  onPaginationChange,
  currentPagination,
}: CustomerTypeTableProps) {
  const columns = [
    {
      accessorKey: 'code',
      header: 'Code',
      cell: ({ row }: any) => (
        <div className="font-medium">{row.original.code}</div>
      ),
    },
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }: any) => (
        <div className="max-w-[200px] truncate">{row.original.name}</div>
      ),
    },
    {
      accessorKey: 'isExportType',
      header: 'Export',
      cell: ({ row }: any) => (
        row.original.isExportType ? (
          <Check className="h-4 w-4 text-green-600" />
        ) : (
          <X className="h-4 w-4 text-gray-400" />
        )
      ),
    },
    {
      accessorKey: 'isDomesticType',
      header: 'Domestic',
      cell: ({ row }: any) => (
        row.original.isDomesticType ? (
          <Check className="h-4 w-4 text-green-600" />
        ) : (
          <X className="h-4 w-4 text-gray-400" />
        )
      ),
    },
    {
      accessorKey: 'requiresDrugLicense',
      header: 'Drug License',
      cell: ({ row }: any) => (
        row.original.requiresDrugLicense ? (
          <Check className="h-4 w-4 text-green-600" />
        ) : (
          <X className="h-4 w-4 text-gray-400" />
        )
      ),
    },
    {
      accessorKey: 'isActive',
      header: 'Status',
      cell: ({ row }: any) => (
        <Badge variant={row.original.isActive ? 'default' : 'secondary'}>
          {row.original.isActive ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    createActionColumn<CustomerType>(onView, onEdit, onDelete),
  ];

  return (
    <DataTable
      title="Customer Types"
      columns={columns}
      data={customerTypes}
      loading={isLoading}
      enablePagination={true}
      headerActions={[{
        label: 'Create Customer Type',
        onClick: onCreate,
        icon: UserPlus,
      }]}
      totalCount={totalCount}
      pageCount={pageCount}
      onPaginationChange={onPaginationChange}
      initialPagination={currentPagination}
    />
  );
}

