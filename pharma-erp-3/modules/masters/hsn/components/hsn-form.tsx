'use client';

import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { HsnMaster } from '../types';
import { hsnMasterSchema, HsnMasterFormValues } from '../validations';
import { HsnInformationForm } from './hsn-information-form';

interface HsnFormProps {
  hsnMaster?: HsnMaster | null;
  mode: 'create' | 'edit' | 'view';
  onSubmit: (data: HsnMasterFormValues) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function HsnForm({ hsnMaster, mode, onSubmit, onCancel, isLoading }: HsnFormProps) {
  const form = useForm<HsnMasterFormValues>({
    resolver: zodResolver(hsnMasterSchema),
    defaultValues: {
      code: hsnMaster?.code || '',
      name: hsnMaster?.name || '',
      description: hsnMaster?.description || '',
      hsnType: hsnMaster?.hsnType || '',
      uqc: hsnMaster?.uqc || '',
      igstRate: hsnMaster?.igstRate || undefined,
      cgstRate: hsnMaster?.cgstRate || undefined,
      sgstRate: hsnMaster?.sgstRate || undefined,
      cessRate: hsnMaster?.cessRate || undefined,
      isReverseCharges: hsnMaster?.isReverseCharges ?? false,
      isActive: hsnMaster?.isActive ?? true,
    },
  });

  const { control, handleSubmit, reset } = form;

  useEffect(() => {
    if (hsnMaster) {
      reset({
        code: hsnMaster.code || '',
        name: hsnMaster.name || '',
        description: hsnMaster.description || '',
        hsnType: hsnMaster.hsnType || '',
        uqc: hsnMaster.uqc || '',
        igstRate: hsnMaster.igstRate || undefined,
        cgstRate: hsnMaster.cgstRate || undefined,
        sgstRate: hsnMaster.sgstRate || undefined,
        cessRate: hsnMaster.cessRate || undefined,
        isReverseCharges: hsnMaster.isReverseCharges ?? false,
        isActive: hsnMaster.isActive ?? true,
      });
    } else {
      reset({
        code: '',
        name: '',
        description: '',
        hsnType: '',
        uqc: '',
        igstRate: undefined,
        cgstRate: undefined,
        sgstRate: undefined,
        cessRate: undefined,
        isReverseCharges: false,
        isActive: true,
      });
    }
  }, [hsnMaster, reset]);

  const handleFormSubmit = async (data: HsnMasterFormValues) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Failed to submit HSN master:', error);
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <HsnInformationForm control={control} />
        
        {mode !== 'view' && (
          <div className="flex justify-end gap-4 pt-4 sticky bottom-0 bg-background py-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : hsnMaster ? 'Update HSN Master' : 'Create HSN Master'}
            </Button>
          </div>
        )}
      </form>
    </FormProvider>
  );
}
