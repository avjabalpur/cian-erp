'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useQueryState } from 'nuqs';
import { ConfigSettingTable } from './config-setting-table';
import { ConfigSettingDrawer } from './config-setting-drawer';
import { toast } from 'sonner';
import { ConfigSetting } from '../types';
import { useConfigSettings, useDeleteConfigSetting } from '../hooks';
import { ConfigSettingFilter } from './config-setting-filter';

export function ConfigSettingManagement() {
  const [search] = useQueryState('search', { defaultValue: '' });
  const [isActive] = useQueryState('isActive', { defaultValue: '' });
  const [page] = useQueryState('page', { defaultValue: '1' });
  const [pageSize] = useQueryState('pageSize', { defaultValue: '10' });

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedConfigSetting, setSelectedConfigSetting] = useState<ConfigSetting | undefined>(undefined);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit' | 'view'>('create');

  const currentPagination = useMemo(() => ({
    pageIndex: parseInt(page) - 1,
    pageSize: parseInt(pageSize),
  }), [page, pageSize]);

  const { data: configSettingsData, isLoading, error } = useConfigSettings({
    search: search || undefined,
    isActive: isActive ? isActive === 'true' : undefined,
    pageNumber: currentPagination.pageIndex + 1,
    pageSize: currentPagination.pageSize,
  });

  const deleteConfigSetting = useDeleteConfigSetting();
  const configSettings = configSettingsData?.items || [];
  const totalCount = configSettingsData?.totalCount || 0;
  const pageCount = Math.ceil(totalCount / currentPagination.pageSize);

  const handleCreate = () => {
    setSelectedConfigSetting(undefined);
    setDrawerMode('create');
    setDrawerOpen(true);
  };

  const handleView = (configSetting: ConfigSetting) => {
    setSelectedConfigSetting(configSetting);
    setDrawerMode('view');
    setDrawerOpen(true);
  };

  const handleEdit = (configSetting: ConfigSetting) => {
    setSelectedConfigSetting(configSetting);
    setDrawerMode('edit');
    setDrawerOpen(true);
  };

  const handleDelete = async (configSetting: ConfigSetting) => {
    if (confirm(`Are you sure you want to delete config setting "${configSetting.settingName}"?`)) {
      try {
        await deleteConfigSetting.mutateAsync(configSetting.id);
        toast.success('Config Setting deleted successfully');
      } catch (error) {
        toast.error('Failed to delete config setting');
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
        <p className="text-red-600">Error loading config settings: {error.message}</p>
      </div>
    );
  }

  return (
    <div>
      <Card className='border-none rounded-none py-1'>
        <CardContent className="space-y-4 px-3">
          <ConfigSettingFilter />
          <ConfigSettingTable
            configSettings={configSettings}
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

      <ConfigSettingDrawer
        configSetting={selectedConfigSetting}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        mode={drawerMode}
      />
    </div>
  );
}

