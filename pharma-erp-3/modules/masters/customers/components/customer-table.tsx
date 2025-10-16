'use client';

import { createActionColumn, DataTable } from '@/components/shared/data-table';
import { Customer } from '../types';
import { Badge } from '@/components/ui/badge';
import { UserPlus } from 'lucide-react';

interface CustomerTableProps {
  customers: Customer[];
  isLoading: boolean;
  onEdit: (customer: Customer) => void;
  onView: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
  onCreate: () => void;
  totalCount: number;
  pageCount: number;
  onPaginationChange: (pagination: { pageIndex: number; pageSize: number }) => void;
  currentPagination: { pageIndex: number; pageSize: number };
}

export function CustomerTable({
  customers,
  isLoading,
  onEdit,
  onView,
  onDelete,
  onCreate,
  totalCount,
  pageCount,
  onPaginationChange,
  currentPagination,
}: CustomerTableProps) {
  const columns = [
    {
      accessorKey: 'customerCode',
      header: 'Customer Code',
      cell: ({ row }: any) => (
        <div className="font-medium">{row.original.customerCode}</div>
      ),
    },
    {
      accessorKey: 'customerName',
      header: 'Customer Name',
      cell: ({ row }: any) => (
        <div className="max-w-[250px] truncate">{row.original.customerName}</div>
      ),
    },
    {
      accessorKey: 'shortName',
      header: 'Short Name',
      cell: ({ row }: any) => (
        <div className="text-muted-foreground">{row.original.shortName || '-'}</div>
      ),
    },
    {
      accessorKey: 'customerTypeCode',
      header: 'Type',
      cell: ({ row }: any) => row.original.customerTypeCode || '-',
    },
    {
      accessorKey: 'gstin',
      header: 'GSTIN',
      cell: ({ row }: any) => row.original.gstin || '-',
    },
    {
      accessorKey: 'isExportCustomer',
      header: 'Export',
      cell: ({ row }: any) => (
        <Badge variant={row.original.isExportCustomer ? 'default' : 'secondary'}>
          {row.original.isExportCustomer ? 'Yes' : 'No'}
        </Badge>
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
    createActionColumn<Customer>(onView, onEdit, onDelete),
  ];

  return (
    <DataTable
      title="Customers"
      columns={columns}
      data={customers}
      loading={isLoading}
      totalCount={totalCount}
      pageCount={pageCount}
      onPaginationChange={onPaginationChange}
      initialPagination={currentPagination}
      headerActions={[{
        label: 'Create Customer',
        onClick: onCreate,
        icon: UserPlus,
      }]}
    />
  );
}

