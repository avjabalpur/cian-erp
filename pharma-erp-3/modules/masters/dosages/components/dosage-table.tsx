'use client';

import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable, createActionColumn } from '@/components/shared/data-table';
import { Badge } from '@/components/ui/badge';
import { Pill, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { Dosage } from '../types';

interface DosageTableProps {
  dosages: Dosage[];
  isLoading: boolean;
  onEdit: (dosage: Dosage) => void;
  onView: (dosage: Dosage) => void;
  onDelete: (dosage: Dosage) => void;
  onCreate: () => void;
  totalCount: number;
  pageCount: number;
  onPaginationChange: (pagination: { pageIndex: number; pageSize: number }) => void;
  currentPagination: { pageIndex: number; pageSize: number };
}

export function DosageTable({ 
  dosages, 
  isLoading, 
  onEdit, 
  onView, 
  onDelete, 
  onCreate, 
  totalCount, 
  pageCount, 
  onPaginationChange, 
  currentPagination 
}: DosageTableProps) {
  const columns: ColumnDef<Dosage>[] = [
    {
      accessorKey: 'name',
      header: 'Dosage Name',
      cell: ({ row }) => {
        const dosage = row.original;
        return (
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
              <Pill className="h-4 w-4 text-indigo-600" />
            </div>
            <div>
              <div className="font-medium">{dosage.name}</div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'registerDate',
      header: 'Register Date',
      cell: ({ row }) => {
        const date = row.original.registerDate;
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
    createActionColumn<Dosage>(onView, onEdit, onDelete),
  ];

  return (
    <DataTable
      title="Dosages"
      columns={columns}
      data={dosages}
      loading={isLoading}
      enablePagination={true}
      headerActions={[{
        label: 'Create Dosage',
        onClick: onCreate,
        icon: Pill,
      }]}
      totalCount={totalCount}
      pageCount={pageCount}
      onPaginationChange={onPaginationChange}
      initialPagination={currentPagination}
    />
  );
}
