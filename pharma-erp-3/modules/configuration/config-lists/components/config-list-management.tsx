'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useQueryState } from 'nuqs';
import { ConfigListFilter } from './config-list-filter';
import { ConfigListTable } from './config-list-table';
import { ConfigListDrawer } from './config-list-drawer';
import { toast } from 'sonner';
import { ConfigList } from '../types';
import { useConfigLists, useDeleteConfigList } from '../hooks';

export function ConfigListManagement() {
  const [search] = useQueryState('search', { defaultValue: '' });
  const [isActive] = useQueryState('isActive', { defaultValue: '' });
  const [page] = useQueryState('page', { defaultValue: '1' });
  const [pageSize] = useQueryState('pageSize', { defaultValue: '10' });

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedConfigList, setSelectedConfigList] = useState<ConfigList | undefined>(undefined);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit' | 'view'>('create');

  const currentPagination = useMemo(() => ({
    pageIndex: parseInt(page) - 1,
    pageSize: parseInt(pageSize),
  }), [page, pageSize]);

  const { data: configListsData, isLoading, error } = useConfigLists({
    search: search || undefined,
    isActive: isActive ? isActive === 'true' : undefined,
    pageNumber: currentPagination.pageIndex + 1,
    pageSize: currentPagination.pageSize,
  });

  const deleteConfigList = useDeleteConfigList();
  const configLists = configListsData?.items || [];
  const totalCount = configListsData?.totalCount || 0;
  const pageCount = Math.ceil(totalCount / currentPagination.pageSize);

  const handleCreate = () => {
    setSelectedConfigList(undefined);
    setDrawerMode('create');
    setDrawerOpen(true);
  };

  const handleView = (configList: ConfigList) => {
    setSelectedConfigList(configList);
    setDrawerMode('view');
    setDrawerOpen(true);
  };

  const handleEdit = (configList: ConfigList) => {
    setSelectedConfigList(configList);
    setDrawerMode('edit');
    setDrawerOpen(true);
  };

  const handleDelete = async (configList: ConfigList) => {
    if (confirm(`Are you sure you want to delete config list "${configList.listName}"?`)) {
      try {
        await deleteConfigList.mutateAsync(configList.id);
        toast.success('Config List deleted successfully');
      } catch (error) {
        toast.error('Failed to delete config list');
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
        <p className="text-red-600">Error loading config lists: {error.message}</p>
      </div>
    );
  }

  return (
    <div>
      <Card className='border-none rounded-none py-1'>
        <CardContent className="space-y-4 px-3">
          <ConfigListFilter />
          <ConfigListTable
            configLists={configLists}
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

      <ConfigListDrawer
        configList={selectedConfigList}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        mode={drawerMode}
      />
    </div>
  );
}

