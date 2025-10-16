'use client';

import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { configSettingSchema, ConfigSettingFormValues } from '../validations';
import { ConfigSettingInformationForm } from './config-setting-information-form';
import { ConfigSetting } from '../types';
import { useEffect } from 'react';

interface ConfigSettingFormProps {
  mode: 'create' | 'edit' | 'view';
  configSetting?: ConfigSetting;
  onSubmit: (data: ConfigSettingFormValues) => void;
  isLoading: boolean;
  onCancel: () => void;
}

export function ConfigSettingForm({ mode, configSetting, onSubmit, isLoading, onCancel }: ConfigSettingFormProps) {
  const form = useForm<ConfigSettingFormValues>({
    resolver: zodResolver(configSettingSchema),
    defaultValues: {
      settingKey: '',
      settingName: '',
      description: '',
      isActive: true,
    },
  });

  useEffect(() => {
    if (configSetting) {
      form.reset({
        settingKey: configSetting.settingKey,
        settingName: configSetting.settingName,
        description: configSetting.description || '',
        stringValue: configSetting.stringValue,
        integerValue: configSetting.integerValue,
        booleanValue: configSetting.booleanValue,
        decimalValue: configSetting.decimalValue,
        defaultValue: configSetting.defaultValue,
        isActive: configSetting.isActive,
      });
    }
  }, [configSetting, form]);

  const handleSubmit = (data: ConfigSettingFormValues) => {
    onSubmit(data);
  };

  const isViewMode = mode === 'view';

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <ConfigSettingInformationForm control={form.control} />
        
        {!isViewMode && (
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : configSetting ? 'Update' : 'Create'}
            </Button>
          </div>
        )}
      </form>
    </FormProvider>
  );
}

