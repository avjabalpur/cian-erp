'use client';

import { Badge } from '@/components/ui/badge';
import { ColumnDef } from '@tanstack/react-table';
import { createActionColumn, DataTable } from '@/components/shared/data-table';
import { Role } from '@/types/role';
import { Plus } from 'lucide-react';

interface RoleTableProps {
  roles: Role[];
  isLoading: boolean;
  onEdit: (role: Role) => void;
  onView: (role: Role) => void;
  onDelete: (role: Role) => void;
  onCreate: () => void;
  totalCount?: number;
  pageCount?: number;
  onPaginationChange?: (pagination: { pageIndex: number; pageSize: number }) => void;
  currentPagination?: { pageIndex: number; pageSize: number };
}

export function RoleTable({ roles, isLoading, onEdit, onView, onDelete, onCreate, totalCount, pageCount, onPaginationChange, currentPagination }: RoleTableProps) {
  const columns: ColumnDef<Role>[] = [
    {
      accessorKey: 'name',
      header: 'Role Name',
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: ({ row }) => <span className="text-muted-foreground">{row.getValue('description')}</span>,
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
    createActionColumn<Role>(onView, onEdit, onDelete),
  ];

  return (
    <DataTable
      title="Roles"
      columns={columns}
      data={roles}
      loading={isLoading}
      enablePagination={true}
      enableSorting={true}
      enableFiltering={false}
      enableColumnVisibility={true}
      onRowClick={onView}
      headerActions={[{
        label: 'Create Role',
        onClick: onCreate,
        icon: Plus,
        variant: 'default',
      }]}
      totalCount={totalCount}
      pageCount={pageCount}
      onPaginationChange={onPaginationChange}
      initialPagination={currentPagination}
    />
  );
}
