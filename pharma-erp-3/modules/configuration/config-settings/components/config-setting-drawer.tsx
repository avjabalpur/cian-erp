'use client';

import { RightDrawer } from '@/components/shared/right-drawer';
import { ConfigSettingForm } from './config-setting-form';
import { ConfigSetting } from '../types';
import { ConfigSettingFormValues } from '../validations';
import { toast } from 'sonner';
import { useCreateConfigSetting, useUpdateConfigSetting } from '../hooks';

interface ConfigSettingDrawerProps {
  configSetting: ConfigSetting | undefined;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit' | 'view';
}

export function ConfigSettingDrawer({ configSetting, open, onOpenChange, mode }: ConfigSettingDrawerProps) {
  const createConfigSetting = useCreateConfigSetting();
  const updateConfigSetting = useUpdateConfigSetting();

  const getTitle = () => {
    switch (mode) {
      case 'create':
        return 'Add New Config Setting';
      case 'edit':
        return 'Edit Config Setting';
      case 'view':
        return 'Config Setting Details';
      default:
        return 'Config Setting';
    }
  };

  const handleSubmit = async (data: ConfigSettingFormValues) => {
    try {
      const payload = {
        ...data,
        isActive: data.isActive ?? true,
      };

      if (configSetting) {
        await updateConfigSetting.mutateAsync({ id: configSetting.id, data: payload });
        toast.success('Config Setting updated successfully');
      } else {
        await createConfigSetting.mutateAsync(payload as any);
        toast.success('Config Setting created successfully');
      }
      onOpenChange(false);
    } catch (error) {
      toast.error(configSetting ? 'Failed to update config setting' : 'Failed to create config setting');
    }
  };

  return (
    <RightDrawer
      open={open}
      onOpenChange={onOpenChange}
      title={getTitle()}
      size="lg"
    >
      <ConfigSettingForm
        mode={mode}
        configSetting={configSetting}
        onSubmit={handleSubmit}
        isLoading={createConfigSetting.isPending || updateConfigSetting.isPending}
        onCancel={() => onOpenChange(false)}
      />
    </RightDrawer>
  );
}

