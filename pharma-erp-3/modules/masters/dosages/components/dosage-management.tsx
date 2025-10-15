'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useQueryState } from 'nuqs';
import { DosageFilter } from './dosage-filter';
import { DosageTable } from './dosage-table';
import { DosageDrawer } from './dosage-drawer';
import { toast } from 'sonner';
import { Dosage } from '../types';
import { useDosages, useDeleteDosage } from '../hooks';

export function DosageManagement() {
  const [search] = useQueryState('search', { defaultValue: '' });
  const [status] = useQueryState('status', { defaultValue: '' });
  const [page] = useQueryState('page', { defaultValue: '1' });
  const [pageSize] = useQueryState('pageSize', { defaultValue: '10' });

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedDosage, setSelectedDosage] = useState<Dosage | undefined>(undefined);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit' | 'view'>('create');

  const currentPagination = useMemo(() => ({
    pageIndex: parseInt(page) - 1,
    pageSize: parseInt(pageSize),
  }), [page, pageSize]);

  const { data: dosagesData, isLoading, error } = useDosages({
    search: search || undefined,
    status: status || undefined,
    pageNumber: currentPagination.pageIndex + 1,
    pageSize: currentPagination.pageSize,
  });

  const deleteDosage = useDeleteDosage();
  const dosages = dosagesData?.items || [];
  const totalCount = dosages?.length || 0;
  const pageCount = Math.ceil(totalCount / currentPagination.pageSize);

  const handleCreate = () => {
    setSelectedDosage(undefined);
    setDrawerMode('create');
    setDrawerOpen(true);
  };

  const handleView = (dosage: Dosage) => {
    setSelectedDosage(dosage);
    setDrawerMode('view');
    setDrawerOpen(true);
  };

  const handleEdit = (dosage: Dosage) => {
    setSelectedDosage(dosage);
    setDrawerMode('edit');
    setDrawerOpen(true);
  };

  const handleDelete = async (dosage: Dosage) => {
    if (confirm(`Are you sure you want to delete dosage "${dosage.name}"?`)) {
      try {
        await deleteDosage.mutateAsync(dosage.id);
        toast.success('Dosage deleted successfully');
      } catch (error) {
        toast.error('Failed to delete dosage');
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
        <p className="text-red-600">Error loading dosages: {error.message}</p>
      </div>
    );
  }

  return (
    <div>
      <Card className='border-none rounded-none py-1'>
        <CardContent className="space-y-4 px-3">
          <DosageFilter />
          <DosageTable
            dosages={dosages}
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

      <DosageDrawer
        dosage={selectedDosage}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        mode={drawerMode}
      />
    </div>
  );
}
