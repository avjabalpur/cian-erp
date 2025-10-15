'use client';

import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable, createActionColumn } from '@/components/shared/data-table';
import { Badge } from '@/components/ui/badge';
import { Building2, Calendar, CheckCircle, XCircle, Users } from 'lucide-react';
import { Department } from '../types';

interface DepartmentTableProps {
  departments: Department[];
  isLoading: boolean;
  onEdit: (department: Department) => void;
  onView: (department: Department) => void;
  onDelete: (department: Department) => void;
  onCreate: () => void;
  totalCount: number;
  pageCount: number;
  onPaginationChange: (pagination: { pageIndex: number; pageSize: number }) => void;
  currentPagination: { pageIndex: number; pageSize: number };
}

export function DepartmentTable({ 
  departments, 
  isLoading, 
  onEdit, 
  onView, 
  onDelete, 
  onCreate, 
  totalCount, 
  pageCount, 
  onPaginationChange, 
  currentPagination 
}: DepartmentTableProps) {
  const columns: ColumnDef<Department>[] = [
    {
      accessorKey: 'code',
      header: 'Code',
      cell: ({ row }) => {
        const department = row.original;
        return (
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
              <Building2 className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <div className="font-mono font-medium">{department.code}</div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'name',
      header: 'Department Name',
      cell: ({ row }) => (
        <div className="font-medium">{row.original.name}</div>
      ),
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: ({ row }) => (
        <div className="text-sm text-muted-foreground max-w-md truncate">
          {row.original.description || '-'}
        </div>
      ),
    },
    {
      accessorKey: 'headOfDepartment',
      header: 'Head of Department',
      cell: ({ row }) => (
        <div className="text-sm">
          {row.original.headOfDepartment || '-'}
        </div>
      ),
    },
    {
      accessorKey: 'employeeCount',
      header: 'Employees',
      cell: ({ row }) => {
        const count = row.original.employeeCount || 0;
        return (
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <Badge variant="secondary">{count}</Badge>
          </div>
        );
      },
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
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.original.status;
        const isActive = status === 'Active';
        return (
          <div className="flex items-center space-x-2">
            {isActive ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <XCircle className="h-4 w-4 text-red-600" />
            )}
            <Badge variant={isActive ? "default" : "secondary"}>
              {status}
            </Badge>
          </div>
        );
      },
    },
    createActionColumn<Department>(onView, onEdit, onDelete),
  ];

  return (
    <DataTable
      title="Departments"
      columns={columns}
      data={departments}
      loading={isLoading}
      enablePagination={true}
      headerActions={[{
        label: 'Create Department',
        onClick: onCreate,
        icon: Building2,
      }]}
      totalCount={totalCount}
      pageCount={pageCount}
      onPaginationChange={onPaginationChange}
      initialPagination={currentPagination}
    />
  );
}

