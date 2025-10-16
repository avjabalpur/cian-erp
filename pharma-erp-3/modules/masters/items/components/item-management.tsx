'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useQueryState } from 'nuqs';
import { ItemFilter } from './item-filter';
import { ItemTable } from './item-table';
import { ItemDrawer } from './item-drawer';
import { toast } from 'sonner';
import { ItemMaster } from '../types';
import { useItemMasters, useCreateItemMaster, useUpdateItemMaster, useDeleteItemMaster } from '../hooks';
import { ItemMasterFormValues } from '../validations';

export function ItemManagement() {
  const [search] = useQueryState('search', { defaultValue: '' });
  const [manufactured] = useQueryState('manufactured', { defaultValue: '' });
  const [qcRequired] = useQueryState('qcRequired', { defaultValue: '' });
  const [page] = useQueryState('page', { defaultValue: '1' });
  const [pageSize] = useQueryState('pageSize', { defaultValue: '10' });

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ItemMaster | undefined>(undefined);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit' | 'view'>('create');

  const currentPagination = useMemo(() => ({
    pageIndex: parseInt(page) - 1,
    pageSize: parseInt(pageSize),
  }), [page, pageSize]);

  const { data: itemsData, isLoading, error } = useItemMasters({
    search: search || undefined,
    manufactured: manufactured ? manufactured === 'true' : undefined,
    qcRequired: qcRequired ? qcRequired === 'true' : undefined,
    pageNumber: currentPagination.pageIndex + 1,
    pageSize: currentPagination.pageSize,
  });

  const createItem = useCreateItemMaster();
  const updateItem = useUpdateItemMaster();
  const deleteItem = useDeleteItemMaster();

  const items = itemsData?.items || [];
  const totalCount = itemsData?.totalCount || 0;
  const pageCount = Math.ceil(totalCount / currentPagination.pageSize);

  const handleCreate = () => {
    setSelectedItem(undefined);
    setDrawerMode('create');
    setDrawerOpen(true);
  };

  const handleView = (item: ItemMaster) => {
    setSelectedItem(item);
    setDrawerMode('view');
    setDrawerOpen(true);
  };

  const handleEdit = (item: ItemMaster) => {
    setSelectedItem(item);
    setDrawerMode('edit');
    setDrawerOpen(true);
  };

  const handleDelete = async (item: ItemMaster) => {
    if (confirm(`Are you sure you want to delete item "${item.itemName}"?`)) {
      try {
        await deleteItem.mutateAsync(item.id);
        toast.success('Item deleted successfully');
      } catch (error) {
        toast.error('Failed to delete item');
      }
    }
  };

  const handleSubmit = async (data: ItemMasterFormValues) => {
    try {
      if (selectedItem) {
        await updateItem.mutateAsync({ id: selectedItem.id, data });
        toast.success('Item updated successfully');
      } else {
        await createItem.mutateAsync(data);
        toast.success('Item created successfully');
      }
      setDrawerOpen(false);
      setSelectedItem(undefined);
    } catch (error) {
      toast.error(selectedItem ? 'Failed to update item' : 'Failed to create item');
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
        <p className="text-red-600">Error loading items: {error.message}</p>
      </div>
    );
  }

  return (
    <div>
      <Card className='border-none rounded-none py-1'>
        <CardContent className="space-y-4 px-3">
          <ItemFilter />
          <ItemTable
            items={items}
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

      <ItemDrawer
        item={selectedItem}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        onSubmit={handleSubmit}
        isLoading={createItem.isPending || updateItem.isPending}
        mode={drawerMode}
      />
    </div>
  );
}

