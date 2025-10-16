'use client';

import { RightDrawer } from '@/components/shared/right-drawer';
import { ConfigListForm } from './config-list-form';
import { ConfigList } from '../types';
import { ConfigListFormValues } from '../validations';
import { toast } from 'sonner';
import { useCreateConfigList, useUpdateConfigList } from '../hooks';

interface ConfigListDrawerProps {
  configList: ConfigList | undefined;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit' | 'view';
}

export function ConfigListDrawer({ configList, open, onOpenChange, mode }: ConfigListDrawerProps) {
  const createConfigList = useCreateConfigList();
  const updateConfigList = useUpdateConfigList();

  const getTitle = () => {
    switch (mode) {
      case 'create':
        return 'Add New Config List';
      case 'edit':
        return 'Edit Config List';
      case 'view':
        return 'Config List Details';
      default:
        return 'Config List';
    }
  };

  const handleSubmit = async (data: ConfigListFormValues) => {
    try {
      const payload = {
        ...data,
        isActive: data.isActive ?? true,
      };

      if (configList) {
        await updateConfigList.mutateAsync({ id: configList.id, data: payload });
        toast.success('Config List updated successfully');
      } else {
        await createConfigList.mutateAsync(payload);
        toast.success('Config List created successfully');
      }
      onOpenChange(false);
    } catch (error) {
      toast.error(configList ? 'Failed to update config list' : 'Failed to create config list');
    }
  };

  return (
    <RightDrawer
      open={open}
      onOpenChange={onOpenChange}
      title={getTitle()}
      size="lg"
    >
      <ConfigListForm
        mode={mode}
        configList={configList}
        onSubmit={handleSubmit}
        isLoading={createConfigList.isPending || updateConfigList.isPending}
        onCancel={() => onOpenChange(false)}
      />
    </RightDrawer>
  );
}

