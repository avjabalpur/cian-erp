'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useQueryState } from 'nuqs';
import { CustomerTypeFilter } from './customer-type-filter';
import { CustomerTypeTable } from './customer-type-table';
import { CustomerTypeDrawer } from './customer-type-drawer';
import { toast } from 'sonner';
import { CustomerType } from '../types';
import { useCustomerTypes, useDeleteCustomerType } from '../hooks';

export function CustomerTypeManagement() {
  const [search] = useQueryState('search', { defaultValue: '' });
  const [isActive] = useQueryState('isActive', { defaultValue: '' });
  const [page] = useQueryState('page', { defaultValue: '1' });
  const [pageSize] = useQueryState('pageSize', { defaultValue: '10' });

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedCustomerType, setSelectedCustomerType] = useState<CustomerType | undefined>(undefined);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit' | 'view'>('create');

  const currentPagination = useMemo(() => ({
    pageIndex: parseInt(page) - 1,
    pageSize: parseInt(pageSize),
  }), [page, pageSize]);

  const { data: customerTypesData, isLoading, error } = useCustomerTypes({
    search: search || undefined,
    isActive: isActive ? isActive === 'true' : undefined,
    pageNumber: currentPagination.pageIndex + 1,
    pageSize: currentPagination.pageSize,
  });

  const deleteCustomerType = useDeleteCustomerType();
  const customerTypes = customerTypesData?.items || [];
  const totalCount = customerTypesData?.totalCount || 0;
  const pageCount = Math.ceil(totalCount / currentPagination.pageSize);

  const handleCreate = () => {
    setSelectedCustomerType(undefined);
    setDrawerMode('create');
    setDrawerOpen(true);
  };

  const handleView = (customerType: CustomerType) => {
    setSelectedCustomerType(customerType);
    setDrawerMode('view');
    setDrawerOpen(true);
  };

  const handleEdit = (customerType: CustomerType) => {
    setSelectedCustomerType(customerType);
    setDrawerMode('edit');
    setDrawerOpen(true);
  };

  const handleDelete = async (customerType: CustomerType) => {
    if (confirm(`Are you sure you want to delete customer type "${customerType.name}"?`)) {
      try {
        await deleteCustomerType.mutateAsync(customerType.id);
        toast.success('Customer Type deleted successfully');
      } catch (error) {
        toast.error('Failed to delete customer type');
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
        <p className="text-red-600">Error loading customer types: {error.message}</p>
      </div>
    );
  }

  return (
    <div>
      <Card className='border-none rounded-none py-1'>
        <CardContent className="space-y-4 px-3">
          <CustomerTypeFilter />
          <CustomerTypeTable
            customerTypes={customerTypes}
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

      <CustomerTypeDrawer
        customerType={selectedCustomerType}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        mode={drawerMode}
      />
    </div>
  );
}

