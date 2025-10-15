'use client';

import { RightDrawer } from '@/components/shared/right-drawer';
import { RoleForm } from './role-form';
import { Role, CreateRoleData, UpdateRoleData } from '../types';
import { toast } from 'sonner';
import { useCreateRole, useUpdateRole } from '../hooks';

interface RoleDrawerProps {
  role: Role | undefined;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit' | 'view';
}

export function RoleDrawer({ role, open, onOpenChange, mode }: RoleDrawerProps) {
  const createRole = useCreateRole();
  const updateRole = useUpdateRole();
  
  const getTitle = () => {
    switch (mode) {
      case 'create':
        return 'Add New Role';
      case 'edit':
        return 'Edit Role';
      case 'view':
        return 'Role Details';
      default:
        return 'Role';
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      if (role) {
        const updateData: UpdateRoleData = {
          id: role.id,
          name: data.name,
          description: data.description,
          isActive: data.isActive || true,
        };
        await updateRole.mutateAsync({ id: role.id.toString(), data: updateData });
        toast.success('Role updated successfully');
      } else {
        const createData: CreateRoleData = {
          name: data.name,
          description: data.description,
          isActive: data.isActive || true,
        };
        await createRole.mutateAsync(createData);
        toast.success('Role created successfully');
      }
      onOpenChange(false);
    } catch (error) {
      toast.error(role ? 'Failed to update role' : 'Failed to create role');
    }
  };

  return (
    <RightDrawer
      open={open}
      onOpenChange={onOpenChange}
      title={getTitle()}
      size="full"
    >
      <RoleForm
        mode={mode}
        role={role}
        onSubmit={handleSubmit}
        isLoading={createRole.isPending || updateRole.isPending}
        onCancel={() => onOpenChange(false)}
      />
    </RightDrawer>
  );
}

