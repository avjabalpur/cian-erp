'use client';

import { useState, useMemo } from 'react';
import { useQueryState } from 'nuqs';
import { useRoles, useDeleteRole } from '../hooks';
import { RoleTable } from './role-table';
import { RoleDrawer } from './role-drawer';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Role } from '../types';
import { RoleFilter } from './role-filter';

export function RoleManagement() {
  const [search] = useQueryState('search', { defaultValue: '' });
  const [status] = useQueryState('status', { defaultValue: '' });
  const [page] = useQueryState('page', { defaultValue: '1' });
  const [pageSize] = useQueryState('pageSize', { defaultValue: '10' });

  const [selectedRole, setSelectedRole] = useState<Role | undefined>();
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit' | 'view'>('create');
  const [drawerOpen, setDrawerOpen] = useState(false);

  const currentPagination = useMemo(() => ({
    pageIndex: parseInt(page) - 1,
    pageSize: parseInt(pageSize),
  }), [page, pageSize]);

  const { data: roleData, isLoading, error } = useRoles({
    search: search || undefined,
    status: status || undefined,
    pageNumber: currentPagination.pageIndex + 1,
    pageSize: currentPagination.pageSize,
  });

  const deleteRole = useDeleteRole();
  const roles = roleData?.items || [];
  const totalCount = roleData?.totalCount || 0;
  const pageCount = Math.ceil(totalCount / currentPagination.pageSize);

  const handleView = (role: Role) => {
    setSelectedRole(role);
    setDrawerMode('view');
    setDrawerOpen(true);
  };

  const handleEdit = (role: Role) => {
    setSelectedRole(role);
    setDrawerMode('edit');
    setDrawerOpen(true);
  };

  const handleDelete = async (role: Role) => {
    if (confirm(`Are you sure you want to delete role "${role.name}"?`)) {
      try {
        await deleteRole.mutateAsync(role.id.toString());
        toast.success('Role deleted successfully');
      } catch (error) {
        toast.error('Failed to delete role');
      }
    }
  };

  const handleCreate = () => {
    setSelectedRole(undefined);
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
        <p className="text-red-600">Error loading roles: {error.message}</p>
      </div>
    );
  }

  return (
    <div>
      <Card className='border-none rounded-none py-1'>
        <CardContent className="space-y-4 px-3">
          <RoleFilter />
          <RoleTable
            roles={roles}
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

      <RoleDrawer
        role={selectedRole}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        mode={drawerMode}
      />
    </div>
  );
}

