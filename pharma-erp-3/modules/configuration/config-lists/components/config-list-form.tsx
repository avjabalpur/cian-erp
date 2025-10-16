'use client';

import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { configListSchema, ConfigListFormValues } from '../validations';
import { ConfigListInformationForm } from './config-list-information-form';
import { ConfigList } from '../types';
import { useEffect } from 'react';

interface ConfigListFormProps {
  mode: 'create' | 'edit' | 'view';
  configList?: ConfigList;
  onSubmit: (data: ConfigListFormValues) => void;
  isLoading: boolean;
  onCancel: () => void;
}

export function ConfigListForm({ mode, configList, onSubmit, isLoading, onCancel }: ConfigListFormProps) {
  const form = useForm<ConfigListFormValues>({
    resolver: zodResolver(configListSchema),
    defaultValues: {
      listCode: '',
      listName: '',
      description: '',
      isActive: true,
    },
  });

  useEffect(() => {
    if (configList) {
      form.reset({
        listCode: configList.listCode,
        listName: configList.listName,
        description: configList.description || '',
        isActive: configList.isActive,
      });
    }
  }, [configList, form]);

  const handleSubmit = (data: ConfigListFormValues) => {
    onSubmit(data);
  };

  const isViewMode = mode === 'view';

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <ConfigListInformationForm control={form.control} />
        
        {!isViewMode && (
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : configList ? 'Update' : 'Create'}
            </Button>
          </div>
        )}
      </form>
    </FormProvider>
  );
}

