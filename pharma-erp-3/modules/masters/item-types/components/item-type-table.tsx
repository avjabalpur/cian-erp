'use client';

import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable, createActionColumn } from '@/components/shared/data-table';
import { Badge } from '@/components/ui/badge';
import { Package, Calendar, CheckCircle, XCircle, Network } from 'lucide-react';
import { ItemType } from '../types';

interface ItemTypeTableProps {
  itemTypes: ItemType[];
  isLoading: boolean;
  onEdit: (itemType: ItemType) => void;
  onView: (itemType: ItemType) => void;
  onDelete: (itemType: ItemType) => void;
  onCreate: () => void;
  totalCount: number;
  pageCount: number;
  onPaginationChange: (pagination: { pageIndex: number; pageSize: number }) => void;
  currentPagination: { pageIndex: number; pageSize: number };
}

export function ItemTypeTable({ 
  itemTypes, 
  isLoading, 
  onEdit, 
  onView, 
  onDelete, 
  onCreate, 
  totalCount, 
  pageCount, 
  onPaginationChange, 
  currentPagination 
}: ItemTypeTableProps) {
  const columns: ColumnDef<ItemType>[] = [
    {
      accessorKey: 'code',
      header: 'Code',
      cell: ({ row }) => {
        const itemType = row.original;
        return (
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-full bg-cyan-100 flex items-center justify-center">
              <Package className="h-4 w-4 text-cyan-600" />
            </div>
            <div>
              <div className="font-mono font-medium">{itemType.code}</div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'name',
      header: 'Item Type Name',
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
      accessorKey: 'parentTypeName',
      header: 'Parent Type',
      cell: ({ row }) => {
        const parentName = row.original.parentTypeName;
        return parentName ? (
          <div className="flex items-center space-x-1">
            <Network className="h-3 w-3 text-muted-foreground" />
            <span className="text-sm">{parentName}</span>
          </div>
        ) : (
          <Badge variant="outline" className="text-xs">Root</Badge>
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
    createActionColumn<ItemType>(onView, onEdit, onDelete),
  ];

  return (
    <DataTable
      title="Item Types"
      columns={columns}
      data={itemTypes}
      loading={isLoading}
      enablePagination={true}
      headerActions={[{
        label: 'Create Item Type',
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
