'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useQueryState } from 'nuqs';
import { SalesOrderFilterComponent } from './sales-order-filter';
import { SalesOrderTable } from './sales-order-table';
import { toast } from 'sonner';
import { SalesOrderWithApprovals } from '../types';
import { useSalesOrdersWithApprovals, useDeleteSalesOrder } from '../hooks';

export function SalesOrderApprovalManagement() {
  const [search] = useQueryState('search', { defaultValue: '' });
  const [soStatus] = useQueryState('soStatus', { defaultValue: '' });
  const [currentStatus] = useQueryState('currentStatus', { defaultValue: '' });
  const [page] = useQueryState('page', { defaultValue: '1' });
  const [pageSize] = useQueryState('pageSize', { defaultValue: '10' });

  const [selectedSalesOrder, setSelectedSalesOrder] = useState<SalesOrderWithApprovals | undefined>(undefined);

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
    toast.info('Create Sales Order functionality will be available soon');
  };

  const handleView = (salesOrder: SalesOrderWithApprovals) => {
    toast.info(`Viewing SO: ${salesOrder.soNumber}`);
  };

  const handleEdit = (salesOrder: SalesOrderWithApprovals) => {
    toast.info(`Editing SO: ${salesOrder.soNumber}`);
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
            onCreate={handleCreate}
            totalCount={totalCount}
            pageCount={pageCount}
            onPaginationChange={handlePaginationChange}
            currentPagination={currentPagination}
          />
        </CardContent>
      </Card>
    </div>
  );
}

