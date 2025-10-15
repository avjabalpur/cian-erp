'use client';

import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Division } from '../types';
import { divisionFormSchema, DivisionFormValues } from '../validations';
import { DivisionInformationForm } from './division-information-form';

interface DivisionFormProps {
  division?: Division | null;
  mode: 'create' | 'edit' | 'view';
  onSubmit: (data: DivisionFormValues) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  departments: { id: number; name: string }[];
}

export function DivisionForm({ division, mode, onSubmit, onCancel, isLoading, departments }: DivisionFormProps) {
  const form = useForm<DivisionFormValues>({
    resolver: zodResolver(divisionFormSchema),
    defaultValues: {
      code: division?.code || '',
      name: division?.name || '',
      description: division?.description || '',
      departmentId: division?.departmentId || 0,
      unit: division?.unit || '',
      conversionFactor: division?.conversionFactor || 1.0,
      isActive: division?.isActive ?? true,
    },
  });

  const { control, handleSubmit, reset } = form;

  useEffect(() => {
    if (division) {
      reset({
        code: division.code || '',
        name: division.name || '',
        description: division.description || '',
        departmentId: division.departmentId || 0,
        unit: division.unit || '',
        conversionFactor: division.conversionFactor || 1.0,
        isActive: division.isActive ?? true,
      });
    } else {
      reset({
        code: '',
        name: '',
        description: '',
        departmentId: 0,
        unit: '',
        conversionFactor: 1.0,
        isActive: true,
      });
    }
  }, [division, reset]);

  const handleFormSubmit = async (data: DivisionFormValues) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Failed to submit division:', error);
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <DivisionInformationForm control={control} departments={departments} />
        
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
              {isLoading ? 'Saving...' : division ? 'Update Division' : 'Create Division'}
            </Button>
          </div>
        )}
      </form>
    </FormProvider>
  );
}
