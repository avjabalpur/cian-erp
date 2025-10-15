'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useQueryState } from 'nuqs';
import { HsnFilter } from './hsn-filter';
import { HsnTable } from './hsn-table';
import { HsnDrawer } from './hsn-drawer';
import { toast } from 'sonner';
import { HsnMaster } from '../types';
import { useHsnMaster, useDeleteHsnMaster } from '../hooks';

export function HsnManagement() {
  const [search] = useQueryState('search', { defaultValue: '' });
  const [isActive] = useQueryState('isActive', { defaultValue: '' });
  const [page] = useQueryState('page', { defaultValue: '1' });
  const [pageSize] = useQueryState('pageSize', { defaultValue: '10' });

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedHsnMaster, setSelectedHsnMaster] = useState<HsnMaster | undefined>(undefined);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit' | 'view'>('create');

  const currentPagination = useMemo(() => ({
    pageIndex: parseInt(page) - 1,
    pageSize: parseInt(pageSize),
  }), [page, pageSize]);

  const { data: hsnData, isLoading, error } = useHsnMaster({
    search: search || undefined,
    isActive: isActive ? isActive === 'true' : undefined,
    pageNumber: currentPagination.pageIndex + 1,
    pageSize: currentPagination.pageSize,
  });

  const deleteHsnMaster = useDeleteHsnMaster();
  const hsnMasters = hsnData?.items || [];
  const totalCount = hsnMasters?.length || 0;
  const pageCount = Math.ceil(totalCount / currentPagination.pageSize);

  const handleCreate = () => {
    setSelectedHsnMaster(undefined);
    setDrawerMode('create');
    setDrawerOpen(true);
  };

  const handleView = (hsnMaster: HsnMaster) => {
    setSelectedHsnMaster(hsnMaster);
    setDrawerMode('view');
    setDrawerOpen(true);
  };

  const handleEdit = (hsnMaster: HsnMaster) => {
    setSelectedHsnMaster(hsnMaster);
    setDrawerMode('edit');
    setDrawerOpen(true);
  };

  const handleDelete = async (hsnMaster: HsnMaster) => {
    if (confirm(`Are you sure you want to delete HSN master "${hsnMaster.code} - ${hsnMaster.name}"?`)) {
      try {
        await deleteHsnMaster.mutateAsync(hsnMaster.id);
        toast.success('HSN master deleted successfully');
      } catch (error) {
        toast.error('Failed to delete HSN master');
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
        <p className="text-red-600">Error loading HSN masters: {error.message}</p>
      </div>
    );
  }

  return (
    <div>
      <Card className='border-none rounded-none py-1'>
        <CardContent className="space-y-4 px-3">
          <HsnFilter />
          <HsnTable
            hsnMasters={hsnMasters}
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

      <HsnDrawer
        hsnMaster={selectedHsnMaster}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        mode={drawerMode}
      />
    </div>
  );
}
