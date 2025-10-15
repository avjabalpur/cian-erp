'use client';

import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormInput } from '@/components/shared/forms/form-input';
import { FormSelect } from '@/components/shared/forms/form-select';
import { FormCheckbox } from '@/components/shared/forms/form-checkbox';
import { Button } from '@/components/ui/button';
import { Permission } from '../types';
import { permissionSchema, PermissionFormValues } from '../validations';
import { AVAILABLE_MODULES, AVAILABLE_ACTIONS } from '../hooks';

interface PermissionFormProps {
  mode: 'create' | 'edit' | 'view';
  permission?: Permission | null | undefined;
  onSubmit: (data: PermissionFormValues) => Promise<void>;
  isLoading: boolean;
  onCancel: () => void;
}

export function PermissionForm({ mode, permission, onSubmit, isLoading, onCancel }: PermissionFormProps) {
  const form = useForm<PermissionFormValues>({
    resolver: zodResolver(permissionSchema),
    defaultValues: {
      name: permission?.name || '',
      description: permission?.description || '',
      moduleName: permission?.moduleName || '',
      actionType: permission?.actionType || '',
      isActive: permission?.isActive ?? true,
    },
  });

  const watchedModuleName = form.watch('moduleName');
  const watchedActionType = form.watch('actionType');

  useEffect(() => {
    if (permission) {
      form.reset({
        name: permission.name,
        description: permission.description || '',
        moduleName: permission.moduleName,
        actionType: permission.actionType,
        isActive: permission.isActive,
      });
    }
  }, [permission, form]);

  useEffect(() => {
    if (watchedModuleName && watchedActionType && mode === 'create') {
      const generatedName = `${watchedModuleName}.${watchedActionType}`;
      form.setValue('name', generatedName);
    }
  }, [watchedModuleName, watchedActionType, form, mode]);

  const handleSubmit = async (data: PermissionFormValues) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Failed to submit permission:', error);
    }
  };

  const moduleOptions = AVAILABLE_MODULES.map(module => ({
    value: module,
    label: module.charAt(0).toUpperCase() + module.slice(1)
  }));

  const actionOptions = AVAILABLE_ACTIONS.map(action => ({
    value: action,
    label: action.charAt(0).toUpperCase() + action.slice(1)
  }));

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormSelect
            control={form.control}
            name="moduleName"
            label="Module Name"
            options={moduleOptions}
            placeholder="Select module"
            disabled={mode === 'view'}
          />

          <FormSelect
            control={form.control}
            name="actionType"
            label="Action Type"
            options={actionOptions}
            placeholder="Select action type"
            disabled={mode === 'view'}
          />

          <FormInput
            control={form.control}
            name="name"
            label="Permission Name"
            placeholder="Permission name will be auto-generated"
            inputProps={{ type: "text", autoComplete: "off" }}
            disabled={mode === 'view'}
          />

          <FormInput
            control={form.control}
            name="description"
            label="Description"
            placeholder="Enter permission description"
            inputProps={{ type: "text", autoComplete: "off" }}
            disabled={mode === 'view'}
          />

          <FormCheckbox
            control={form.control}
            name="isActive"
            label="Active"
            description="Enable this permission for use"
            disabled={mode === 'view'}
          />
        </div>

        <div className="flex justify-end space-x-2 pt-6">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          {mode !== 'view' && (
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : permission ? 'Update Permission' : 'Create Permission'}
            </Button>
          )}
        </div>
      </form>
    </FormProvider>
  );
}

