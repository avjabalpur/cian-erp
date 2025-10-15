'use client';

import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable, createActionColumn } from '@/components/shared/data-table';
import { Badge } from '@/components/ui/badge';
import { Building, Calendar, CheckCircle, XCircle, MapPin } from 'lucide-react';
import { Organization } from '../types';

interface OrganizationTableProps {
  organizations: Organization[];
  isLoading: boolean;
  onEdit: (organization: Organization) => void;
  onView: (organization: Organization) => void;
  onDelete: (organization: Organization) => void;
  onCreate: () => void;
  totalCount: number;
  pageCount: number;
  onPaginationChange: (pagination: { pageIndex: number; pageSize: number }) => void;
  currentPagination: { pageIndex: number; pageSize: number };
}

export function OrganizationTable({ 
  organizations, 
  isLoading, 
  onEdit, 
  onView, 
  onDelete, 
  onCreate, 
  totalCount, 
  pageCount, 
  onPaginationChange, 
  currentPagination 
}: OrganizationTableProps) {
  const columns: ColumnDef<Organization>[] = [
    {
      accessorKey: 'code',
      header: 'Code',
      cell: ({ row }) => {
        const organization = row.original;
        return (
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
              <Building className="h-4 w-4 text-orange-600" />
            </div>
            <div>
              <div className="font-mono font-medium">{organization.code}</div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'name',
      header: 'Organization Name',
      cell: ({ row }) => (
        <div className="font-medium">{row.original.name}</div>
      ),
    },
    {
      accessorKey: 'locationTypeName',
      header: 'Location Type',
      cell: ({ row }) => (
        <div className="text-sm flex items-center gap-1">
          <MapPin className="h-3 w-3 text-muted-foreground" />
          {row.original.locationTypeName || '-'}
        </div>
      ),
    },
    {
      accessorKey: 'contactPerson',
      header: 'Contact Person',
      cell: ({ row }) => (
        <div className="text-sm">
          {row.original.contactPerson || '-'}
        </div>
      ),
    },
    {
      accessorKey: 'city',
      header: 'City',
      cell: ({ row }) => (
        <div className="text-sm">
          {row.original.city || '-'}
        </div>
      ),
    },
    {
      accessorKey: 'phone',
      header: 'Phone',
      cell: ({ row }) => (
        <div className="text-sm">
          {row.original.phone || '-'}
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
    createActionColumn<Organization>(onView, onEdit, onDelete),
  ];

  return (
    <DataTable
      title="Organizations"
      columns={columns}
      data={organizations}
      loading={isLoading}
      enablePagination={true}
      headerActions={[{
        label: 'Create Organization',
        onClick: onCreate,
        icon: Building,
      }]}
      totalCount={totalCount}
      pageCount={pageCount}
      onPaginationChange={onPaginationChange}
      initialPagination={currentPagination}
    />
  );
}
