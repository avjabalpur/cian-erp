'use client';

import { Badge } from '@/components/ui/badge';
import { ColumnDef } from '@tanstack/react-table';
import { createActionColumn, DataTable } from '@/components/shared/data-table';
import { Permission } from '@/types/permission';
import { Plus, Shield } from 'lucide-react';

interface PermissionTableProps {
  permissions: Permission[];
  isLoading: boolean;
  onEdit: (permission: Permission) => void;
  onView: (permission: Permission) => void;
  onDelete: (permission: Permission) => void;
  onCreate: () => void;
  totalCount?: number;
  pageCount?: number;
  onPaginationChange?: (pagination: { pageIndex: number; pageSize: number }) => void;
  currentPagination?: { pageIndex: number; pageSize: number };
}

export function PermissionTable({ permissions, isLoading, onEdit, onView, onDelete, onCreate, totalCount, pageCount, onPaginationChange, currentPagination }: PermissionTableProps) {
  const columns: ColumnDef<Permission>[] = [
    {
      accessorKey: 'name',
      header: 'Permission Name',
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
            <Shield className="h-4 w-4 text-primary" />
          </div>
          <span className="font-medium">{row.getValue('name')}</span>
        </div>
      ),
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: ({ row }) => <span className="text-muted-foreground">{row.getValue('description')}</span>,
    },
    {
      accessorKey: 'moduleName',
      header: 'Module Name',
      cell: ({ row }) => (
        <Badge variant="outline" className="text-xs">
          {row.getValue('moduleName')}
        </Badge>
      ),
    },
    {
      accessorKey: 'actionType',
      header: 'Action Type',
      cell: ({ row }) => (
        <Badge variant="secondary" className="text-xs">
          {row.getValue('actionType')}
        </Badge>
      ),
    },
    {
      accessorKey: 'isActive',
      header: 'Status',
      cell: ({ row }) => {
        const isActive = row.getValue('isActive') as boolean;
        return (
          <Badge variant={isActive ? 'default' : 'destructive'}>
            {isActive ? 'Active' : 'Inactive'}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Created',
      cell: ({ row }) => {
        const createdAt = row.getValue('createdAt') as string;
        return createdAt ? (
          <span className="text-muted-foreground">
            {new Date(createdAt).toLocaleDateString()}
          </span>
        ) : (
          <span className="text-muted-foreground">-</span>
        );
      },
    },
    createActionColumn<Permission>(onView, onEdit, onDelete),
  ];

  return (
    <DataTable
      title="Permissions"
      columns={columns}
      data={permissions}
      loading={isLoading}
      enablePagination={true}
      enableSorting={true}
      enableFiltering={false}
      enableColumnVisibility={true}
      onRowClick={onView}
      headerActions={[{
        label: 'Create Permission',
        onClick: onCreate,
        icon: Plus,
        className: 'bg-primary text-white',
      }]}
      totalCount={totalCount}
      pageCount={pageCount}
      onPaginationChange={onPaginationChange}
      initialPagination={currentPagination}
    />
  );
}
