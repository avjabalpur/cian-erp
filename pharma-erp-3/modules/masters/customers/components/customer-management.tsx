'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useQueryState } from 'nuqs';
import { CustomerFilter } from './customer-filter';
import { CustomerTable } from './customer-table';
import { CustomerDrawer } from './customer-drawer';
import { toast } from 'sonner';
import { Customer } from '../types';
import { useCustomers, useCreateCustomer, useUpdateCustomer, useDeleteCustomer } from '../hooks';
import { CustomerFormValues } from '../validations';

export function CustomerManagement() {
  const [search] = useQueryState('search', { defaultValue: '' });
  const [isActive] = useQueryState('isActive', { defaultValue: '' });
  const [isExportCustomer] = useQueryState('isExportCustomer', { defaultValue: '' });
  const [page] = useQueryState('page', { defaultValue: '1' });
  const [pageSize] = useQueryState('pageSize', { defaultValue: '10' });

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | undefined>(undefined);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit' | 'view'>('create');

  const currentPagination = useMemo(() => ({
    pageIndex: parseInt(page) - 1,
    pageSize: parseInt(pageSize),
  }), [page, pageSize]);

  const { data: customersData, isLoading, error } = useCustomers({
    search: search || undefined,
    isActive: isActive ? isActive === 'true' : undefined,
    isExportCustomer: isExportCustomer ? isExportCustomer === 'true' : undefined,
    pageNumber: currentPagination.pageIndex + 1,
    pageSize: currentPagination.pageSize,
  });

  const createCustomer = useCreateCustomer();
  const updateCustomer = useUpdateCustomer();
  const deleteCustomer = useDeleteCustomer();

  const customers = customersData?.items || [];
  const totalCount = customersData?.totalCount || 0;
  const pageCount = Math.ceil(totalCount / currentPagination.pageSize);

  const handleCreate = () => {
    setSelectedCustomer(undefined);
    setDrawerMode('create');
    setDrawerOpen(true);
  };

  const handleView = (customer: Customer) => {
    setSelectedCustomer(customer);
    setDrawerMode('view');
    setDrawerOpen(true);
  };

  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer);
    setDrawerMode('edit');
    setDrawerOpen(true);
  };

  const handleDelete = async (customer: Customer) => {
    if (confirm(`Are you sure you want to delete customer "${customer.customerName}"?`)) {
      try {
        await deleteCustomer.mutateAsync(customer.id);
        toast.success('Customer deleted successfully');
      } catch (error) {
        toast.error('Failed to delete customer');
      }
    }
  };

  const handleSubmit = async (data: CustomerFormValues) => {
    try {
      if (selectedCustomer) {
        await updateCustomer.mutateAsync({ id: selectedCustomer.id, data });
        toast.success('Customer updated successfully');
      } else {
        await createCustomer.mutateAsync(data as any);
        toast.success('Customer created successfully');
      }
      setDrawerOpen(false);
      setSelectedCustomer(undefined);
    } catch (error) {
      toast.error(selectedCustomer ? 'Failed to update customer' : 'Failed to create customer');
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
        <p className="text-red-600">Error loading customers: {error.message}</p>
      </div>
    );
  }

  return (
    <div>
      <Card className='border-none rounded-none py-1'>
        <CardContent className="space-y-4 px-3">
          <CustomerFilter />
          <CustomerTable
            customers={customers}
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

      <CustomerDrawer
        customer={selectedCustomer}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        onSubmit={handleSubmit}
        isLoading={createCustomer.isPending || updateCustomer.isPending}
        mode={drawerMode}
      />
    </div>
  );
}

