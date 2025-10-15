'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useQueryState } from 'nuqs';
import { LocationTypeFilter } from './location-type-filter';
import { LocationTypeTable } from './location-type-table';
import { LocationTypeDrawer } from './location-type-drawer';
import { toast } from 'sonner';
import { LocationType } from '../types';
import { useLocationTypes, useDeleteLocationType } from '../hooks';

export function LocationTypeManagement() {
  const [search] = useQueryState('search', { defaultValue: '' });
  const [status] = useQueryState('status', { defaultValue: '' });
  const [page] = useQueryState('page', { defaultValue: '1' });
  const [pageSize] = useQueryState('pageSize', { defaultValue: '10' });

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedLocationType, setSelectedLocationType] = useState<LocationType | undefined>(undefined);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit' | 'view'>('create');

  const currentPagination = useMemo(() => ({
    pageIndex: parseInt(page) - 1,
    pageSize: parseInt(pageSize),
  }), [page, pageSize]);

  const { data: locationTypes = [], isLoading, error } = useLocationTypes({
    search: search || undefined,
    status: status || undefined,
    pageNumber: currentPagination.pageIndex + 1,
    pageSize: currentPagination.pageSize,
  });

  const deleteLocationType = useDeleteLocationType();
  const totalCount = locationTypes?.length || 0;
  const pageCount = Math.ceil(totalCount / currentPagination.pageSize);

  const handleCreate = () => {
    setSelectedLocationType(undefined);
    setDrawerMode('create');
    setDrawerOpen(true);
  };

  const handleView = (locationType: LocationType) => {
    setSelectedLocationType(locationType);
    setDrawerMode('view');
    setDrawerOpen(true);
  };

  const handleEdit = (locationType: LocationType) => {
    setSelectedLocationType(locationType);
    setDrawerMode('edit');
    setDrawerOpen(true);
  };

  const handleDelete = async (locationType: LocationType) => {
    if (confirm(`Are you sure you want to delete location type "${locationType.name}"?`)) {
      try {
        await deleteLocationType.mutateAsync(locationType.id);
        toast.success('Location type deleted successfully');
      } catch (error) {
        toast.error('Failed to delete location type');
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
        <p className="text-red-600">Error loading location types: {error.message}</p>
      </div>
    );
  }

  return (
    <div>
      <Card className='border-none rounded-none py-1'>
        <CardContent className="space-y-4 px-3">
          <LocationTypeFilter />
          <LocationTypeTable
            locationTypes={locationTypes}
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

      <LocationTypeDrawer
        locationType={selectedLocationType}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        mode={drawerMode}
      />
    </div>
  );
}
