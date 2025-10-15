'use client';

import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Dosage } from '../types';
import { dosageFormSchema, DosageFormValues } from '../validations';
import { DosageInformationForm } from './dosage-information-form';

interface DosageFormProps {
  dosage?: Dosage | null;
  mode: 'create' | 'edit' | 'view';
  onSubmit: (data: DosageFormValues) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function DosageForm({ dosage, mode, onSubmit, onCancel, isLoading }: DosageFormProps) {
  const form = useForm<DosageFormValues>({
    resolver: zodResolver(dosageFormSchema),
    defaultValues: {
      name: dosage?.name || '',
      registerDate: dosage?.registerDate || '',
      isActive: dosage?.isActive ?? true,
    },
  });

  const { control, handleSubmit, reset } = form;

  useEffect(() => {
    if (dosage) {
      reset({
        name: dosage.name || '',
        registerDate: dosage.registerDate || '',
        isActive: dosage.isActive ?? true,
      });
    } else {
      reset({
        name: '',
        registerDate: '',
        isActive: true,
      });
    }
  }, [dosage, reset]);

  const handleFormSubmit = async (data: DosageFormValues) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Failed to submit dosage:', error);
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <DosageInformationForm control={control} />
        
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
              {isLoading ? 'Saving...' : dosage ? 'Update Dosage' : 'Create Dosage'}
            </Button>
          </div>
        )}
      </form>
    </FormProvider>
  );
}
