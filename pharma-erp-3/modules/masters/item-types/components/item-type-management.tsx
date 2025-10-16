'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useQueryState } from 'nuqs';
import { ItemTypeFilter } from './item-type-filter';
import { ItemTypeTable } from './item-type-table';
import { ItemTypeDrawer } from './item-type-drawer';
import { toast } from 'sonner';
import { ItemType } from '../types';
import { useItemTypes, useDeleteItemType } from '../hooks';

export function ItemTypeManagement() {
  const [search] = useQueryState('search', { defaultValue: '' });
  const [isActive] = useQueryState('isActive', { defaultValue: '' });
  const [page] = useQueryState('page', { defaultValue: '1' });
  const [pageSize] = useQueryState('pageSize', { defaultValue: '10' });

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedItemType, setSelectedItemType] = useState<ItemType | undefined>(undefined);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit' | 'view'>('create');

  const currentPagination = useMemo(() => ({
    pageIndex: parseInt(page) - 1,
    pageSize: parseInt(pageSize),
  }), [page, pageSize]);

  const { data: itemTypeData, isLoading, error } = useItemTypes({
    search: search || undefined,
    isActive: isActive ? isActive === 'true' : undefined,
    pageNumber: currentPagination.pageIndex + 1,
    pageSize: currentPagination.pageSize,
  });

  const deleteItemType = useDeleteItemType();
  const itemTypes = itemTypeData?.items || [];
  const totalCount = itemTypes?.length || 0;
  const pageCount = Math.ceil(totalCount / currentPagination.pageSize);

  const handleCreate = () => {
    setSelectedItemType(undefined);
    setDrawerMode('create');
    setDrawerOpen(true);
  };

  const handleView = (itemType: ItemType) => {
    setSelectedItemType(itemType);
    setDrawerMode('view');
    setDrawerOpen(true);
  };

  const handleEdit = (itemType: ItemType) => {
    setSelectedItemType(itemType);
    setDrawerMode('edit');
    setDrawerOpen(true);
  };

  const handleDelete = async (itemType: ItemType) => {
    if (confirm(`Are you sure you want to delete item type "${itemType.name}"?`)) {
      try {
        await deleteItemType.mutateAsync(itemType.id);
        toast.success('Item type deleted successfully');
      } catch (error) {
        toast.error('Failed to delete item type');
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
        <p className="text-red-600">Error loading item types: {error.message}</p>
      </div>
    );
  }

  return (
    <div>
      <Card className='border-none rounded-none py-1'>
        <CardContent className="space-y-4 px-3">
          <ItemTypeFilter />
          <ItemTypeTable
            itemTypes={itemTypes}
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

      <ItemTypeDrawer
        itemType={selectedItemType}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        mode={drawerMode}
      />
    </div>
  );
}
