'use client';

import { RightDrawer } from '@/components/shared/right-drawer';
import { PermissionForm } from './permission-form';
import { Permission, CreatePermissionData, UpdatePermissionData } from '../types';
import { toast } from 'sonner';
import { useCreatePermission, useUpdatePermission } from '../hooks';

interface PermissionDrawerProps {
  permission: Permission | undefined;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit' | 'view';
}

export function PermissionDrawer({ permission, open, onOpenChange, mode }: PermissionDrawerProps) {
  const createPermission = useCreatePermission();
  const updatePermission = useUpdatePermission();
  
  const getTitle = () => {
    switch (mode) {
      case 'create':
        return 'Add New Permission';
      case 'edit':
        return 'Edit Permission';
      case 'view':
        return 'Permission Details';
      default:
        return 'Permission';
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      if (permission) {
        const updateData: UpdatePermissionData = {
          id: permission.id,
          name: data.name,
          description: data.description,
          moduleName: data.moduleName,
          actionType: data.actionType,
        };
        await updatePermission.mutateAsync({ id: permission.id.toString(), data: updateData });
        toast.success('Permission updated successfully');
      } else {
        const createData: CreatePermissionData = {
          name: data.name,
          description: data.description,
          moduleName: data.moduleName,
          actionType: data.actionType,
        };
        await createPermission.mutateAsync(createData);
        toast.success('Permission created successfully');
      }
      onOpenChange(false);
    } catch (error) {
      toast.error(permission ? 'Failed to update permission' : 'Failed to create permission');
    }
  };

  return (
    <RightDrawer
      open={open}
      onOpenChange={onOpenChange}
      title={getTitle()}
      size="xl"
    >
      <PermissionForm
        mode={mode}
        permission={permission}
        onSubmit={handleSubmit}
        isLoading={createPermission.isPending || updatePermission.isPending}
        onCancel={() => onOpenChange(false)}
      />
    </RightDrawer>
  );
}

