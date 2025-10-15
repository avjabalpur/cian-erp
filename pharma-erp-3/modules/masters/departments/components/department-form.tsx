'use client';

import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Department } from '../types';
import { departmentFormSchema, DepartmentFormValues } from '../validations';
import { DepartmentInformationForm } from './department-information-form';

interface DepartmentFormProps {
  department?: Department | null;
  mode: 'create' | 'edit' | 'view';
  onSubmit: (data: DepartmentFormValues) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function DepartmentForm({ department, mode, onSubmit, onCancel, isLoading }: DepartmentFormProps) {
  const form = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentFormSchema),
    defaultValues: {
      code: department?.code || '',
      name: department?.name || '',
      description: department?.description || '',
      uomForMis: department?.uomForMis || '',
      isActive: department?.isActive ?? true,
    },
  });

  const { control, handleSubmit, reset } = form;

  useEffect(() => {
    if (department) {
      reset({
        code: department.code || '',
        name: department.name || '',
        description: department.description || '',
        uomForMis: department.uomForMis || '',
        isActive: department.isActive ?? true,
      });
    } else {
      reset({
        code: '',
        name: '',
        description: '',
        uomForMis: '',
        isActive: true,
      });
    }
  }, [department, reset]);

  const handleFormSubmit = async (data: DepartmentFormValues) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Failed to submit department:', error);
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <DepartmentInformationForm control={control} />
        
        {mode !== 'view' && (
          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : department ? 'Update Department' : 'Create Department'}
            </Button>
          </div>
        )}
      </form>
    </FormProvider>
  );
}

