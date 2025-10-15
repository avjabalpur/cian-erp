'use client';

import { RightDrawer } from '@/components/shared/right-drawer';
import { RoleForm } from './role-form';
import { Role } from '@/types/role';
import { toast } from 'sonner';
import { useCreateRole, useUpdateRole } from '@/hooks/use-roles';

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
        const updateData: any = {
          name: data.name,
          description: data.description,
          permissions: data.permissions || [],
          isActive: data.isActive || true,
          id: role.id,
        };
        await updateRole.mutateAsync({ id: role.id, data: updateData });
        toast.success('Role updated successfully');
      } else {
        const createData: any = {
          name: data.name,
          description: data.description,
          permissions: data.permissions || [],
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
