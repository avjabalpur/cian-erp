'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useQueryState } from 'nuqs';
import { SalesOrderFilterComponent } from './sales-order-filter';
import { SalesOrderTable } from './sales-order-table';
import { CreateSalesOrderModal } from './create-sales-order-modal';
import { SalesOrderDrawer } from './sales-order-drawer';
import { toast } from 'sonner';
import { SalesOrderWithApprovals } from '../types';
import { useSalesOrdersWithApprovals, useDeleteSalesOrder } from '../hooks';
import { useRouter } from 'next/navigation';

export function SalesOrderApprovalManagement() {
  const router = useRouter();
  const [search] = useQueryState('search', { defaultValue: '' });
  const [soStatus] = useQueryState('soStatus', { defaultValue: '' });
  const [currentStatus] = useQueryState('currentStatus', { defaultValue: '' });
  const [page] = useQueryState('page', { defaultValue: '1' });
  const [pageSize] = useQueryState('pageSize', { defaultValue: '10' });

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedSalesOrderId, setSelectedSalesOrderId] = useState<number | null>(null);

  const currentPagination = useMemo(() => ({
    pageIndex: parseInt(page) - 1,
    pageSize: parseInt(pageSize),
  }), [page, pageSize]);

  const { data: salesOrdersData, isLoading, error } = useSalesOrdersWithApprovals({
    search: search || undefined,
    soStatus: soStatus || undefined,
    currentStatus: currentStatus || undefined,
    pageNumber: currentPagination.pageIndex + 1,
    pageSize: currentPagination.pageSize,
  });

  const deleteSalesOrder = useDeleteSalesOrder();

  const salesOrders = salesOrdersData?.items || [];
  const totalCount = salesOrdersData?.totalCount || 0;
  const pageCount = Math.ceil(totalCount / currentPagination.pageSize);

  const handleCreate = () => {
    setCreateModalOpen(true);
  };

  const handleCreateSuccess = (salesOrderId: number) => {
    setSelectedSalesOrderId(salesOrderId);
    setDrawerOpen(true);
  };

  const handleView = (salesOrder: SalesOrderWithApprovals) => {
    setSelectedSalesOrderId(salesOrder.id);
    setDrawerOpen(true);
  };

  const handleEdit = (salesOrder: SalesOrderWithApprovals) => {
    setSelectedSalesOrderId(salesOrder.id);
    setDrawerOpen(true);
  };

  const handleCopyLink = (salesOrder: SalesOrderWithApprovals) => {
    const link = `${window.location.origin}/sales/order-approvals/${salesOrder.id}`;
    navigator.clipboard.writeText(link);
    toast.success('Link copied to clipboard');
  };

  const handleDelete = async (salesOrder: SalesOrderWithApprovals) => {
    if (confirm(`Are you sure you want to delete sales order "${salesOrder.soNumber}"?`)) {
      try {
        await deleteSalesOrder.mutateAsync(salesOrder.id);
        toast.success('Sales Order deleted successfully');
      } catch (error) {
        toast.error('Failed to delete sales order');
      }
    }
  };

  const handlePaginationChange = (pagination: { pageIndex: number; pageSize: number }) => {
    const newPage = (pagination.pageIndex + 1).toString();
    const newPageSize = pagination.pageSize.toString();

    const url = new URL(window.location.href);
    url.searchParams.set('page', newPage);
    url.searchParams.set('pageSize', newPageSize);
    window.history.pushState({}, '', url.toString());
  };

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error loading sales orders: {error.message}</p>
      </div>
    );
  }

  return (
    <div>
      <Card className='border-none rounded-none py-1'>
        <CardContent className="space-y-4 px-3">
          <SalesOrderFilterComponent />
          <SalesOrderTable
            salesOrders={salesOrders}
            isLoading={isLoading}
            onEdit={handleEdit}
            onView={handleView}
            onDelete={handleDelete}
            onCopyLink={handleCopyLink}
            onCreate={handleCreate}
            totalCount={totalCount}
            pageCount={pageCount}
            onPaginationChange={handlePaginationChange}
            currentPagination={currentPagination}
          />
        </CardContent>
      </Card>

      <CreateSalesOrderModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onSuccess={handleCreateSuccess}
      />

      <SalesOrderDrawer
        salesOrderId={selectedSalesOrderId}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        onSuccess={() => {
          setDrawerOpen(false);
          setSelectedSalesOrderId(null);
        }}
      />
    </div>
  );
}

