'use client';

import { createActionColumn, DataTable } from '@/components/shared/data-table';
import { ItemMaster } from '../types';
import { Badge } from '@/components/ui/badge';
import { Package } from 'lucide-react';

interface ItemTableProps {
  items: ItemMaster[];
  isLoading: boolean;
  onEdit: (item: ItemMaster) => void;
  onView: (item: ItemMaster) => void;
  onDelete: (item: ItemMaster) => void;
  onCreate: () => void;
  totalCount: number;
  pageCount: number;
  onPaginationChange: (pagination: { pageIndex: number; pageSize: number }) => void;
  currentPagination: { pageIndex: number; pageSize: number };
}

export function ItemTable({
  items,
  isLoading,
  onEdit,
  onView,
  onDelete,
  onCreate,
  totalCount,
  pageCount,
  onPaginationChange,
  currentPagination,
}: ItemTableProps) {
  const columns = [
    {
      accessorKey: 'itemCode',
      header: 'Item Code',
      cell: ({ row }: any) => (
        <div className="font-medium">{row.original.itemCode}</div>
      ),
    },
    {
      accessorKey: 'itemName',
      header: 'Item Name',
      cell: ({ row }: any) => (
        <div className="max-w-[300px] truncate">{row.original.itemName}</div>
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
      accessorKey: 'unitOfMeasure',
      header: 'UOM',
      cell: ({ row }: any) => row.original.unitOfMeasure || '-',
    },
    {
      accessorKey: 'manufactured',
      header: 'Manufactured',
      cell: ({ row }: any) => (
        <Badge variant={row.original.manufactured ? 'default' : 'secondary'}>
          {row.original.manufactured ? 'Yes' : 'No'}
        </Badge>
      ),
    },
    {
      accessorKey: 'qcRequired',
      header: 'QC Required',
      cell: ({ row }: any) => (
        <Badge variant={row.original.qcRequired ? 'default' : 'secondary'}>
          {row.original.qcRequired ? 'Yes' : 'No'}
        </Badge>
      ),
    },
    {
      accessorKey: 'sold',
      header: 'Sold',
      cell: ({ row }: any) => (
        <Badge variant={row.original.sold ? 'default' : 'secondary'}>
          {row.original.sold ? 'Yes' : 'No'}
        </Badge>
      ),
    },
    createActionColumn<ItemMaster>(onView, onEdit, onDelete),
  ];

  return (
    <DataTable
      columns={columns}
      data={items}
      loading={isLoading}
      enablePagination={true}
      headerActions={[{
        label: 'Create Item',
        onClick: onCreate,
        icon: Package,
      }]}
      totalCount={totalCount}
      pageCount={pageCount}
      onPaginationChange={onPaginationChange}
      initialPagination={currentPagination}
    />
  );
}

