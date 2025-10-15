'use client';

import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable, createActionColumn } from '@/components/shared/data-table';
import { Badge } from '@/components/ui/badge';
import { Shield, User as UserIcon, Mail, Calendar, CheckCircle, XCircle, Phone } from 'lucide-react';
import { User } from '../types';

interface UserTableProps {
  users: User[];
  isLoading: boolean;
  onEdit: (user: User) => void;
  onView: (user: User) => void;
  onDelete: (user: User) => void;
  onAssignRoles: (user: User) => void;
  onCreate: () => void;
  totalCount: number;
  pageCount: number;
  onPaginationChange: (pagination: { pageIndex: number; pageSize: number }) => void;
  currentPagination: { pageIndex: number; pageSize: number };
}

export function UserTable({ 
  users, 
  isLoading, 
  onEdit, 
  onView, 
  onDelete, 
  onAssignRoles,
  onCreate, 
  totalCount, 
  pageCount, 
  onPaginationChange, 
  currentPagination 
}: UserTableProps) {
  const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'firstName',
      header: 'Name',
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
              <UserIcon className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <div className="font-medium">{user.firstName} {user.lastName}</div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'username',
      header: 'Username',
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex items-center space-x-3">
            <div className="font-medium">{user.username}</div>
          </div>
        );
      },
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <span>{row.original.email}</span>
        </div>
      ),
    },
    {
      accessorKey: 'phone',
      header: 'Phone Number',
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Phone className="h-4 w-4 text-muted-foreground" />
          <span>{row.original.phone}</span>
        </div>
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
            <Badge variant={isActive ? "default" : "secondary"}>
              {isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
        );
      },
    },
    createActionColumn<User>(onView, onEdit, onDelete, [
      {
        label: 'Assign Roles',
        onClick: onAssignRoles,
        icon: Shield,
      }
    ]),
  ];

  return (
    <DataTable
      title="Users"
      columns={columns}
      data={users}
      loading={isLoading}
      enablePagination={true}
      headerActions={[{
        label: 'Create User',
        onClick: onCreate,
        icon: UserIcon,
      }]}
      totalCount={totalCount}
      pageCount={pageCount}
      onPaginationChange={onPaginationChange}
      initialPagination={currentPagination}
    />
  );
}

