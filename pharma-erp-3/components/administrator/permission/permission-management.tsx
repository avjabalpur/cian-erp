'use client';

import { useState, useMemo } from 'react';
import { useQueryState } from 'nuqs';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useCreatePermission, useDeletePermission, useUpdatePermission, usePermissions, usePermissionsList } from '@/hooks/api/use-permissions';
import { PermissionFilter } from './permission-filter';
import { PermissionTable } from './permission-table';
import { PermissionDrawer } from './permission-drawer';
import { DEFAULT_PAGE_SIZE } from '@/constants/api';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Permission } from '@/types/permission-types';

export function PermissionManagement() {
  const [search] = useQueryState('search', { defaultValue: '' });
  const [moduleName] = useQueryState('moduleName', { defaultValue: '' });
  const [actionType] = useQueryState('actionType', { defaultValue: '' });
  const [status] = useQueryState('status', { defaultValue: '' });
  const [pageNumber] = useQueryState('page', {
    defaultValue: 1,
    parse: (value) => parseInt(value) || 1,
  });

  const [selectedPermission, setSelectedPermission] = useState<Permission | undefined>();
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit' | 'view'>('create');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentPagination, setCurrentPagination] = useState({
    pageIndex: pageNumber - 1,
    pageSize: DEFAULT_PAGE_SIZE,
  });

  const { data: permissionsData, isLoading, error } = usePermissionsList({
    search: search || undefined,
    moduleName: moduleName || undefined,
    actionType: actionType || undefined,
    isActive: status === 'ACTIVE' ? true : status === 'INACTIVE' ? false : undefined,
    pageNumber: currentPagination.pageIndex + 1,
    pageSize: currentPagination.pageSize,
  });
  const deletePermission = useDeletePermission();

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
    if (confirm('Are you sure you want to delete this permission?')) {
      try {
        await deletePermission.mutateAsync(permission.id);
        toast.success('Permission deleted successfully');
      } catch (error) {
        toast.error('Failed to delete permission');
        throw error; // Re-throw to let the table component handle the error
      }
    }
  };

  const handleCreate = () => {
    setSelectedPermission(undefined);
    setDrawerMode('create');
    setDrawerOpen(true);
  };

  const handlePaginationChange = (pagination: { pageIndex: number; pageSize: number }) => {
    setCurrentPagination(pagination);
    // Update URL query params
    const url = new URL(window.location.href);
    url.searchParams.set('page', (pagination.pageIndex + 1).toString());
    window.history.pushState({}, '', url.toString());
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-destructive">Failed to load permissions</p>
      </div>
    );
  }

  // Calculate pagination values
  const totalCount = permissionsData?.totalCount || 0;
  const pageCount = Math.ceil(totalCount / currentPagination.pageSize);

  return (
    <div>
      <Card className='border-none rounded-none py-3'>
        <CardContent className="space-y-4 px-3">
          <PermissionFilter />
          <PermissionTable
            permissions={permissionsData?.data || []}
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

      {/* Drawer */}
      <PermissionDrawer
        permission={selectedPermission}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        mode={drawerMode}
      />
    </div>
  );
}
