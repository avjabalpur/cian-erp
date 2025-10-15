'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useQueryState } from 'nuqs';
import { DivisionFilter } from './division-filter';
import { DivisionTable } from './division-table';
import { DivisionDrawer } from './division-drawer';
import { toast } from 'sonner';
import { Division } from '../types';
import { useDivisions, useDeleteDivision } from '../hooks';
import { useDepartments } from '@/modules/masters/departments';

export function DivisionManagement() {
  const [search] = useQueryState('search', { defaultValue: '' });
  const [status] = useQueryState('status', { defaultValue: '' });
  const [departmentId] = useQueryState('departmentId', { defaultValue: '' });
  const [page] = useQueryState('page', { defaultValue: '1' });
  const [pageSize] = useQueryState('pageSize', { defaultValue: '10' });

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedDivision, setSelectedDivision] = useState<Division | undefined>(undefined);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit' | 'view'>('create');

  const currentPagination = useMemo(() => ({
    pageIndex: parseInt(page) - 1,
    pageSize: parseInt(pageSize),
  }), [page, pageSize]);

  const { data: divisions = [], isLoading, error } = useDivisions({
    search: search || undefined,
    status: status || undefined,
    departmentId: departmentId ? parseInt(departmentId) : undefined,
    pageNumber: currentPagination.pageIndex + 1,
    pageSize: currentPagination.pageSize,
  });

  const { data: departments = [] } = useDepartments();
  const deleteDivision = useDeleteDivision();
  const totalCount = divisions?.length || 0;
  const pageCount = Math.ceil(totalCount / currentPagination.pageSize);

  const handleCreate = () => {
    setSelectedDivision(undefined);
    setDrawerMode('create');
    setDrawerOpen(true);
  };

  const handleView = (division: Division) => {
    setSelectedDivision(division);
    setDrawerMode('view');
    setDrawerOpen(true);
  };

  const handleEdit = (division: Division) => {
    setSelectedDivision(division);
    setDrawerMode('edit');
    setDrawerOpen(true);
  };

  const handleDelete = async (division: Division) => {
    if (confirm(`Are you sure you want to delete division "${division.name}"?`)) {
      try {
        await deleteDivision.mutateAsync(division.id);
        toast.success('Division deleted successfully');
      } catch (error) {
        toast.error('Failed to delete division');
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
        <p className="text-red-600">Error loading divisions: {error.message}</p>
      </div>
    );
  }

  return (
    <div>
      <Card className='border-none rounded-none py-1'>
        <CardContent className="space-y-4 px-3">
          <DivisionFilter />
          <DivisionTable
            divisions={divisions}
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

      <DivisionDrawer
        division={selectedDivision}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        mode={drawerMode}
        departments={departments}
      />
    </div>
  );
}
