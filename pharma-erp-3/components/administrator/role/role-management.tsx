'use client';

import { useState, useMemo } from 'react';
import { useQueryState } from 'nuqs';
import { useCreateRole, useDeleteRole, useUpdateRole, useRoles } from '@/hooks/use-roles';
import { RoleFilter } from './role-filter';
import { RoleTable } from './role-table';
import { RoleDrawer } from './role-drawer';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Role } from '@/types/role';

export function RoleManagement() {
  const [search] = useQueryState('search', { defaultValue: '' });
  const [status] = useQueryState('status', { defaultValue: '' });
  const [pageNumber] = useQueryState('page', {
    defaultValue: 1,
    parse: (value) => parseInt(value) || 1,
  });

  const [selectedRole, setSelectedRole] = useState<Role | undefined>();
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit' | 'view'>('create');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentPagination, setCurrentPagination] = useState({
    pageIndex: pageNumber - 1,
    pageSize: 10,
  });


  const { data: roleData, isLoading } = useRoles()
  const deleteRole = useDeleteRole();
  const roles = roleData?.items || []
  const totalCount = roles?.length || 0
  const pageCount = roles?.length || 0
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
    if (confirm('Are you sure you want to delete this role?')) {
      try {
        await deleteRole.mutateAsync(role.id);
        toast.success('Role deleted successfully');
      } catch (error) {
        toast.error('Failed to delete role');
        throw error; // Re-throw to let the table component handle the error
      }
    }
  };

  const handleCreate = () => {
    setSelectedRole(undefined);
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



  return (
    <div>
      <Card className='border-none rounded-none py-3'>
        <CardContent className="space-y-4 px-3">
          <RoleFilter />
          <RoleTable
            roles={roles || []}
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
      <RoleDrawer
        role={selectedRole}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        mode={drawerMode}
      />
    </div>
  );
}
