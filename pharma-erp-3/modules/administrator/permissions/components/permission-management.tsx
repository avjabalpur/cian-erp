'use client';

import { useState, useMemo } from 'react';
import { useQueryState } from 'nuqs';
import { usePermissions, useDeletePermission } from '../hooks';
import { PermissionFilter } from './permission-filter';
import { PermissionTable } from './permission-table';
import { PermissionDrawer } from './permission-drawer';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Permission } from '../types';

export function PermissionManagement() {
  const [search] = useQueryState('search', { defaultValue: '' });
  const [moduleName] = useQueryState('moduleName', { defaultValue: '' });
  const [page] = useQueryState('page', { defaultValue: '1' });
  const [pageSize] = useQueryState('pageSize', { defaultValue: '20' });

  const [selectedPermission, setSelectedPermission] = useState<Permission | undefined>();
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit' | 'view'>('create');
  const [drawerOpen, setDrawerOpen] = useState(false);

  const currentPagination = useMemo(() => ({
    pageIndex: parseInt(page) - 1,
    pageSize: parseInt(pageSize),
  }), [page, pageSize]);

  const { data: permissionData, isLoading, error } = usePermissions({
    search: search || undefined,
    moduleName: moduleName || undefined,
    pageNumber: currentPagination.pageIndex + 1,
    pageSize: currentPagination.pageSize,
  });

  const deletePermission = useDeletePermission();
  const permissions = permissionData?.items || [];
  const totalCount = permissionData?.totalCount || 0;
  const pageCount = Math.ceil(totalCount / currentPagination.pageSize);

  const handleView = (permission: Permission) => {
    setSelectedPermission(permission);
    setDrawerMode('view');
    setDrawerOpen(true);
  };

  const handleEdit = (permission: Permission) => {
    setSelectedPermission(permission);
    setDrawerMode('edit');
    setDrawerOpen(true);
  };

  const handleDelete = async (permission: Permission) => {
    if (confirm(`Are you sure you want to delete permission "${permission.name}"?`)) {
      try {
        await deletePermission.mutateAsync(permission.id.toString());
        toast.success('Permission deleted successfully');
      } catch (error) {
        toast.error('Failed to delete permission');
      }
    }
  };

  const handleCreate = () => {
    setSelectedPermission(undefined);
    setDrawerMode('create');
    setDrawerOpen(true);
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
        <p className="text-red-600">Error loading permissions: {error.message}</p>
      </div>
    );
  }

  return (
    <div>
      <Card className='border-none rounded-none py-1'>
        <CardContent className="space-y-4 px-3">
          <PermissionFilter />
          <PermissionTable
            permissions={permissions}
            isLoading={isLoading}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onCreate={handleCreate}
            totalCount={totalCount}
            pageCount={pageCount}
            onPaginationChange={handlePaginationChange}
            currentPagination={currentPagination}
          />
        </CardContent>
      </Card>

      <PermissionDrawer
        permission={selectedPermission}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        mode={drawerMode}
      />
    </div>
  );
}

