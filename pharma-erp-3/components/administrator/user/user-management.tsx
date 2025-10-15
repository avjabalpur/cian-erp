'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useQueryState } from 'nuqs';
import { UserFilter } from './user-filter';
import { UserTable } from './user-table';
import { UserDrawer } from './user-drawer';
import { UserRoleAssignment } from './user-role-assignment';
import { toast } from 'sonner';
import { User } from '@/types/user';
import { useUsers } from '@/hooks/use-users';
import { RightDrawer } from '@/components/shared/right-drawer';

export function UserManagement() {
  const [search] = useQueryState('search', { defaultValue: '' });
  const [status] = useQueryState('status', { defaultValue: '' });
  const [page] = useQueryState('page', { defaultValue: '1' });
  const [pageSize] = useQueryState('pageSize', { defaultValue: '10' });

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [roleAssignmentOpen, setRoleAssignmentOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit' | 'view'>('create');

  const currentPagination = useMemo(() => ({
    pageIndex: parseInt(page) - 1,
    pageSize: parseInt(pageSize),
  }), [page, pageSize]);

  const { data: usersData, isLoading, error } = useUsers({
    search: search || undefined,
    status: status || undefined,
    pageNumber: currentPagination.pageIndex + 1,
    pageSize: currentPagination.pageSize,
  });

  const users = usersData?.items || [];
  const totalCount = usersData?.totalCount || 0;
  const pageCount = Math.ceil(totalCount / currentPagination.pageSize);

  const handleCreate = () => {
    setSelectedUser(undefined);
    setDrawerMode('create');
    setDrawerOpen(true);
  };

  const handleView = (user: User) => {
    setSelectedUser(user);
    setDrawerMode('view');
    setDrawerOpen(true);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setDrawerMode('edit');
    setDrawerOpen(true);
  };

  const handleDelete = async (user: User) => {
    if (confirm(`Are you sure you want to delete user "${user.firstName} ${user.lastName}"?`)) {
      try {
        // Implement delete logic here
        toast.success('User deleted successfully');
      } catch (error) {
        toast.error('Failed to delete user');
      }
    }
  };

  const handleAssignRoles = (user: User) => {
    setSelectedUser(user);
    setRoleAssignmentOpen(true);
  };

  const handlePaginationChange = (pagination: { pageIndex: number; pageSize: number }) => {
    // Update URL query parameters
    const newPage = (pagination.pageIndex + 1).toString();
    const newPageSize = pagination.pageSize.toString();
    
    // Update URL state
    const url = new URL(window.location.href);
    url.searchParams.set('page', newPage);
    url.searchParams.set('pageSize', newPageSize);
    window.history.pushState({}, '', url.toString());
  };

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error loading users: {error.message}</p>
      </div>
    );
  }

  return (
    <div>
      <Card className='border-none rounded-none py-1'>
        <CardContent className="space-y-4 px-3">
          <UserFilter />
          <UserTable
            users={users}
            isLoading={isLoading}
            onEdit={handleEdit}
            onView={handleView}
            onDelete={handleDelete}
            onAssignRoles={handleAssignRoles}
            onCreate={handleCreate}
            totalCount={totalCount}
            pageCount={pageCount}
            onPaginationChange={handlePaginationChange}
            currentPagination={currentPagination}
          />
        </CardContent>
      </Card>

      {/* User Create/Edit/View Drawer */}
      <UserDrawer
        user={selectedUser}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        mode={drawerMode}
      />

      {/* Role Assignment Right Drawer */}
      {roleAssignmentOpen && selectedUser && (
        <RightDrawer 
          open={roleAssignmentOpen} 
          onOpenChange={setRoleAssignmentOpen}
          title={`Manage Roles for ${selectedUser.firstName} ${selectedUser.lastName}`}
          description="Assign or remove roles for this user"
          size="xl"
        >
          dnfjkdnj
          {/* <UserRoleAssignment
            userId={selectedUser.id}
            userName={`${selectedUser.firstName} ${selectedUser.lastName}`}
            onClose={() => setRoleAssignmentOpen(false)}
          /> */}
        </RightDrawer>
      )}
    </div>
  );
}
