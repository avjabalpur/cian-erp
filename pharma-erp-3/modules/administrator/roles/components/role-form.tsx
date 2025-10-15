'use client';

import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormInput } from '@/components/shared/forms/form-input';
import { FormCheckbox } from '@/components/shared/forms/form-checkbox';
import { Button } from '@/components/ui/button';
import { Role } from '../types';
import { roleSchema, RoleFormValues } from '../validations';

interface RoleFormProps {
  mode: 'create' | 'edit' | 'view';
  role?: Role | null | undefined;
  onSubmit: (data: RoleFormValues) => Promise<void>;
  isLoading: boolean;
  onCancel: () => void;
}

export function RoleForm({ mode, role, onSubmit, isLoading, onCancel }: RoleFormProps) {
  const form = useForm<RoleFormValues>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: role?.name || '',
      description: role?.description || '',
      isActive: role?.isActive ?? true,
    },
  });

  useEffect(() => {
    if (role) {
      form.reset({
        name: role.name,
        description: role.description,
        isActive: role.isActive,
      });
    }
  }, [role, form]);

  const handleSubmit = async (data: RoleFormValues) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Failed to submit role:', error);
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            control={form.control}
            name="name"
            label="Role Name"
            placeholder="Enter role name"
            inputProps={{ type: "text", autoComplete: "off" }}
            disabled={mode === 'view'}
          />

          <FormInput
            control={form.control}
            name="description"
            label="Description"
            placeholder="Enter role description"
            inputProps={{ type: "text", autoComplete: "off" }}
            disabled={mode === 'view'}
          />

          <FormCheckbox
            control={form.control}
            name="isActive"
            label="Active"
            description="Enable this role for use"
            disabled={mode === 'view'}
          />
        </div>

        <div className="flex justify-end space-x-2 pt-6">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          {mode !== 'view' && (
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : role ? 'Update Role' : 'Create Role'}
            </Button>
          )}
        </div>
      </form>
    </FormProvider>
  );
}

