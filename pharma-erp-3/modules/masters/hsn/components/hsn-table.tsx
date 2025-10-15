'use client';

import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable, createActionColumn } from '@/components/shared/data-table';
import { Badge } from '@/components/ui/badge';
import { FileText, Calendar, CheckCircle, XCircle, Percent } from 'lucide-react';
import { HsnMaster } from '../types';

interface HsnTableProps {
  hsnMasters: HsnMaster[];
  isLoading: boolean;
  onEdit: (hsnMaster: HsnMaster) => void;
  onView: (hsnMaster: HsnMaster) => void;
  onDelete: (hsnMaster: HsnMaster) => void;
  onCreate: () => void;
  totalCount: number;
  pageCount: number;
  onPaginationChange: (pagination: { pageIndex: number; pageSize: number }) => void;
  currentPagination: { pageIndex: number; pageSize: number };
}

export function HsnTable({ 
  hsnMasters, 
  isLoading, 
  onEdit, 
  onView, 
  onDelete, 
  onCreate, 
  totalCount, 
  pageCount, 
  onPaginationChange, 
  currentPagination 
}: HsnTableProps) {
  const columns: ColumnDef<HsnMaster>[] = [
    {
      accessorKey: 'code',
      header: 'HSN Code',
      cell: ({ row }) => {
        const hsn = row.original;
        return (
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
              <FileText className="h-4 w-4 text-amber-600" />
            </div>
            <div>
              <div className="font-mono font-medium">{hsn.code}</div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <div className="font-medium">{row.original.name}</div>
      ),
    },
    {
      accessorKey: 'hsnType',
      header: 'Type',
      cell: ({ row }) => {
        const type = row.original.hsnType;
        return type ? (
          <Badge variant="outline" className="capitalize">
            {type}
          </Badge>
        ) : (
          <span className="text-muted-foreground">-</span>
        );
      },
    },
    {
      accessorKey: 'igstRate',
      header: 'IGST Rate',
      cell: ({ row }) => {
        const rate = row.original.igstRate;
        return rate !== undefined && rate !== null ? (
          <div className="flex items-center space-x-1">
            <Percent className="h-3 w-3 text-muted-foreground" />
            <span className="font-mono">{rate.toFixed(2)}%</span>
          </div>
        ) : (
          <span className="text-muted-foreground">-</span>
        );
      },
    },
    {
      accessorKey: 'cgstRate',
      header: 'CGST Rate',
      cell: ({ row }) => {
        const rate = row.original.cgstRate;
        return rate !== undefined && rate !== null ? (
          <div className="flex items-center space-x-1">
            <Percent className="h-3 w-3 text-muted-foreground" />
            <span className="font-mono">{rate.toFixed(2)}%</span>
          </div>
        ) : (
          <span className="text-muted-foreground">-</span>
        );
      },
    },
    {
      accessorKey: 'sgstRate',
      header: 'SGST Rate',
      cell: ({ row }) => {
        const rate = row.original.sgstRate;
        return rate !== undefined && rate !== null ? (
          <div className="flex items-center space-x-1">
            <Percent className="h-3 w-3 text-muted-foreground" />
            <span className="font-mono">{rate.toFixed(2)}%</span>
          </div>
        ) : (
          <span className="text-muted-foreground">-</span>
        );
      },
    },
    {
      accessorKey: 'isReverseCharges',
      header: 'Reverse Charges',
      cell: ({ row }) => {
        const isReverse = row.original.isReverseCharges;
        return (
          <Badge variant={isReverse ? "default" : "secondary"}>
            {isReverse ? "Yes" : "No"}
          </Badge>
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
    createActionColumn<HsnMaster>(onView, onEdit, onDelete),
  ];

  return (
    <DataTable
      title="HSN Masters"
      columns={columns}
      data={hsnMasters}
      loading={isLoading}
      enablePagination={true}
      headerActions={[{
        label: 'Create HSN Master',
        onClick: onCreate,
        icon: FileText,
      }]}
      totalCount={totalCount}
      pageCount={pageCount}
      onPaginationChange={onPaginationChange}
      initialPagination={currentPagination}
    />
  );
}
