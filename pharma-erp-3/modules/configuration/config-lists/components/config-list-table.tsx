'use client';

import { DataTable, createActionColumn } from '@/components/shared/data-table';
import { ConfigList } from '../types';
import { Badge } from '@/components/ui/badge';
import { ListPlus } from 'lucide-react';

interface ConfigListTableProps {
  configLists: ConfigList[];
  isLoading: boolean;
  onEdit: (configList: ConfigList) => void;
  onView: (configList: ConfigList) => void;
  onDelete: (configList: ConfigList) => void;
  onCreate: () => void;
  totalCount: number;
  pageCount: number;
  onPaginationChange: (pagination: { pageIndex: number; pageSize: number }) => void;
  currentPagination: { pageIndex: number; pageSize: number };
}

export function ConfigListTable({
  configLists,
  isLoading,
  onEdit,
  onView,
  onDelete,
  onCreate,
  totalCount,
  pageCount,
  onPaginationChange,
  currentPagination,
}: ConfigListTableProps) {
  const columns = [
    {
      accessorKey: 'listCode',
      header: 'List Code',
      cell: ({ row }: any) => (
        <div className="font-medium">{row.original.listCode}</div>
      ),
    },
    {
      accessorKey: 'listName',
      header: 'List Name',
      cell: ({ row }: any) => (
        <div className="max-w-[300px] truncate">{row.original.listName}</div>
      ),
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: ({ row }: any) => (
        <div className="max-w-[400px] truncate text-muted-foreground">
          {row.original.description || '-'}
        </div>
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
    createActionColumn<ConfigList>(onView, onEdit, onDelete),
  ];

  return (
    <DataTable
      title="Config Lists"
      columns={columns}
      data={configLists}
        loading={isLoading}
      totalCount={totalCount}
      pageCount={pageCount}
      initialPagination={currentPagination}
      onPaginationChange={onPaginationChange}
      headerActions={[{
        label: 'Create Config List',
        onClick: onCreate,
        icon: ListPlus,
      }]}
    />
  );
}

