'use client';

import { Badge } from '@/components/ui/badge';
import { ColumnDef } from '@tanstack/react-table';
import { createActionColumn, DataTable } from '@/components/shared/data-table';
import { Permission } from '../types';
import { Shield, Calendar, CheckCircle, XCircle } from 'lucide-react';

interface PermissionTableProps {
  permissions: Permission[];
  isLoading: boolean;
  onEdit: (permission: Permission) => void;
  onView: (permission: Permission) => void;
  onDelete: (permission: Permission) => void;
  onCreate: () => void;
  totalCount: number;
  pageCount: number;
  onPaginationChange: (pagination: { pageIndex: number; pageSize: number }) => void;
  currentPagination: { pageIndex: number; pageSize: number };
}

export function PermissionTable({ 
  permissions, 
  isLoading, 
  onEdit, 
  onView, 
  onDelete, 
  onCreate, 
  totalCount, 
  pageCount, 
  onPaginationChange, 
  currentPagination 
}: PermissionTableProps) {
  const columns: ColumnDef<Permission>[] = [
    {
      accessorKey: 'name',
      header: 'Permission Name',
      cell: ({ row }) => {
        const permission = row.original;
        return (
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
              <Shield className="h-4 w-4 text-green-600" />
            </div>
            <div className="font-medium">{permission.name}</div>
          </div>
        );
      },
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground max-w-md truncate block">
          {row.original.description || '-'}
        </span>
      ),
    },
    {
      accessorKey: 'moduleName',
      header: 'Module Name',
      cell: ({ row }) => (
        <Badge variant="outline" className="text-xs">
          {row.original.moduleName}
        </Badge>
      ),
    },
    {
      accessorKey: 'actionType',
      header: 'Action Type',
      cell: ({ row }) => (
        <Badge variant="secondary" className="text-xs">
          {row.original.actionType}
        </Badge>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Created',
      cell: ({ row }) => {
        const date = row.original.createdAt;
        return date ? (
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{new Date(date).toLocaleDateString()}</span>
          </div>
        ) : (
          <span className="text-muted-foreground">-</span>
        );
      },
    },
    {
      accessorKey: 'isActive',
      header: 'Status',
      cell: ({ row }) => {
        const isActive = row.original.isActive;
        return (
          <div className="flex items-center space-x-2">
            {isActive ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <XCircle className="h-4 w-4 text-red-600" />
            )}
            <Badge variant={isActive ? 'default' : 'secondary'}>
              {isActive ? 'Active' : 'Inactive'}
            </Badge>
          </div>
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
      headerActions={[{
        label: 'Create Permission',
        onClick: onCreate,
        icon: Shield,
      }]}
      totalCount={totalCount}
      pageCount={pageCount}
      onPaginationChange={onPaginationChange}
      initialPagination={currentPagination}
    />
  );
}

