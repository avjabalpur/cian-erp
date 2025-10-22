'use client';

import { DataTable, createActionColumn } from '@/components/shared/data-table';
import { SalesOrderWithApprovals } from '../types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, X, Clock, FileText, Copy, Edit, ExternalLink } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from 'sonner';

interface SalesOrderTableProps {
  salesOrders: SalesOrderWithApprovals[];
  isLoading: boolean;
  onEdit: (salesOrder: SalesOrderWithApprovals) => void;
  onView: (salesOrder: SalesOrderWithApprovals) => void;
  onDelete: (salesOrder: SalesOrderWithApprovals) => void;
  onCopyLink: (salesOrder: SalesOrderWithApprovals) => void;
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
  onCopyLink,
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
      accessorKey: 'soDate',
      header: 'Date',
      cell: ({ row }: any) => {
        if (!row.original.createdAt) return '-';
        const date = new Date(row.original.createdAt);
        return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
      },
    },
    {
      accessorKey: 'customerName',
      header: 'Customer',
      cell: ({ row }: any) => (
        <div className="max-w-[200px] truncate text-orange-600 font-medium">
          {row.original.customerName || '-'}
        </div>
      ),
    },
    {
      accessorKey: 'organizationName',
      header: 'Company',
      cell: ({ row }: any) => (
        <div className="max-w-[150px] truncate">{row.original.organizationName || '-'}</div>
      ),
    },
    {
      accessorKey: 'itemName',
      header: 'Product',
      cell: ({ row }: any) => (
        <div className="max-w-[200px] truncate text-purple-600 font-medium cursor-pointer hover:underline" onClick={() => onEdit(row.original)}>
          {row.original.itemName || '-'}
        </div>
      ),
    },
    {
      accessorKey: 'assignedDesignerName',
      header: 'Designer',
      cell: ({ row }: any) => (
        <div className="text-sm">{row.original.assignedDesignerName || '-'}</div>
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
      accessorKey: 'finalQaApproved',
      header: 'Final QA',
      cell: ({ row }: any) => getApprovalIcon(row.original.finalQaApproved),
    },
    {
      accessorKey: 'isFinalAuthorized',
      header: 'Final Auth',
      cell: ({ row }: any) => getApprovalIcon(row.original.isFinalAuthorized),
    },
    {
      accessorKey: 'plantEmailSent',
      header: 'Email',
      cell: ({ row }: any) => (
        row.original.plantEmailSent ? (
          <Check className="h-4 w-4 text-green-600 mx-auto" />
        ) : (
          <X className="h-4 w-4 text-red-600 mx-auto" />
        )
      ),
    },
    {
      accessorKey: 'actions',
      header: 'Actions',
      cell: ({ row }: any) => (
        <TooltipProvider>
          <div className="flex gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="default"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(row.original);
                  }}
                >
                  <Edit className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Edit</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(`/sales/order-approvals/${row.original.id}`, '_blank');
                  }}
                >
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Open in New Tab</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCopyLink(row.original);
                  }}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Copy Form Link</TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      ),
    },
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

