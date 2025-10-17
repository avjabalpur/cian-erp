'use client';

import { DataTable, createActionColumn } from '@/components/shared/data-table';
import { SalesOrderWithApprovals } from '../types';
import { Badge } from '@/components/ui/badge';
import { Check, X, Clock, FileText } from 'lucide-react';

interface SalesOrderTableProps {
  salesOrders: SalesOrderWithApprovals[];
  isLoading: boolean;
  onEdit: (salesOrder: SalesOrderWithApprovals) => void;
  onView: (salesOrder: SalesOrderWithApprovals) => void;
  onDelete: (salesOrder: SalesOrderWithApprovals) => void;
  onCreate: () => void;
  totalCount: number;
  pageCount: number;
  onPaginationChange: (pagination: { pageIndex: number; pageSize: number }) => void;
  currentPagination: { pageIndex: number; pageSize: number };
}

export function SalesOrderTable({
  salesOrders,
  isLoading,
  onEdit,
  onView,
  onDelete,
  onCreate,
  totalCount,
  pageCount,
  onPaginationChange,
  currentPagination,
}: SalesOrderTableProps) {
  const getApprovalIcon = (approved?: boolean | null) => {
    if (approved === true) return <Check className="h-4 w-4 text-green-600" />;
    if (approved === false) return <X className="h-4 w-4 text-red-600" />;
    return <Clock className="h-4 w-4 text-gray-400" />;
  };

  const columns = [
    {
      accessorKey: 'soNumber',
      header: 'SO Number',
      cell: ({ row }: any) => (
        <div className="font-medium">{row.original.soNumber}</div>
      ),
    },
    {
      accessorKey: 'customerName',
      header: 'Customer',
      cell: ({ row }: any) => (
        <div className="max-w-[200px] truncate">{row.original.customerName || '-'}</div>
      ),
    },
    {
      accessorKey: 'itemName',
      header: 'Item',
      cell: ({ row }: any) => (
        <div className="max-w-[200px] truncate">{row.original.itemName || '-'}</div>
      ),
    },
    {
      accessorKey: 'quantity',
      header: 'Quantity',
      cell: ({ row }: any) => row.original.quantity || '-',
    },
    {
      accessorKey: 'currentStatus',
      header: 'Current Stage',
      cell: ({ row }: any) => (
        <Badge variant="outline">{row.original.currentStatus || 'Pending'}</Badge>
      ),
    },
    {
      accessorKey: 'costingApproved',
      header: 'Costing',
      cell: ({ row }: any) => getApprovalIcon(row.original.costingApproved),
    },
    {
      accessorKey: 'qaApproved',
      header: 'QA',
      cell: ({ row }: any) => getApprovalIcon(row.original.qaApproved),
    },
    {
      accessorKey: 'designerApproved',
      header: 'Designer',
      cell: ({ row }: any) => getApprovalIcon(row.original.designerApproved),
    },
    {
      accessorKey: 'pmApproved',
      header: 'PM',
      cell: ({ row }: any) => getApprovalIcon(row.original.pmApproved),
    },
    {
      accessorKey: 'soStatus',
      header: 'Status',
      cell: ({ row }: any) => (
        <Badge>{row.original.soStatus}</Badge>
      ),
    },
    createActionColumn<SalesOrderWithApprovals>(onView, onEdit, onDelete),
  ];

  return (
    <DataTable
      title="Sales Order Approvals"
      columns={columns}
      data={salesOrders}
      loading={isLoading}
      totalCount={totalCount}
      pageCount={pageCount}
      initialPagination={currentPagination}
      onPaginationChange={onPaginationChange}
      headerActions={[{
        label: 'Create Sales Order',
        onClick: onCreate,
        icon: FileText,
      }]}
    />
  );
}

